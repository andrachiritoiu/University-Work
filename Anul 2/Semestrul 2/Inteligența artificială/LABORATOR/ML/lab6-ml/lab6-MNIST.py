import torch
import torch.nn as nn
import torch.nn.functional as F

from torch.utils.data import DataLoader
from torchvision import datasets
from torchvision.transforms import Compose, ToTensor, Normalize


# 1. Alegem device-ul: GPU daca exista, altfel CPU
device = "cuda" if torch.cuda.is_available() else "cpu"
print("Device folosit:", device)


# 2. Transformari pentru MNIST
# ToTensor() transforma imaginea in tensor cu valori intre 0 si 1
# Normalize scade media si imparte la deviatia standard
transform = Compose([
    ToTensor(),
    Normalize((0.1307,), (0.3081,))
])


# 3. Incarcam datele MNIST
train_data = datasets.MNIST(
    root="data",
    train=True,
    download=True,
    transform=transform
)

test_data = datasets.MNIST(
    root="data",
    train=False,
    download=True,
    transform=transform
)


# 4. DataLoader imparte datele in batch-uri
train_loader = DataLoader(train_data, batch_size=64, shuffle=True)
test_loader = DataLoader(test_data, batch_size=64, shuffle=False)


# 5. Clasa pentru o retea configurabila
class MLP(nn.Module):
    def __init__(self, hidden_layers, activation_name):
        super().__init__()

        self.flatten = nn.Flatten()

        self.hidden_layers = nn.ModuleList()

        input_size = 28 * 28

        for hidden_size in hidden_layers:
            self.hidden_layers.append(nn.Linear(input_size, hidden_size))
            input_size = hidden_size

        self.output_layer = nn.Linear(input_size, 10)

        self.activation_name = activation_name

    def activation(self, x):
        if self.activation_name == "tanh":
            return torch.tanh(x)
        elif self.activation_name == "relu":
            return F.relu(x)
        else:
            raise ValueError("Functia de activare trebuie sa fie tanh sau relu.")

    def forward(self, x):
        x = self.flatten(x)

        for layer in self.hidden_layers:
            x = layer(x)
            x = self.activation(x)

        x = self.output_layer(x)

        return x


# 6. Functie de antrenare
def train_model(model, train_loader, optimizer, loss_function, num_epochs=5):
    model.train()

    for epoch in range(num_epochs):
        total_loss = 0

        for images, labels in train_loader:
            images = images.to(device)
            labels = labels.to(device)

            # Forward
            predictions = model(images)
            loss = loss_function(predictions, labels)

            # Backward
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        mean_loss = total_loss / len(train_loader)
        print(f"Epoca {epoch + 1}/{num_epochs}, loss mediu: {mean_loss:.4f}")


# 7. Functie de testare
def evaluate_model(model, test_loader, loss_function):
    model.eval()

    correct = 0
    total = 0
    total_loss = 0

    with torch.no_grad():
        for images, labels in test_loader:
            images = images.to(device)
            labels = labels.to(device)

            predictions = model(images)
            loss = loss_function(predictions, labels)

            total_loss += loss.item()

            predicted_labels = predictions.argmax(dim=1)

            correct += (predicted_labels == labels).sum().item()
            total += labels.size(0)

    accuracy = correct / total
    mean_loss = total_loss / len(test_loader)

    return accuracy, mean_loss


# 8. Configuratiile cerute in laborator
configuratii = [
    {
        "nume": "a) 1 strat ascuns, 1 neuron, tanh, lr=1e-2",
        "hidden_layers": [1],
        "activation": "tanh",
        "lr": 1e-2,
        "momentum": 0
    },
    {
        "nume": "b) 1 strat ascuns, 10 neuroni, tanh, lr=1e-2",
        "hidden_layers": [10],
        "activation": "tanh",
        "lr": 1e-2,
        "momentum": 0
    },
    {
        "nume": "c) 1 strat ascuns, 10 neuroni, tanh, lr=1e-5",
        "hidden_layers": [10],
        "activation": "tanh",
        "lr": 1e-5,
        "momentum": 0
    },
    {
        "nume": "d) 1 strat ascuns, 10 neuroni, tanh, lr=10",
        "hidden_layers": [10],
        "activation": "tanh",
        "lr": 10,
        "momentum": 0
    },
    {
        "nume": "e) 2 straturi ascunse, 10 neuroni fiecare, tanh, lr=1e-2",
        "hidden_layers": [10, 10],
        "activation": "tanh",
        "lr": 1e-2,
        "momentum": 0
    },
    {
        "nume": "f) 2 straturi ascunse, 10 neuroni fiecare, relu, lr=1e-2",
        "hidden_layers": [10, 10],
        "activation": "relu",
        "lr": 1e-2,
        "momentum": 0
    },
    {
        "nume": "g) 2 straturi ascunse, 100 neuroni fiecare, relu, lr=1e-2",
        "hidden_layers": [100, 100],
        "activation": "relu",
        "lr": 1e-2,
        "momentum": 0
    },
    {
        "nume": "h) 2 straturi ascunse, 100 neuroni fiecare, relu, lr=1e-2, momentum=0.9",
        "hidden_layers": [100, 100],
        "activation": "relu",
        "lr": 1e-2,
        "momentum": 0.9
    }
]


# 9. Rulam toate configuratiile
loss_function = nn.CrossEntropyLoss()

rezultate = []

for config in configuratii:
    print(config["nume"])

    model = MLP(
        hidden_layers=config["hidden_layers"],
        activation_name=config["activation"]
    ).to(device)

    optimizer = torch.optim.SGD(
        model.parameters(),
        lr=config["lr"],
        momentum=config["momentum"]
    )

    train_model(
        model=model,
        train_loader=train_loader,
        optimizer=optimizer,
        loss_function=loss_function,
        num_epochs=5
    )

    accuracy, test_loss = evaluate_model(
        model=model,
        test_loader=test_loader,
        loss_function=loss_function
    )

    print(f"Acuratete test: {accuracy * 100:.2f}%")
    print(f"Loss test: {test_loss:.4f}")

    rezultate.append({
        "configuratie": config["nume"],
        "accuracy": accuracy,
        "test_loss": test_loss
    })


# 10. Afisam rezumatul final
print("\n\nREZULTATE FINALE")

for rezultat in rezultate:
    print()
    print(rezultat["configuratie"])
    print(f"Acuratete: {rezultat['accuracy'] * 100:.2f}%")
    print(f"Loss test: {rezultat['test_loss']:.4f}")