import os, glob, copy, math, random
import numpy as np, pandas as pd
from PIL import Image
import torch, torch.nn as nn, torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# 1. setari generale
SEED, NUM_CLASSES, IMG_SIZE = 42, 5, 128
BATCH_SIZE, EPOCHS, PATIENCE = 48, 80, 18
LR, WD, LABEL_SMOOTH = 2e-4, 2e-4, 0.08
MIXUP_A, CUTMIX_A, AUG_PROB, EMA_DECAY, TTA = 0.30, 0.60, 0.60, 0.9975, 6
WORKERS = 0 if os.name == "nt" else 2
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# 2. seed si cautarea datelor
def set_seed(s=SEED):
    random.seed(s)
    np.random.seed(s)
    torch.manual_seed(s)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(s)
        torch.backends.cudnn.benchmark = True

def find_data():
    roots = [os.environ.get("DATA_ROOT", ""), "/content/date_proiect", "../data/raw", "data/raw", "."]
    files = []
    for r in roots:
        if r:
            files += glob.glob(os.path.join(r, "**", "train.csv"), recursive=True)
    if not files:
        raise FileNotFoundError("Nu am gasit train.csv. Seteaza DATA_ROOT sau dezarhiveaza datele.")
    base = os.path.dirname(files[0])
    return base, os.path.join(base, "train.csv"), os.path.join(base, "test.csv"), os.path.join(base, "train"), os.path.join(base, "test")

set_seed()
BASE, TRAIN_CSV, TEST_CSV, TRAIN_DIR, TEST_DIR = find_data()
OUT = "/content/output" if os.path.exists("/content") else "output"
os.makedirs(OUT, exist_ok=True)
BEST = {k: os.path.join(OUT, f"best_{k}.pth") for k in ["rgb", "edge", "freq"]}
HIST = {k: os.path.join(OUT, f"history_{k}.csv") for k in ["rgb", "edge", "freq"]}
print("base_dir:", BASE)
print("device:", DEVICE)

# 3. functii ajutatoare
def img_path(folder, img_id):
    p = os.path.join(folder, str(img_id))
    if os.path.exists(p):
        return p
    for e in [".png", ".jpg", ".jpeg", ".bmp"]:
        if os.path.exists(p + e):
            return p + e
    raise FileNotFoundError("Nu gasesc imaginea: " + str(img_id))

def amp():
    return torch.amp.autocast(device_type="cuda" if DEVICE == "cuda" else "cpu", enabled=(DEVICE == "cuda"))
def worker_seed(_):
    np.random.seed(torch.initial_seed() % 2**32)
    random.seed(torch.initial_seed() % 2**32)
def gen(seed=SEED):
    g = torch.Generator()
    g.manual_seed(seed)
    return g

# 4. dataset si dataloader
class ImgDS(Dataset):
    def __init__(self, df, folder, tfm=None, labels=True):
        self.df, self.folder, self.tfm, self.labels = df.reset_index(drop=True), folder, tfm, labels
    def __len__(self):
        return len(self.df)
    def __getitem__(self, i):
        r = self.df.iloc[i]
        x = Image.open(img_path(self.folder, r["id"])).convert("RGB")
        x = self.tfm(x) if self.tfm else x
        return (x, int(r["label"]) - 1) if self.labels else (x, str(r["id"]))

def loader(df, folder, tfm, labels=True, shuffle=False):
    return DataLoader(ImgDS(df, folder, tfm, labels), BATCH_SIZE, shuffle, num_workers=WORKERS,
                      pin_memory=(DEVICE=="cuda"), worker_init_fn=worker_seed if shuffle else None,
                      generator=gen() if shuffle else None, drop_last=shuffle)

