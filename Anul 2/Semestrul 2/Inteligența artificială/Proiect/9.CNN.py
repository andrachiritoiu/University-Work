import os, glob, copy, random
import numpy as np
import pandas as pd
from PIL import Image

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report


# 1. Setari principale
SEED = 42
NUM_CLASSES = 5
IMG_SIZE = 128
BATCH_SIZE = 64
MAX_EPOCHS = 70
PATIENCE = 14

LR = 3e-4
WEIGHT_DECAY = 1e-4
LABEL_SMOOTHING = 0.05

USE_MIX = True
MIXUP_ALPHA = 0.20
CUTMIX_ALPHA = 0.50
MIX_PROB = 0.50
EMA_DECAY = 0.995
NUM_WORKERS = 2

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

train_csv_list = glob.glob("/content/date_proiect/**/train.csv", recursive=True)
if not train_csv_list:
    raise FileNotFoundError("Nu am gasit train.csv. Verifica dezarhivarea.")

DATA_DIR = os.path.dirname(train_csv_list[0])
TRAIN_CSV = os.path.join(DATA_DIR, "train.csv")
TEST_CSV = os.path.join(DATA_DIR, "test.csv")
TRAIN_DIR = os.path.join(DATA_DIR, "train")
TEST_DIR = os.path.join(DATA_DIR, "test")

OUT_DIR = "/content/output"
os.makedirs(OUT_DIR, exist_ok=True)

BEST_PATHS = {
    "rgb": os.path.join(OUT_DIR, "best_scratch_rgb.pth"),
    "edge": os.path.join(OUT_DIR, "best_scratch_edge.pth"),
}
HISTORY_PATHS = {
    "rgb": os.path.join(OUT_DIR, "history_scratch_rgb.csv"),
    "edge": os.path.join(OUT_DIR, "history_scratch_edge.csv"),
}
SUB_PATH = os.path.join(OUT_DIR, "submission_scratch_compliant.csv")
PROB_PATH = os.path.join(OUT_DIR, "test_probabilities_scratch_compliant.csv")

print("DATA_DIR:", DATA_DIR)
print("device:", DEVICE)
if DEVICE == "cuda":
    print(torch.cuda.get_device_name(0))

random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(SEED)
    torch.backends.cudnn.benchmark = True

loader_generator = torch.Generator().manual_seed(SEED)



# 2. Functii ajutatoare si dataset
def find_image(folder, image_id):
    image_id = str(image_id)
    direct_path = os.path.join(folder, image_id)
    if os.path.exists(direct_path):
        return direct_path

    for ext in [".png", ".jpg", ".jpeg", ".bmp"]:
        path = os.path.join(folder, image_id + ext)
        if os.path.exists(path):
            return path

    raise FileNotFoundError("Nu gasesc imaginea: " + image_id)


def seed_worker(worker_id):
    worker_seed = torch.initial_seed() % 2**32
    np.random.seed(worker_seed)
    random.seed(worker_seed)


def amp_context():
    return torch.amp.autocast(device_type="cuda" if DEVICE == "cuda" else "cpu", enabled=(DEVICE == "cuda"))


class SignalDataset(Dataset):
    def __init__(self, table, folder, transform=None, has_labels=True):
        self.table = table.reset_index(drop=True)
        self.folder = folder
        self.transform = transform
        self.has_labels = has_labels

    def __len__(self):
        return len(self.table)

    def __getitem__(self, idx):
        image_id = self.table.iloc[idx]["id"]
        image = Image.open(find_image(self.folder, image_id)).convert("RGB")
        if self.transform is not None:
            image = self.transform(image)

        if self.has_labels:
            label = int(self.table.iloc[idx]["label"]) - 1
            return image, label
        return image, str(image_id)


