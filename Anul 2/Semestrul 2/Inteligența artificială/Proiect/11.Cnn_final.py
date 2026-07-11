import os, glob, copy, math, random
import numpy as np, pandas as pd
from scipy import ndimage
from PIL import Image, ImageOps
import torch, torch.nn as nn, torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report

# 1. setari generale
MAIN_SEED, EXTRA_SEED, NUM_CLASSES = 42, 2026, 5
IMG_H = IMG_W = 128
BATCH, EPOCHS_2D, EPOCHS_1D, PATIENCE = 48, 100, 100, 22
LR, WD, LABEL_SMOOTH = 2e-4, 2e-4, 0.05
MIXUP_A, CUTMIX_A, AUG_PROB, EMA_DECAY, TTA = 0.20, 0.40, 0.50, 0.9975, 8
W_MAIN, W_EXTRA, W_PROFILE = 0.65, 0.10, 0.25
WORKERS = 0 if os.name == "nt" else 2
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# 2. seed si cautarea datelor
def set_seed(s):
    # fixez seed-ul pentru python, numpy si torch
    random.seed(s)
    np.random.seed(s)
    torch.manual_seed(s)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(s)
        torch.backends.cudnn.benchmark=True

def find_data():
    roots=[os.environ.get("DATA_ROOT",""),"/content/date_proiect","../data/raw","data/raw","."]
    files=[]
    for r in roots:
        if r:
            files+=glob.glob(os.path.join(r,"**","train.csv"),recursive=True)
    if not files:
        raise FileNotFoundError("nu am gasit train.csv. seteaza DATA_ROOT sau dezarhiveaza datele.")
    b=os.path.dirname(files[0])
    return b,os.path.join(b,"train.csv"),os.path.join(b,"test.csv"),os.path.join(b,"train"),os.path.join(b,"test")

set_seed(MAIN_SEED)
BASE, TRAIN_CSV, TEST_CSV, TRAIN_DIR, TEST_DIR = find_data()
OUT="/content/output" if os.path.exists("/content") else "output"
os.makedirs(OUT,exist_ok=True)
BEST_MAIN=os.path.join(OUT,"best_2d_main_seed42.pth")
BEST_EXTRA=os.path.join(OUT,"best_2d_extra_seed2026.pth")
BEST_PROFILE=os.path.join(OUT,"best_1d_profile.pth")
SUB_PATH=os.path.join(OUT,"submission_LAST_BEST.csv")
PROB_PATH=os.path.join(OUT,"test_probabilities_LAST_BEST.csv")
print("base_dir:", BASE)
print("device:", DEVICE)

# 3. functii ajutatoare
def img_path(folder,img_id):
    # construiesc calea catre imagine
    # daca in csv id-ul are deja extensia, o folosesc direct
    p=os.path.join(folder,str(img_id))
    if os.path.exists(p):
        return p
    # daca id-ul nu are extensie, incerc extensiile uzuale
    for e in [".png",".jpg",".jpeg",".bmp"]:
        if os.path.exists(p+e):
            return p+e
    raise FileNotFoundError("nu gasesc imaginea: "+str(img_id))

def amp():
    return torch.amp.autocast(device_type="cuda" if DEVICE=="cuda" else "cpu", enabled=(DEVICE=="cuda"))

def seed_worker(_):
    # fiecare worker din dataloader primeste seed propriu
    np.random.seed(torch.initial_seed()%2**32)
    random.seed(torch.initial_seed()%2**32)

def make_gen(s):
    g=torch.Generator()
    g.manual_seed(s)
    return g

def make_loader(ds,shuffle=False,drop=False,seed=MAIN_SEED,batch=BATCH):
    # creez dataloader pentru train, validation sau test
    # drop_last este util la train ca batchnorm sa primeasca batch-uri complete
    return DataLoader(ds,batch,shuffle,drop_last=drop,num_workers=WORKERS,pin_memory=(DEVICE=="cuda"),
                      worker_init_fn=seed_worker if shuffle else None, generator=make_gen(seed) if shuffle else None)