# 5. transformari pentru edge si freq
class EdgeT:
    def __init__(self, train=False):
        self.train=train
        self.resize=transforms.Resize((IMG_SIZE, IMG_SIZE))
        self.to_tensor=transforms.ToTensor()
        self.aug=transforms.Compose([transforms.RandomHorizontalFlip(.5),
            transforms.RandomAffine(8, translate=(.04,.04), scale=(.92,1.08), shear=3)])
        self.kx=torch.tensor([[-1.,0.,1.],[-2.,0.,2.],[-1.,0.,1.]]).view(1,1,3,3)
        self.ky=torch.tensor([[-1.,-2.,-1.],[0.,0.,0.],[1.,2.,1.]]).view(1,1,3,3)
        self.lap=torch.tensor([[0.,1.,0.],[1.,-4.,1.],[0.,1.,0.]]).view(1,1,3,3)
    def norm(self,x):
        return (x-x.min())/(x.max()-x.min()+1e-6)
    def __call__(self,img):
        # edge = grayscale + sobel + laplacian
        img=self.resize(img)
        img=self.aug(img) if self.train else img
        g=self.to_tensor(img.convert("L")).unsqueeze(0)
        gx,gy=F.conv2d(g,self.kx,padding=1),F.conv2d(g,self.ky,padding=1)
        edge=torch.sqrt(gx**2+gy**2)
        lap=torch.abs(F.conv2d(g,self.lap,padding=1))
        return (torch.stack([self.norm(g.squeeze()), self.norm(edge.squeeze()), self.norm(lap.squeeze())])-0.5)/0.5