def make_loader(table, folder, transform, has_labels=True, shuffle=False):
    return DataLoader(
        SignalDataset(table, folder, transform, has_labels),
        batch_size=BATCH_SIZE,
        shuffle=shuffle,
        num_workers=NUM_WORKERS,
        pin_memory=(DEVICE == "cuda"),
        worker_init_fn=seed_worker if shuffle else None,
        generator=loader_generator if shuffle else None,
    )



# 3. Transformari RGB si EDGE
class EdgeTransform:
    def __init__(self, size, train=False):
        self.train = train
        self.resize = transforms.Resize((size, size))
        self.to_tensor = transforms.ToTensor()
        self.aug = transforms.Compose([
            transforms.RandomHorizontalFlip(p=0.5),
            transforms.RandomAffine(degrees=8, translate=(0.04, 0.04), scale=(0.92, 1.08), shear=3),
        ])
        self.sobel_x = torch.tensor([[-1., 0., 1.], [-2., 0., 2.], [-1., 0., 1.]]).view(1, 1, 3, 3)
        self.sobel_y = torch.tensor([[-1., -2., -1.], [0., 0., 0.], [1., 2., 1.]]).view(1, 1, 3, 3)
        self.laplace = torch.tensor([[0., 1., 0.], [1., -4., 1.], [0., 1., 0.]]).view(1, 1, 3, 3)

    def normalize_one(self, x):
        return (x - x.min()) / (x.max() - x.min() + 1e-6)

    def __call__(self, image):
        image = self.resize(image)
        if self.train:
            image = self.aug(image)

        gray = self.to_tensor(image.convert("L")).unsqueeze(0)
        sx = F.conv2d(gray, self.sobel_x, padding=1)
        sy = F.conv2d(gray, self.sobel_y, padding=1)
        edge = torch.sqrt(sx ** 2 + sy ** 2)
        lap = torch.abs(F.conv2d(gray, self.laplace, padding=1))

        x = torch.stack([
            self.normalize_one(gray.squeeze()),
            self.normalize_one(edge.squeeze()),
            self.normalize_one(lap.squeeze()),
        ])
        return (x - 0.5) / 0.5


rgb_train = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomAffine(degrees=8, translate=(0.04, 0.04), scale=(0.92, 1.08), shear=3),
    transforms.ColorJitter(brightness=0.12, contrast=0.18, saturation=0.08),
    transforms.ToTensor(),
    transforms.RandomErasing(p=0.20, scale=(0.01, 0.06), ratio=(0.3, 3.3)),
    transforms.Normalize([0.5] * 3, [0.5] * 3),
])

rgb_valid = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.5] * 3, [0.5] * 3),
])

TRANSFORMS = {
    "rgb": (rgb_train, rgb_valid),
    "edge": (EdgeTransform(IMG_SIZE, train=True), EdgeTransform(IMG_SIZE, train=False)),
}