# 4. dataset pentru imaginile 2d
class ImageDS(Dataset):
    # dataset pentru imaginile rgb folosite de modelul 2d
    def __init__(self,df,folder,tfm=None,labels=True):
        self.df,self.folder,self.tfm,self.labels=df.reset_index(drop=True),folder,tfm,labels
    def __len__(self):
        return len(self.df)
    def __getitem__(self,i):
        # citesc o imagine si o transform in tensor
        r=self.df.iloc[i]
        x=Image.open(img_path(self.folder,r["id"])).convert("RGB")
        x=self.tfm(x) if self.tfm else x
        # in train/validation returnez si eticheta, iar la test returnez id-ul
        return (x,int(r["label"])-1) if self.labels else (x,str(r["id"]))

# 5. feature-uri pentru modelul 1d
def profile_features(arr):
    # transform imaginea grayscale intr-un semnal 1d pe coloane
    # modelul 1d invata forma semnalului, nu imaginea completa 2d
    img=arr.astype(np.float32)/255.0
    # statistici simple pe fiecare coloana
    mean,maxv,std=img.mean(0),img.max(0),img.std(0)
    # smooth retine trendul, detail retine diferentele fine
    smooth=ndimage.gaussian_filter1d(mean,2)
    detail=mean-smooth
    diff=np.gradient(mean)
    # iau si media pixelilor mai luminosi din fiecare coloana
    thr=np.percentile(img,75,axis=0)
    mask=img>thr[np.newaxis,:]
    bright=np.where(mask.sum(0)>0,(img*mask).sum(0)/(mask.sum(0)+1e-8),0.0)
    feats=np.stack([mean,maxv,std,diff,smooth,detail,bright]).astype(np.float32)
    # normalizez fiecare canal intre -1 si 1
    for c in range(feats.shape[0]):
        mn,mx=feats[c].min(),feats[c].max()
        feats[c]=2*(feats[c]-mn)/(mx-mn)-1 if mx-mn>1e-6 else 0
    return torch.from_numpy(feats)

# 6. dataset pentru profilurile 1d
class ProfileDS(Dataset):
    # dataset pentru modelul 1d
    # citeste imaginea grayscale si intoarce profilurile de mai sus
    def __init__(self,df,folder,labels=True,train=False,shift=0):
        self.df,self.folder,self.labels,self.train,self.shift=df.reset_index(drop=True),folder,labels,train,shift

    def __len__(self):
        return len(self.df)

    def __getitem__(self,i):
        # citesc imaginea in grayscale pentru profiluri
        r=self.df.iloc[i]
        arr=np.array(Image.open(img_path(self.folder,r["id"])).convert("L").resize((IMG_W,IMG_H),Image.BILINEAR))
        if self.train:
            # augmentari pentru modelul 1d: deplasare, luminozitate, zgomot, stergere coloane
            arr=np.roll(arr,random.randint(-8,8),axis=1)
            arr=np.clip(arr.astype(np.float32)*random.uniform(.85,1.15),0,255).astype(np.uint8)
            if random.random()<.30:
                arr=np.clip(arr.astype(np.float32)+np.random.randn(IMG_H,IMG_W).astype(np.float32)*8,0,255).astype(np.uint8)
            if random.random()<.20:
                w=random.randint(1,4)
                c=random.randint(0,IMG_W-w-1)
                arr[:,c:c+w]=0
        elif self.shift:
            # la tta schimb putin pozitia pe orizontala
            arr=np.roll(arr,self.shift,axis=1)
        x=profile_features(arr)
        return (x,int(r["label"])-1) if self.labels else (x,str(r["id"]))