class FreqT:
    def __init__(self, train=False):
        self.train=train
        self.resize=transforms.Resize((IMG_SIZE, IMG_SIZE))
        self.to_tensor=transforms.ToTensor()
        self.aug=transforms.Compose([transforms.RandomHorizontalFlip(.5),
            transforms.RandomAffine(8, translate=(.04,.04), scale=(.92,1.08))])
    def norm(self,x):
        return (x-x.min())/(x.max()-x.min()+1e-6)
    def __call__(self,img):
        # edge = grayscale + sobel + laplacian
        img=self.resize(img)
        img=self.aug(img) if self.train else img
        # freq = informatii din transformata fourier
        x=self.to_tensor(img.convert("L")).squeeze(0)
        fs=torch.fft.fftshift(torch.fft.fft2(x))
        mag=torch.log1p(torch.abs(fs))
        h,w=mag.shape
        cy,cx=h//2,w//2
        yy,xx=torch.meshgrid(torch.arange(h), torch.arange(w), indexing="ij")
        low=(torch.sqrt((yy-cy).float()**2+(xx-cx).float()**2)<=min(h,w)//4).float()
        phase=torch.cos(torch.angle(fs))
        return (torch.stack([self.norm(mag*low), self.norm(mag*(1-low)), self.norm(phase)])-0.5)/0.5

rgb_train=transforms.Compose([transforms.Resize((IMG_SIZE,IMG_SIZE)), transforms.RandomHorizontalFlip(.5),
    transforms.RandomVerticalFlip(.15), transforms.RandomAffine(12, translate=(.06,.06), scale=(.88,1.12), shear=5),
    transforms.ColorJitter(.18,.22,.12,.05), transforms.RandomGrayscale(.05), transforms.ToTensor(),
    transforms.RandomErasing(p=.25, scale=(.01,.08), ratio=(.3,3.3)), transforms.Normalize([.5]*3,[.5]*3)])
rgb_val=transforms.Compose([transforms.Resize((IMG_SIZE,IMG_SIZE)), transforms.ToTensor(), transforms.Normalize([.5]*3,[.5]*3)])
TFM={"rgb":(rgb_train,rgb_val), "edge":(EdgeT(True),EdgeT(False)), "freq":(FreqT(True),FreqT(False))}

def drop_path(x,p=0.,train=False):
    if p==0 or not train:
        return x
    keep=1-p
    mask=(keep+torch.rand((x.shape[0],)+(1,)*(x.ndim-1), device=x.device, dtype=x.dtype)).floor()
    return x.div(keep)*mask

# 6. blocuri pentru reteaua cnn
class DropPath(nn.Module):
    def __init__(self,p=0.):
        super().__init__()
        self.p=p
    def forward(self,x):
        return drop_path(x,self.p,self.training)

class CBA(nn.Module):
    def __init__(self,a,b,k=3,s=1,p=1,g=1,d=1,act=True):
        super().__init__()
        self.net=nn.Sequential(nn.Conv2d(a,b,k,s,p,groups=g,dilation=d,bias=False), nn.BatchNorm2d(b), nn.SiLU(True) if act else nn.Identity())
    def forward(self,x):
        return self.net(x)

class SE(nn.Module):
    def __init__(self,c,r=8):
        super().__init__()
        m=max(c//r,8)
        self.net=nn.Sequential(nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(c,m,bias=False), nn.SiLU(True), nn.Linear(m,c,bias=False), nn.Sigmoid())
    def forward(self,x):
        return x*self.net(x).view(x.size(0),x.size(1),1,1)

class ResSE(nn.Module):
    def __init__(self,a,b,drop=0.,dp=0.):
        super().__init__()
        self.main=nn.Sequential(CBA(a,b), nn.Dropout2d(drop) if drop else nn.Identity(),
            nn.Conv2d(b,b,3,1,1,groups=b,bias=False), nn.BatchNorm2d(b), nn.SiLU(True),
            nn.Conv2d(b,b,1,bias=False), nn.BatchNorm2d(b), SE(b), DropPath(dp) if dp else nn.Identity())
        self.skip=nn.Identity() if a==b else nn.Sequential(nn.Conv2d(a,b,1,bias=False), nn.BatchNorm2d(b))
        self.act=nn.SiLU(True)
    def forward(self,x):
        return self.act(self.main(x)+self.skip(x))

class ASPP(nn.Module):
    def __init__(self,a,b):
        super().__init__()
        m=b//4
        self.br=nn.ModuleList([CBA(a,m,1,p=0), CBA(a,m,p=2,d=2), CBA(a,m,p=4,d=4), CBA(a,m,p=6,d=6)])
        self.pool=nn.Sequential(nn.Conv2d(a,m,1,bias=False), nn.BatchNorm2d(m), nn.SiLU(True))
        self.proj=CBA(m*5,b,1,p=0)
    def forward(self,x):
        p=F.interpolate(self.pool(F.adaptive_avg_pool2d(x,1)), size=x.shape[2:], mode="bilinear", align_corners=False)
        return self.proj(torch.cat([b(x) for b in self.br]+[p],1))

# 7. modelul deepsignalcnn
class DeepSignalCNN(nn.Module):
    def __init__(self):
        super().__init__()
        d=torch.linspace(0,.15,10).tolist()
        self.stem=nn.Sequential(CBA(3,32),CBA(32,64),CBA(64,64),nn.MaxPool2d(2))
        self.s1=nn.Sequential(ResSE(64,96,.02,d[0]),ResSE(96,96,.02,d[1]),nn.MaxPool2d(2))
        self.s2=nn.Sequential(ResSE(96,128,.04,d[2]),ResSE(128,128,.04,d[3]),nn.MaxPool2d(2))
        self.s3=nn.Sequential(ResSE(128,256,.06,d[4]),ResSE(256,256,.06,d[5]),nn.MaxPool2d(2))
        self.s4=nn.Sequential(ResSE(256,384,.08,d[6]),ResSE(384,384,.08,d[7]))
        self.s5=nn.Sequential(ResSE(384,512,.10,d[8]),ResSE(512,512,.10,d[9]))
        self.aspp=ASPP(512,512)
        self.head=nn.Sequential(nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.BatchNorm1d(512),
            nn.Dropout(.40), nn.Linear(512,384), nn.SiLU(True), nn.BatchNorm1d(384), nn.Dropout(.30), nn.Linear(384,NUM_CLASSES))
        self.apply(self.init_w)
    def init_w(self,m):
        if isinstance(m,nn.Conv2d):
            nn.init.kaiming_normal_(m.weight,mode="fan_out",nonlinearity="relu")
        elif isinstance(m,nn.Linear):
            nn.init.xavier_uniform_(m.weight)
            nn.init.zeros_(m.bias) if m.bias is not None else None
        elif isinstance(m,(nn.BatchNorm1d,nn.BatchNorm2d)):
            nn.init.ones_(m.weight)
            nn.init.zeros_(m.bias)
    def forward(self,x):
        for b in [self.stem,self.s1,self.s2,self.s3,self.s4,self.s5,self.aspp]:
            x=b(x)
        return self.head(x)

# 8. ema, mixup, cutmix si scheduler
class EMA:
    def __init__(self,m):
        self.m=copy.deepcopy(m).eval()
        self.d=EMA_DECAY
        [p.requires_grad_(False) for p in self.m.parameters()]
    @torch.no_grad()
    def update(self,m):
        s=m.state_dict()
        for k,v in self.m.state_dict().items():
            v.copy_(v*self.d+s[k].detach()*(1-self.d) if v.dtype.is_floating_point else s[k])

def mixup(x,y,a):
    lam=np.random.beta(a,a)
    idx=torch.randperm(x.size(0),device=x.device)
    return lam*x+(1-lam)*x[idx],y,y[idx],lam
def cutmix(x,y,a):
    lam=np.random.beta(a,a)
    idx=torch.randperm(x.size(0),device=x.device)
    _,_,h,w=x.shape
    cw,ch=int(w*np.sqrt(1-lam)),int(h*np.sqrt(1-lam))
    cx,cy=np.random.randint(w),np.random.randint(h)
    x1,x2=np.clip(cx-cw//2,0,w),np.clip(cx+cw//2,0,w)
    y1,y2=np.clip(cy-ch//2,0,h),np.clip(cy+ch//2,0,h)
    z=x.clone()
    z[:,:,y1:y2,x1:x2]=x[idx,:,y1:y2,x1:x2]
    return z,y,y[idx],1-((x2-x1)*(y2-y1)/(h*w))
def mloss(fn,p,a,b,lam):
    return lam*fn(p,a)+(1-lam)*fn(p,b)

class WarmCos(torch.optim.lr_scheduler._LRScheduler):
    def __init__(self,opt,warm=5,total=EPOCHS,min_lr=5e-7):
        self.warm,self.total,self.min_lr=warm,total,min_lr
        super().__init__(opt)
    def get_lr(self):
        if self.last_epoch<self.warm:
            return [b*(self.last_epoch+1)/self.warm for b in self.base_lrs]
        q=(self.last_epoch-self.warm)/max(self.total-self.warm,1)
        c=.5*(1+math.cos(math.pi*q))
        return [self.min_lr+(b-self.min_lr)*c for b in self.base_lrs]

# 9. antrenare si evaluare
def train_epoch(m,ema,dl,opt,loss_fn,scaler):
    m.train()
    loss_sum=ok=n=0
    for x,y in dl:
        x,y=x.to(DEVICE,non_blocking=True),y.to(DEVICE,non_blocking=True)
        opt.zero_grad(set_to_none=True)
        with amp():
            # aplic uneori mixup sau cutmix
            if np.random.rand()<AUG_PROB:
                x2,a,b,lam = mixup(x,y,MIXUP_A) if np.random.rand()<.5 else cutmix(x,y,CUTMIX_A)
                out=m(x2)
                loss=mloss(loss_fn,out,a,b,lam)
            else:
                out=m(x)
                loss=loss_fn(out,y)
        scaler.scale(loss).backward()
        scaler.unscale_(opt)
        torch.nn.utils.clip_grad_norm_(m.parameters(),2)
        scaler.step(opt)
        scaler.update()
        ema.update(m)
        bs=y.size(0)
        loss_sum+=loss.item()*bs
        ok+=(out.argmax(1)==y).sum().item()
        n+=bs
    return loss_sum/n, ok/n

@torch.no_grad()
def eval_model(m,dl,loss_fn=None):
    m.eval()
    loss_sum=ok=n=0
    ys=[]
    ps=[]
    for x,y in dl:
        x,y=x.to(DEVICE,non_blocking=True),y.to(DEVICE,non_blocking=True)
        with amp():
            out=m(x)
            loss=loss_fn(out,y) if loss_fn else torch.tensor(0.)
        p=out.argmax(1)
        bs=y.size(0)
        loss_sum+=loss.item()*bs
        ok+=(p==y).sum().item()
        n+=bs
        ys.append(y.cpu().numpy())
        ps.append(p.cpu().numpy())
    return loss_sum/max(n,1), ok/n, np.concatenate(ys), np.concatenate(ps)

@torch.no_grad()
def logits(m,dl,ids=False):
    m.eval()
    out=[]
    img_ids=[]
    for b in dl:
        x=b[0].to(DEVICE,non_blocking=True)
        img_ids += list(b[1]) if ids else []
        with amp():
            out.append(m(x).cpu().numpy())
    z=np.concatenate(out)
    return (z,img_ids) if ids else z

class Temp(nn.Module):
    def __init__(self):
        super().__init__()
        self.log_t=nn.Parameter(torch.log(torch.ones(1)*1.5))
    def forward(self,x):
        return x/torch.exp(self.log_t)
    def fit(self,z,y):
        z=torch.FloatTensor(z).to(DEVICE)
        y=torch.LongTensor(y).to(DEVICE)
        opt=torch.optim.LBFGS([self.log_t],lr=.01,max_iter=50)
        ce=nn.CrossEntropyLoss()
        def closure():
            opt.zero_grad()
            l=ce(self(z),y)
            l.backward()
            return l
        opt.step(closure)
        print("temperature:", round(torch.exp(self.log_t).item(),4))
        return self
def probs(z,t):
    return torch.softmax(t(torch.FloatTensor(z).to(DEVICE)),1).detach().cpu().numpy()

def fit_one(name, tr_tfm, va_tfm, tr, va, weights):
    print("\nantrenez modelul:", name.upper())
    m=DeepSignalCNN().to(DEVICE)
    ema=EMA(m)
    tr_dl,va_dl=loader(tr,TRAIN_DIR,tr_tfm,True,True),loader(va,TRAIN_DIR,va_tfm,True,False)
    loss_fn=nn.CrossEntropyLoss(weight=weights,label_smoothing=LABEL_SMOOTH)
    opt=torch.optim.AdamW(m.parameters(),lr=LR,weight_decay=WD)
    sch=WarmCos(opt)
    scaler=torch.amp.GradScaler(enabled=(DEVICE=="cuda"))
    best,wait,hist=-1,0,[]
    for ep in range(1,EPOCHS+1):
        tl,ta=train_epoch(m,ema,tr_dl,opt,loss_fn,scaler)
        vl,va_acc=eval_model(ema.m,va_dl,loss_fn)[:2]
        sch.step()
        hist.append({"epoch":ep,"train_loss":tl,"train_acc":ta,"val_loss":vl,"val_acc":va_acc,"lr":opt.param_groups[0]["lr"]})
        print(f"{ep:02d}/{EPOCHS} train={ta:.4f} val={va_acc:.4f} lr={opt.param_groups[0]['lr']:.2e}")
        if va_acc>best:
            best,wait=va_acc,0
            torch.save(ema.m.state_dict(),BEST[name])
        else:
            wait+=1
            if wait>=PATIENCE:
                print("early stopping")
                break
    pd.DataFrame(hist).to_csv(HIST[name],index=False)
    m.load_state_dict(torch.load(BEST[name],map_location=DEVICE))
    m.eval()
    print("cel mai bun", name, "val_acc =", best)
    return m, va_dl

# 10. citire date si split
train_df=pd.read_csv(TRAIN_CSV)
test_df=pd.read_csv(TEST_CSV)
tr,va=train_test_split(train_df,test_size=.20,random_state=SEED,stratify=train_df["label"])
cnt=tr["label"].value_counts().sort_index().values.astype(np.float32)
weights=torch.tensor(cnt.sum()/(NUM_CLASSES*cnt),dtype=torch.float32,device=DEVICE)
y_val=va["label"].values-1
print("train:", tr.shape, "val:", va.shape, "test:", test_df.shape, "weights:", weights.detach().cpu().numpy())

# 11. antrenez cele 3 modele: rgb, edge si freq
models,dls={},{}
for name in ["rgb","edge","freq"]:
    models[name], dls[name] = fit_one(name, TFM[name][0], TFM[name][1], tr, va, weights)

# 12. caut ponderile pentru ensemble
print("\ntemperature scaling si ensemble")
val_logits={k:logits(models[k],dls[k]) for k in models}
temps={k:Temp().to(DEVICE).fit(val_logits[k],y_val) for k in models}
val_probs={k:probs(val_logits[k],temps[k]) for k in models}
for k,p in val_probs.items():
    print("val accuracy", k, "=", accuracy_score(y_val,p.argmax(1)))

best=(-1,(.85,.05,.10))
for wr in np.arange(0,1.01,.05):
    for we in np.arange(0,1.01-wr,.05):
        wf=round(1-wr-we,10)
        p=wr*val_probs["rgb"]+we*val_probs["edge"]+wf*val_probs["freq"]
        a=accuracy_score(y_val,p.argmax(1))
        if a>best[0]:
            best=(a,(float(wr),float(we),float(wf)))
wr,we,wf=best[1]
print("\ncea mai buna pondere rgb:", wr)
print("cea mai buna pondere edge:", we)
print("cea mai buna pondere freq:", wf)
print("cea mai buna acuratete ensemble:", best[0])
vp=wr*val_probs["rgb"]+we*val_probs["edge"]+wf*val_probs["freq"]
print("\nmatrice de confuzie:")
print(confusion_matrix(y_val,vp.argmax(1)))
print("\nraport clasificare:")
print(classification_report(y_val,vp.argmax(1),digits=4))

# 13. tta pentru rgb
def rgb_tta_transforms():
    resize_big = transforms.Resize((int(IMG_SIZE * 1.1), int(IMG_SIZE * 1.1)))
    norm = transforms.Normalize([.5] * 3, [.5] * 3)

    return [
        rgb_val,
        transforms.Compose([
            transforms.Resize((IMG_SIZE, IMG_SIZE)),
            transforms.RandomHorizontalFlip(1),
            transforms.ToTensor(),
            norm,
        ]),
        transforms.Compose([
            resize_big,
            transforms.CenterCrop(IMG_SIZE),
            transforms.ToTensor(),
            norm,
        ]),
        transforms.Compose([
            resize_big,
            transforms.CenterCrop(IMG_SIZE),
            transforms.RandomHorizontalFlip(1),
            transforms.ToTensor(),
            norm,
        ]),
        transforms.Compose([
            transforms.Resize((IMG_SIZE, IMG_SIZE)),
            transforms.ColorJitter(brightness=.1),
            transforms.ToTensor(),
            norm,
        ]),
        transforms.Compose([
            transforms.Resize((IMG_SIZE, IMG_SIZE)),
            transforms.ColorJitter(contrast=.1),
            transforms.ToTensor(),
            norm,
        ]),
    ]


def pred_one(name, tta=False):
    outs = []
    ids = None
    tfms = rgb_tta_transforms() if name == "rgb" and tta else [TFM[name][1]]

    for t in tfms[:TTA if tta else 1]:
        test_loader = loader(test_df, TEST_DIR, t, False, False)
        z, ids = logits(models[name], test_loader, True)
        outs.append(probs(z, temps[name]))

    return np.mean(outs, 0), ids

# 14. predictii pe test si salvare fisiere
p_rgb,ids=pred_one("rgb",True)
p_edge,_=pred_one("edge")
p_freq,_=pred_one("freq")
p_test=wr*p_rgb+we*p_edge+wf*p_freq
test_predictions=p_test.argmax(1)+1

submission=pd.DataFrame({"id":ids,"label":test_predictions.astype(int)})
submission.to_csv(os.path.join(OUT,"submission_deepsignalcnn.csv"),index=False)

prob_df=pd.DataFrame(p_test,columns=[f"prob_class_{i}" for i in range(1,NUM_CLASSES+1)])
prob_df.insert(0,"id",ids)
prob_df.to_csv(os.path.join(OUT,"test_probabilities_deepsignalcnn.csv"),index=False)

print("\nsubmission salvat la:", os.path.join(OUT,"submission_deepsignalcnn.csv"))
print("probabilitati salvate la:", os.path.join(OUT,"test_probabilities_deepsignalcnn.csv"))

print("\ndistributie predictii:")
print(submission["label"].value_counts().sort_index())

print("\nprimele predictii:")
print(submission.head())