# 4. Model CNN de la zero
class ConvBlock(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.net = nn.Sequential(
            nn.Conv2d(in_channels, out_channels, 3, 1, 1, bias=False),
            nn.BatchNorm2d(out_channels),
            nn.SiLU(inplace=True),
        )

    def forward(self, x):
        return self.net(x)


class ResidualBlock(nn.Module):
    def __init__(self, in_channels, out_channels, dropout=0.0):
        super().__init__()
        self.conv1 = ConvBlock(in_channels, out_channels)
        self.conv2 = nn.Sequential(
            nn.Conv2d(out_channels, out_channels, 3, 1, 1, bias=False),
            nn.BatchNorm2d(out_channels),
        )
        self.dropout = nn.Dropout2d(dropout) if dropout > 0 else nn.Identity()
        self.skip = nn.Identity() if in_channels == out_channels else nn.Sequential(
            nn.Conv2d(in_channels, out_channels, 1, bias=False),
            nn.BatchNorm2d(out_channels),
        )
        self.act = nn.SiLU(inplace=True)

    def forward(self, x):
        out = self.conv2(self.dropout(self.conv1(x)))
        return self.act(out + self.skip(x))


class ScratchSignalCNN(nn.Module):
    def __init__(self, num_classes=NUM_CLASSES):
        super().__init__()
        self.stem = nn.Sequential(ConvBlock(3, 32), ConvBlock(32, 32), nn.MaxPool2d(2))
        self.features = nn.Sequential(
            ResidualBlock(32, 64, 0.03), ResidualBlock(64, 64, 0.03), nn.MaxPool2d(2),
            ResidualBlock(64, 128, 0.05), ResidualBlock(128, 128, 0.05), nn.MaxPool2d(2),
            ResidualBlock(128, 256, 0.08), ResidualBlock(256, 256, 0.08), nn.MaxPool2d(2),
            ResidualBlock(256, 384, 0.10), ResidualBlock(384, 384, 0.10),
        )
        self.head = nn.Sequential(
            nn.AdaptiveAvgPool2d(1),
            nn.Flatten(),
            nn.BatchNorm1d(384),
            nn.Dropout(0.35),
            nn.Linear(384, 256),
            nn.SiLU(inplace=True),
            nn.BatchNorm1d(256),
            nn.Dropout(0.25),
            nn.Linear(256, num_classes),
        )
        self.apply(self.init_weights)

    def init_weights(self, layer):
        if isinstance(layer, nn.Conv2d):
            nn.init.kaiming_normal_(layer.weight, mode="fan_out", nonlinearity="relu")
        elif isinstance(layer, nn.Linear):
            nn.init.xavier_uniform_(layer.weight)
            if layer.bias is not None:
                nn.init.zeros_(layer.bias)
        elif isinstance(layer, (nn.BatchNorm2d, nn.BatchNorm1d)):
            nn.init.ones_(layer.weight)
            nn.init.zeros_(layer.bias)

    def forward(self, x):
        return self.head(self.features(self.stem(x)))



# 5. EMA, MixUp, CutMix
class EMAModel:
    def __init__(self, model, decay=EMA_DECAY):
        self.model = copy.deepcopy(model).eval()
        self.decay = decay
        for p in self.model.parameters():
            p.requires_grad_(False)

    @torch.no_grad()
    def update(self, model):
        current = model.state_dict()
        for key, value in self.model.state_dict().items():
            if value.dtype.is_floating_point:
                value.copy_(value * self.decay + current[key].detach() * (1.0 - self.decay))
            else:
                value.copy_(current[key])


def mixup(x, y):
    lam = np.random.beta(MIXUP_ALPHA, MIXUP_ALPHA)
    idx = torch.randperm(x.size(0), device=x.device)
    return lam * x + (1.0 - lam) * x[idx], y, y[idx], lam


def cutmix(x, y):
    lam = np.random.beta(CUTMIX_ALPHA, CUTMIX_ALPHA)
    idx = torch.randperm(x.size(0), device=x.device)
    _, _, h, w = x.shape
    cut_w, cut_h = int(w * np.sqrt(1 - lam)), int(h * np.sqrt(1 - lam))
    cx, cy = np.random.randint(w), np.random.randint(h)
    x1, y1 = np.clip(cx - cut_w // 2, 0, w), np.clip(cy - cut_h // 2, 0, h)
    x2, y2 = np.clip(cx + cut_w // 2, 0, w), np.clip(cy + cut_h // 2, 0, h)

    out = x.clone()
    out[:, :, y1:y2, x1:x2] = x[idx, :, y1:y2, x1:x2]
    lam = 1.0 - ((x2 - x1) * (y2 - y1)) / (h * w)
    return out, y, y[idx], lam


def mixed_loss(loss_fn, pred, y1, y2, lam):
    return lam * loss_fn(pred, y1) + (1.0 - lam) * loss_fn(pred, y2)



# 6. Antrenare, validare, predictii
def train_one_epoch(model, ema_model, loader, optimizer, loss_fn):
    model.train()
    loss_sum, correct, total = 0.0, 0, 0

    for x, y in loader:
        x = x.to(DEVICE, non_blocking=True)
        y = y.to(DEVICE, non_blocking=True)
        optimizer.zero_grad(set_to_none=True)

        with amp_context():
            if USE_MIX and np.random.rand() < MIX_PROB:
                x_aug, y1, y2, lam = mixup(x, y) if np.random.rand() < 0.5 else cutmix(x, y)
                pred = model(x_aug)
                loss = mixed_loss(loss_fn, pred, y1, y2, lam)
            else:
                pred = model(x)
                loss = loss_fn(pred, y)

        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 3.0)
        optimizer.step()
        ema_model.update(model)

        bs = y.size(0)
        loss_sum += loss.item() * bs
        correct += (pred.argmax(1) == y).sum().item()
        total += bs

    return loss_sum / total, correct / total


@torch.no_grad()
def evaluate(model, loader, loss_fn, save_preds=False):
    model.eval()
    loss_sum, correct, total = 0.0, 0, 0
    all_labels, all_preds = [], []

    for x, y in loader:
        x = x.to(DEVICE, non_blocking=True)
        y = y.to(DEVICE, non_blocking=True)
        with amp_context():
            pred = model(x)
            loss = loss_fn(pred, y)

        labels_pred = pred.argmax(1)
        bs = y.size(0)
        loss_sum += loss.item() * bs
        correct += (labels_pred == y).sum().item()
        total += bs

        if save_preds:
            all_labels.append(y.cpu().numpy())
            all_preds.append(labels_pred.cpu().numpy())

    if save_preds:
        return loss_sum / total, correct / total, np.concatenate(all_labels), np.concatenate(all_preds)
    return loss_sum / total, correct / total


@torch.no_grad()
def predict_probs(model, loader, return_ids=False):
    model.eval()
    probs, ids = [], []

    for batch in loader:
        x = batch[0].to(DEVICE, non_blocking=True)
        if return_ids:
            ids.extend(list(batch[1]))

        with amp_context():
            probs.append(torch.softmax(model(x), dim=1).cpu().numpy())

    probs = np.concatenate(probs, axis=0)
    return (probs, ids) if return_ids else probs


def train_model(model_name, train_tf, valid_tf, train_df, valid_df, class_weights):
    print("\nANTRENARE", model_name.upper())

    model = ScratchSignalCNN().to(DEVICE)
    ema_model = EMAModel(model)

    train_loader = make_loader(train_df, TRAIN_DIR, train_tf, has_labels=True, shuffle=True)
    valid_loader = make_loader(valid_df, TRAIN_DIR, valid_tf, has_labels=True, shuffle=False)

    loss_fn = nn.CrossEntropyLoss(weight=class_weights, label_smoothing=LABEL_SMOOTHING)
    optimizer = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=WEIGHT_DECAY)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=MAX_EPOCHS, eta_min=1e-6)

    history, best_acc, best_epoch, wait = [], -1.0, -1, 0

    for epoch in range(1, MAX_EPOCHS + 1):
        train_loss, train_acc = train_one_epoch(model, ema_model, train_loader, optimizer, loss_fn)
        val_loss, val_acc = evaluate(ema_model.model, valid_loader, loss_fn)
        scheduler.step()
        lr_now = scheduler.get_last_lr()[0]

        print(f"epoch {epoch:02d}/{MAX_EPOCHS} | train acc={train_acc:.4f} | valid acc={val_acc:.4f} | lr={lr_now:.2e}")
        history.append({"epoch": epoch, "train_loss": train_loss, "train_acc": train_acc, "val_loss": val_loss, "val_acc": val_acc, "lr": lr_now})

        if val_acc > best_acc:
            best_acc, best_epoch, wait = val_acc, epoch, 0
            torch.save(ema_model.model.state_dict(), BEST_PATHS[model_name])
        else:
            wait += 1
            if wait >= PATIENCE:
                print("Early stopping.")
                break

    pd.DataFrame(history).to_csv(HISTORY_PATHS[model_name], index=False)
    model.load_state_dict(torch.load(BEST_PATHS[model_name], map_location=DEVICE))
    model.eval()

    print("Best", model_name.upper(), "epoch =", best_epoch, "valid_acc =", best_acc)
    return model, best_acc, valid_loader