# 7. transformari si augmentari pentru 2d-cnn
class ImgT:
    # transformari pentru modelul 2d
    # aceeasi clasa este folosita si pentru tta
    def __init__(self,train=False,hflip=False,vflip=False,shift=0,scale=1.0):
        self.train,self.hflip,self.vflip,self.shift,self.scale=train,hflip,vflip,shift,scale
        self.to_tensor=transforms.ToTensor()
        self.norm=transforms.Normalize([.5]*3,[.5]*3)

    def __call__(self,img):
        # redimensionez imaginea
        if self.scale!=1.0:
            nw=int(IMG_W*self.scale)
            img=img.resize((nw,IMG_H),Image.BILINEAR)
            l=max((nw-IMG_W)//2,0)
            img=img.crop((l,0,l+IMG_W,IMG_H))
        else:
            img=img.resize((IMG_W,IMG_H),Image.BILINEAR)
        # flip-urile sunt folosite la tta
        if self.hflip:
            img=ImageOps.mirror(img)
        if self.vflip:
            img=ImageOps.flip(img)
        x=self.to_tensor(img)
        if self.train:
            # augmentari pentru train: shift, flip, modificare luminozitate si stergere coloane
            x=torch.roll(x,random.randint(-10,10),dims=2)
            if random.random()<.5:
                x=torch.flip(x,[2])
            if random.random()<.2:
                x=torch.flip(x,[1])
            for c in range(3):
                x[c]=torch.clamp(x[c]*random.uniform(.85,1.15)+random.uniform(-.06,.06),0,1)
            if random.random()<.25:
                w=random.randint(1,5)
                col=random.randint(0,IMG_W-w-1)
                x[:,:,col:col+w]=0
        elif self.shift:
            # shift mic pentru tta
            x=torch.roll(x,self.shift,dims=2)
        return self.norm(x)

def tta_2d():
    # la test fac mai multe versiuni ale aceleiasi imagini
    # apoi media probabilitatilor da o predictie mai stabila
    return [
        ImgT(), ImgT(hflip=True), ImgT(shift=5), ImgT(shift=-5),
        ImgT(hflip=True, shift=5), ImgT(vflip=True),
        ImgT(scale=1.10), ImgT(scale=1.10, hflip=True),
    ]

# 8. blocuri comune pentru retele
def drop_path(x,p=0.,train=False):
    # regularizare pentru retele reziduale
    # unele cai reziduale sunt oprite aleator in timpul antrenarii
    if p==0 or not train:
        return x
    keep=1-p
    mask=(keep+torch.rand((x.shape[0],)+(1,)*(x.ndim-1),device=x.device,dtype=x.dtype)).floor()
    return x.div(keep)*mask

class DropPath(nn.Module):
    def __init__(self,p=0.):
        super().__init__()
        self.p=p

    def forward(self,x):
        return drop_path(x,self.p,self.training)

class CBA2(nn.Module):
    # conv2d + batchnorm + silu
    def __init__(self,a,b,k=3,s=1,p=1,g=1,d=1):
        super().__init__()
        self.net=nn.Sequential(nn.Conv2d(a,b,k,s,p,groups=g,dilation=d,bias=False),nn.BatchNorm2d(b),nn.SiLU(True))

    def forward(self,x):
        return self.net(x)

class SE2(nn.Module):
    # squeeze-and-excitation pentru 2d
    # reteaua invata ce canale sunt mai importante
    def __init__(self,c,r=8):
        super().__init__()
        h=max(c//r,8)
        self.net=nn.Sequential(nn.AdaptiveAvgPool2d(1),nn.Flatten(),nn.Linear(c,h,bias=False),nn.SiLU(True),nn.Linear(h,c,bias=False),nn.Sigmoid())

    def forward(self,x):
        return x*self.net(x).view(x.size(0),x.size(1),1,1)

class Res2(nn.Module):
    # bloc rezidual 2d cu depthwise conv, se si drop path
    # skip connection ajuta gradientul si stabilitatea
    def __init__(self,a,b,drop=0.,dp=0.):
        super().__init__()
        self.main=nn.Sequential(CBA2(a,b),nn.Dropout2d(drop) if drop else nn.Identity(),nn.Conv2d(b,b,3,1,1,groups=b,bias=False),
            nn.BatchNorm2d(b),nn.SiLU(True),nn.Conv2d(b,b,1,bias=False),nn.BatchNorm2d(b),SE2(b),DropPath(dp) if dp else nn.Identity())
        self.skip=nn.Identity() if a==b else nn.Sequential(nn.Conv2d(a,b,1,bias=False),nn.BatchNorm2d(b))
        self.act=nn.SiLU(True)

    def forward(self,x):
        return self.act(self.main(x)+self.skip(x))

class ASPP2(nn.Module):
    # aspp combina convolutii cu dilatari diferite
    # ajuta modelul sa vada context pe distante diferite
    def __init__(self,a,b):
        super().__init__()
        m=b//4
        self.br=nn.ModuleList([CBA2(a,m,1,p=0),CBA2(a,m,p=2,d=2),CBA2(a,m,p=4,d=4),CBA2(a,m,p=6,d=6)])
        self.pool=nn.Sequential(nn.Conv2d(a,m,1,bias=False),nn.BatchNorm2d(m),nn.SiLU(True))
        self.proj=CBA2(m*5,b,1,p=0)

    def forward(self,x):
        p=F.interpolate(self.pool(F.adaptive_avg_pool2d(x,1)),size=x.shape[2:],mode="bilinear",align_corners=False)
        return self.proj(torch.cat([b(x) for b in self.br]+[p],1))

class CBA1(nn.Module):
    # conv1d + batchnorm + silu pentru profilurile 1d
    def __init__(self,a,b,k=3,p=1):
        super().__init__()
        self.net=nn.Sequential(nn.Conv1d(a,b,k,1,p,bias=False),nn.BatchNorm1d(b),nn.SiLU(True))

    def forward(self,x):
        return self.net(x)

class SE1(nn.Module):
    # squeeze-and-excitation pentru modelul 1d
    def __init__(self,c,r=4):
        super().__init__()
        h=max(c//r,8)
        self.net=nn.Sequential(nn.AdaptiveAvgPool1d(1),nn.Flatten(),nn.Linear(c,h,bias=False),nn.SiLU(True),nn.Linear(h,c,bias=False),nn.Sigmoid())

    def forward(self,x):
        return x*self.net(x).view(x.size(0),x.size(1),1)

class Res1(nn.Module):
    # bloc rezidual 1d
    # lucreaza pe semnalul extras din coloanele imaginii
    def __init__(self,a,b,k=7,dp=0.):
        super().__init__()
        p=k//2
        self.main=nn.Sequential(CBA1(a,b,k,p),nn.Conv1d(b,b,k,1,p,groups=b,bias=False),nn.BatchNorm1d(b),nn.SiLU(True),
            nn.Conv1d(b,b,1,bias=False),nn.BatchNorm1d(b),SE1(b),DropPath(dp) if dp else nn.Identity())
        self.skip=nn.Identity() if a==b else nn.Sequential(nn.Conv1d(a,b,1,bias=False),nn.BatchNorm1d(b))
        self.act=nn.SiLU(True)

    def forward(self,x):
        return self.act(self.main(x)+self.skip(x))

def init_w(m):
    # initializez ponderile pentru o antrenare mai stabila
    if isinstance(m,(nn.Conv2d,nn.Conv1d)):
        nn.init.kaiming_normal_(m.weight,mode="fan_out",nonlinearity="relu")
    elif isinstance(m,nn.Linear):
        nn.init.xavier_uniform_(m.weight)
        nn.init.zeros_(m.bias) if m.bias is not None else None
    elif isinstance(m,(nn.BatchNorm1d,nn.BatchNorm2d)):
        nn.init.ones_(m.weight)
        nn.init.zeros_(m.bias)

# 9. modelul 2d-cnn cu pooling asimetric
class AsymmetricSignalCNN(nn.Module):
    # modelul 2d principal
    # foloseste pooling asimetric deoarece semnalele au structura directionala
    def __init__(self):
        super().__init__()
        d=torch.linspace(0,.12,10).tolist()
        self.stem=nn.Sequential(CBA2(3,32),CBA2(32,64),nn.MaxPool2d((1,2)))
        self.s1=self.stage(64,96,d[:2],.02,(2,2))
        self.s2=self.stage(96,128,d[2:4],.03,(2,1))
        self.s3=self.stage(128,256,d[4:6],.05,(2,2))
        self.s4=nn.Sequential(Res2(256,384,.07,d[6]),Res2(384,384,.07,d[7]))
        self.s5=nn.Sequential(Res2(384,512,.09,d[8]),Res2(512,512,.09,d[9]))
        self.aspp=ASPP2(512,512)
        self.avg=nn.AdaptiveAvgPool2d(1)
        self.mx=nn.AdaptiveMaxPool2d(1)
        self.head = nn.Sequential(
            nn.Flatten(),
            nn.BatchNorm1d(1024),
            nn.Dropout(.40),
            nn.Linear(1024, 512),
            nn.SiLU(True),
            nn.BatchNorm1d(512),
            nn.Dropout(.30),
            nn.Linear(512, NUM_CLASSES),
        )
        self.apply(init_w)

    def stage(self,a,b,d,drop,pool):
        # un stage are doua blocuri reziduale si apoi reduce rezolutia
        return nn.Sequential(Res2(a,b,drop,d[0]),Res2(b,b,drop,d[1]),nn.MaxPool2d(pool))

    def forward(self,x):
        # trec imaginea prin blocurile convolutionale
        for b in [self.stem,self.s1,self.s2,self.s3,self.s4,self.s5,self.aspp]:
            x=b(x)
        # combin average pooling cu max pooling pentru mai multa informatie globala
        # combin average pooling si max pooling
        return self.head(torch.cat([self.avg(x),self.mx(x)],1))

# 10. modelul 1d-profile-cnn
class ProfileSignalCNN(nn.Module):
    # modelul 1d
    # primeste 7 profiluri pe coloane si invata forma semnalului
    def __init__(self):
        super().__init__()
        d=torch.linspace(0,.10,8).tolist()
        self.stem=nn.Sequential(CBA1(7,64,15,7),CBA1(64,64,7,3))
        self.s1=self.stage(64,128,11,d[:2])
        self.s2=self.stage(128,256,7,d[2:4])
        self.s3=self.stage(256,384,5,d[4:6])
        self.s4=nn.Sequential(Res1(384,512,3,d[6]),Res1(512,512,3,d[7]))
        self.avg=nn.AdaptiveAvgPool1d(1)
        self.mx=nn.AdaptiveMaxPool1d(1)
        self.head = nn.Sequential(
            nn.Flatten(),
            nn.BatchNorm1d(1024),
            nn.Dropout(.40),
            nn.Linear(1024, 256),
            nn.SiLU(True),
            nn.BatchNorm1d(256),
            nn.Dropout(.25),
            nn.Linear(256, NUM_CLASSES),
        )
        self.apply(init_w)

    def stage(self,a,b,k,d):
        # stage 1d: doua blocuri reziduale si reducere pe lungime
        return nn.Sequential(Res1(a,b,k,d[0]),Res1(b,b,k,d[1]),nn.MaxPool1d(2))

    def forward(self,x):
        # trec profilul 1d prin retea
        for b in [self.stem,self.s1,self.s2,self.s3,self.s4]:
            x=b(x)
        return self.head(torch.cat([self.avg(x),self.mx(x)],1))

# 11. ema, mixup si cutmix
class EMA:
    # pastrez o copie netezita a modelului
    # aceasta copie este folosita la validare si de obicei generalizeaza mai bine
    def __init__(self,m):
        self.m=copy.deepcopy(m).eval()
        [p.requires_grad_(False) for p in self.m.parameters()]

    @torch.no_grad()
    def update(self,m):
        # dupa fiecare batch actualizez media mobila a ponderilor
        s=m.state_dict()
        for k,v in self.m.state_dict().items():
            v.copy_(v*EMA_DECAY+s[k].detach()*(1-EMA_DECAY) if v.dtype.is_floating_point else s[k])

def mixup(x,y):
    # combin doua imagini si doua etichete
    # modelul devine mai putin sigur pe memorare si generalizeaza mai bine
    lam=np.random.beta(MIXUP_A,MIXUP_A)
    idx=torch.randperm(x.size(0),device=x.device)
    return lam*x+(1-lam)*x[idx],y,y[idx],lam

def cutmix(x,y):
    # inlocuiesc o zona dintr-o imagine cu zona din alta imagine
    # loss-ul este calculat proportional cu zona pastrata
    lam=np.random.beta(CUTMIX_A,CUTMIX_A)
    idx=torch.randperm(x.size(0),device=x.device)
    L=x.shape[-1]
    cut=int(L*np.sqrt(1-lam))
    c=np.random.randint(L)
    x1,x2=max(c-cut//2,0),min(c+cut//2,L)
    z=x.clone()
    if x.ndim == 4:
        z[:, :, :, x1:x2] = x[idx, :, :, x1:x2]
    else:
        z[:, :, x1:x2] = x[idx, :, x1:x2]
    return z, y, y[idx], 1 - (x2 - x1) / L

def mix_loss(fn,p,a,b,lam):
    # loss pentru mixup/cutmix: combinatie intre doua etichete
    return lam*fn(p,a)+(1-lam)*fn(p,b)

# 12. scheduler warmup + cosine
class WarmCos(torch.optim.lr_scheduler._LRScheduler):
    # scheduler cu warmup la inceput si scadere cosine dupa
    # ajuta modelul sa porneasca mai stabil
    def __init__(self,opt,warm=5,total=100,min_lr=5e-7):
        self.warm,self.total,self.min_lr=warm,total,min_lr
        super().__init__(opt)

    def get_lr(self):
        # in primele epoci cresc learning rate-ul treptat
        if self.last_epoch<self.warm:
            return [b*(self.last_epoch+1)/self.warm for b in self.base_lrs]
        # dupa warmup scad learning rate-ul dupa curba cosinus
        q=(self.last_epoch-self.warm)/max(self.total-self.warm,1)
        c=.5*(1+math.cos(math.pi*q))
        return [self.min_lr+(b-self.min_lr)*c for b in self.base_lrs]

# 13. antrenare si validare
def train_epoch(m,ema,dl,opt,loss_fn,scaler):
    # antrenez modelul o epoca
    # pentru fiecare batch fac forward, loss, backward si update
    m.train()
    ls=ok=n=0
    for x,y in dl:
        # mut batch-ul pe gpu/cpu
        x,y=x.to(DEVICE,non_blocking=True),y.to(DEVICE,non_blocking=True)
        opt.zero_grad(set_to_none=True)
        with amp():
            # uneori folosesc mixup/cutmix, altfel imaginea normala
            if np.random.rand()<AUG_PROB:
                xa,a,b,lam = mixup(x,y) if np.random.rand()<.5 else cutmix(x,y)
                out=m(xa)
                loss=mix_loss(loss_fn,out,a,b,lam)
            else:
                out=m(x)
                loss=loss_fn(out,y)
        # backward cu gradscaler pentru mixed precision
        scaler.scale(loss).backward()
        scaler.unscale_(opt)
        torch.nn.utils.clip_grad_norm_(m.parameters(),2)
        scaler.step(opt)
        scaler.update()
        # actualizez si modelul ema
        ema.update(m)
        bs=y.size(0)
        ls+=loss.item()*bs
        ok+=(out.argmax(1)==y).sum().item()
        n+=bs
    return ls/n,ok/n

@torch.no_grad()
def validate(m,dl,loss_fn):
    # validarea se face fara gradient
    # aici masor loss si acuratete pe validation
    m.eval()
    ls=ok=n=0
    for x,y in dl:
        x,y=x.to(DEVICE,non_blocking=True),y.to(DEVICE,non_blocking=True)
        with amp():
            out=m(x)
            loss=loss_fn(out,y)
        bs=y.size(0)
        ls+=loss.item()*bs
        ok+=(out.argmax(1)==y).sum().item()
        n+=bs
    return ls/n,ok/n

@torch.no_grad()
def collect_logits(m,dl,ids=False):
    # strang scorurile brute ale modelului
    # le folosesc apoi pentru temperature scaling si ensemble
    m.eval()
    outs=[]
    all_ids=[]
    for b in dl:
        x=b[0].to(DEVICE,non_blocking=True)
        all_ids+=list(b[1]) if ids else []
        with amp():
            outs.append(m(x).cpu().numpy())
    z=np.concatenate(outs)
    return (z,all_ids) if ids else z

# 14. temperature scaling
class Temp(nn.Module):
    # temperature scaling calibreaza probabilitatile
    # nu schimba ordinea claselor, doar cat de sigure sunt predictiile
    def __init__(self):
        super().__init__()
        self.log_t=nn.Parameter(torch.log(torch.ones(1)*1.5))

    def forward(self,z):
        return z/torch.exp(self.log_t)

    def fit(self,z,y):
        # invat o singura valoare: temperatura
        # se optimizeaza pe validation
        z=torch.FloatTensor(z).to(DEVICE)
        y=torch.LongTensor(y).to(DEVICE)
        opt=torch.optim.LBFGS([self.log_t],lr=.01,max_iter=50)
        ce=nn.CrossEntropyLoss()

        def closure():
            opt.zero_grad()
            loss=ce(self(z),y)
            loss.backward()
            return loss
        opt.step(closure)
        print("temperature:", round(torch.exp(self.log_t).item(), 4))
        return self

def to_probs(z,t):
    # transform logits calibrate in probabilitati
    return torch.softmax(t(torch.FloatTensor(z).to(DEVICE)),1).detach().cpu().numpy()

# 15. functie pentru antrenarea unui model
def fit_model(make_model,name,train_dl,val_dl,best_path,epochs,seed,weights):
    # functie generala pentru antrenarea unui model
    # o folosesc pentru 2d main, 2d extra si 1d profile
    set_seed(seed)
    m=make_model().to(DEVICE)
    ema=EMA(m)
    loss_fn=nn.CrossEntropyLoss(weight=weights,label_smoothing=LABEL_SMOOTH)
    opt=torch.optim.AdamW(m.parameters(),lr=LR,weight_decay=WD)
    sch=WarmCos(opt,total=epochs)
    scaler=torch.amp.GradScaler(enabled=(DEVICE=="cuda"))
    best,wait,hist=-1,0,[]
    print("\nantrenez", name)
    for ep in range(1,epochs+1):
        # antrenez o epoca si evaluez modelul ema pe validation
        tl,ta=train_epoch(m,ema,train_dl,opt,loss_fn,scaler)
        vl,va=validate(ema.m,val_dl,loss_fn)
        sch.step()
        hist.append({"epoch":ep,"train_loss":tl,"train_acc":ta,"val_loss":vl,"val_acc":va,"lr":opt.param_groups[0]["lr"]})
        print(f"{ep:03d}/{epochs} train={ta:.4f} val={va:.4f} lr={opt.param_groups[0]['lr']:.2e}")
        if va>best:
            # daca acuratetea pe validation creste, salvez modelul
            best,wait=va,0
            torch.save(ema.m.state_dict(),best_path)
            print(" salvez best:", round(best,4))
        else:
            # daca nu se mai imbunatateste, numar epocile de asteptare
            wait+=1
            if wait>=PATIENCE:
                print("early stopping.")
                break

    pd.DataFrame(hist).to_csv(best_path.replace(".pth","_history.csv"),index=False)
    # reincarc cel mai bun model salvat
    m=make_model().to(DEVICE)
    m.load_state_dict(torch.load(best_path,map_location=DEVICE))
    m.eval()
    print("cel mai bun", name, "val_acc =", best)
    return m,best

# 16. citire date si split train-validation
# citesc csv-urile si impart train-ul in train local si validation
train_data,test_data=pd.read_csv(TRAIN_CSV),pd.read_csv(TEST_CSV)
tr,va=train_test_split(train_data,test_size=.20,random_state=MAIN_SEED,stratify=train_data["label"])

# calculez ponderi de clasa pentru cross entropy
# clasa 1 are mai multe imagini, deci ponderile ajuta la echilibrare
counts=tr["label"].value_counts().sort_index().values.astype(np.float32)
weights=torch.tensor(counts.sum()/(NUM_CLASSES*counts),dtype=torch.float32,device=DEVICE)
y_val=va["label"].values-1
print("train:",tr.shape,"val:",va.shape,"test:",test_data.shape,"weights:",weights.detach().cpu().numpy())

# dataset-uri pentru cele doua tipuri de modele
tr2d=ImageDS(tr,TRAIN_DIR,ImgT(train=True))
va2d=ImageDS(va,TRAIN_DIR,ImgT())
tr1d=ProfileDS(tr,TRAIN_DIR,train=True)
va1d=ProfileDS(va,TRAIN_DIR,train=False)
dl2d_main=make_loader(tr2d,True,True,MAIN_SEED)
dl2d_extra=make_loader(tr2d,True,True,EXTRA_SEED)
vdl2d=make_loader(va2d)
dl1d=make_loader(tr1d,True,True,MAIN_SEED)
vdl1d=make_loader(va1d)

# 17. antrenarea celor 3 modele
# 2d main si 2d extra au aceeasi arhitectura, dar seed diferit
# modelul 1d profile foloseste alta reprezentare a imaginii
m_main,acc_main=fit_model(AsymmetricSignalCNN,"2D main seed 42",dl2d_main,vdl2d,BEST_MAIN,EPOCHS_2D,MAIN_SEED,weights)
m_extra,acc_extra=fit_model(AsymmetricSignalCNN,"2D extra seed 2026",dl2d_extra,vdl2d,BEST_EXTRA,EPOCHS_2D,EXTRA_SEED,weights)
m_profile,acc_prof=fit_model(ProfileSignalCNN,"1D profile",dl1d,vdl1d,BEST_PROFILE,EPOCHS_1D,MAIN_SEED,weights)

# 18. validare si ensemble
# strang logits, calibrez probabilitatile si combin cele 3 modele
print("\ntemperature scaling + validation ensemble")
z_main,z_extra,z_prof=collect_logits(m_main,vdl2d),collect_logits(m_extra,vdl2d),collect_logits(m_profile,vdl1d)
t_main = Temp().to(DEVICE).fit(z_main, y_val)
t_extra = Temp().to(DEVICE).fit(z_extra, y_val)
t_prof = Temp().to(DEVICE).fit(z_prof, y_val)
p_main,p_extra,p_prof=to_probs(z_main,t_main),to_probs(z_extra,t_extra),to_probs(z_prof,t_prof)
print("val 2d main:", accuracy_score(y_val, p_main.argmax(1)))
print("val 2d extra:", accuracy_score(y_val, p_extra.argmax(1)))
print("val 1d profile:", accuracy_score(y_val, p_prof.argmax(1)))

# ensemble final pe validation
p_val=W_MAIN*p_main+W_EXTRA*p_extra+W_PROFILE*p_prof
pred=p_val.argmax(1)
print("\nponderi ensemble:", W_MAIN, W_EXTRA, W_PROFILE)
print("acuratete ensemble:", accuracy_score(y_val, pred))
print(confusion_matrix(y_val,pred))
print(classification_report(y_val,pred,digits=4))

# 19. predictii pe test cu tta
def pred_2d(m,t):
    # predictii pentru modelul 2d cu tta
    # media pe mai multe transformari reduce variatia predictiilor
    allp=[]
    ids=None
    for i,tfm in enumerate(tta_2d()[:TTA],1):
        z,ids=collect_logits(m,make_loader(ImageDS(test_data,TEST_DIR,tfm,False)),True)
        allp.append(to_probs(z,t))
        print(f"2d tta {i}/{TTA}")
    return np.mean(allp,0),ids

def pred_1d(m,t):
    # predictii pentru modelul 1d cu shift-uri diferite
    allp=[]
    ids=None
    for i,sh in enumerate([0,5,-5,10,-10,15,-15,3][:TTA],1):
        z,ids=collect_logits(m,make_loader(ProfileDS(test_data,TEST_DIR,False,False,sh)),True)
        allp.append(to_probs(z,t))
        print(f"1d tta {i}/{TTA}")
    return np.mean(allp,0),ids

# 20. salvare submission si probabilitati
# aici se genereaza fisierele finale pentru kaggle si pentru analiza
print("\nPredictii pe test")
pt_main,ids=pred_2d(m_main,t_main)
pt_extra,_=pred_2d(m_extra,t_extra)
pt_prof,_=pred_1d(m_profile,t_prof)

# combin predictiile celor 3 modele pe test
p_test=W_MAIN*pt_main+W_EXTRA*pt_extra+W_PROFILE*pt_prof
sub=pd.DataFrame({"id":ids,"label":p_test.argmax(1)+1})
sub.to_csv(SUB_PATH,index=False)
prob=pd.DataFrame(p_test,columns=[f"prob_class_{i}" for i in range(1,NUM_CLASSES+1)])
prob.insert(0,"id",ids)
prob.to_csv(PROB_PATH,index=False)
print("\nsubmission salvat la:", SUB_PATH)
print("probabilitati salvate la:", PROB_PATH)
print("\ndistributie predictii:")
print(sub["label"].value_counts().sort_index())

print("\nprimele predictii:")
print(sub.head())