# 7. Date + antrenare RGB si EDGE
train_table = pd.read_csv(TRAIN_CSV)
test_table = pd.read_csv(TEST_CSV)

train_df, valid_df = train_test_split(
    train_table,
    test_size=0.20,
    random_state=SEED,
    stratify=train_table["label"],
)

counts = train_df["label"].value_counts().sort_index().values.astype(np.float32)
class_weights = torch.tensor(counts.sum() / (NUM_CLASSES * counts), dtype=torch.float32, device=DEVICE)
valid_labels = valid_df["label"].values - 1

print("train_df:", train_df.shape)
print("valid_df:", valid_df.shape)
print("class_weights:", class_weights.detach().cpu().numpy())

models, valid_loaders = {}, {}

for name in ["rgb", "edge"]:
    train_tf, valid_tf = TRANSFORMS[name]
    model, best_acc, valid_loader = train_model(name, train_tf, valid_tf, train_df, valid_df, class_weights)
    models[name] = model
    valid_loaders[name] = valid_loader



# 8. Ensemble pe validation
eval_loss = nn.CrossEntropyLoss()
valid_probs = {name: predict_probs(models[name], valid_loaders[name]) for name in ["rgb", "edge"]}

for name in ["rgb", "edge"]:
    _, acc, _, _ = evaluate(models[name], valid_loaders[name], eval_loss, save_preds=True)
    print("Val acc", name.upper(), "=", acc)

best_rgb_weight, best_ensemble_acc = 1.0, -1.0
for rgb_weight in np.linspace(0, 1, 101):
    probs = rgb_weight * valid_probs["rgb"] + (1 - rgb_weight) * valid_probs["edge"]
    acc = accuracy_score(valid_labels, probs.argmax(1))
    if acc > best_ensemble_acc:
        best_rgb_weight, best_ensemble_acc = float(rgb_weight), acc

edge_weight = 1.0 - best_rgb_weight
final_valid_probs = best_rgb_weight * valid_probs["rgb"] + edge_weight * valid_probs["edge"]
final_valid_preds = final_valid_probs.argmax(1)

print("\nBest weight RGB =", best_rgb_weight)
print("Best weight EDGE =", edge_weight)
print("Ensemble val acc =", best_ensemble_acc)
print("\nConfusion matrix ensemble:")
print(confusion_matrix(valid_labels, final_valid_preds))
print("\nClassification report ensemble:")
print(classification_report(valid_labels, final_valid_preds, digits=4))



# 9. Predictii pe test + submission
test_probs = {}
test_ids = None

for name in ["rgb", "edge"]:
    _, valid_tf = TRANSFORMS[name]
    test_loader = make_loader(test_table, TEST_DIR, valid_tf, has_labels=False, shuffle=False)
    probs, ids = predict_probs(models[name], test_loader, return_ids=True)
    test_probs[name] = probs
    if test_ids is None:
        test_ids = ids

final_test_probs = best_rgb_weight * test_probs["rgb"] + edge_weight * test_probs["edge"]
test_preds = final_test_probs.argmax(1) + 1

submission = pd.DataFrame({"id": test_ids, "label": test_preds.astype(int)})
submission.to_csv(SUB_PATH, index=False)

prob_cols = ["prob_class_" + str(i) for i in range(1, NUM_CLASSES + 1)]
prob_table = pd.DataFrame(final_test_probs, columns=prob_cols)
prob_table.insert(0, "id", test_ids)
prob_table.to_csv(PROB_PATH, index=False)

print("\nSubmission salvat la:", SUB_PATH)
print("Probabilitati salvate la:", PROB_PATH)
print("\nDistributie predictii:")
print(submission["label"].value_counts().sort_index())
print("\nPrimele predictii:")
print(submission.head())
