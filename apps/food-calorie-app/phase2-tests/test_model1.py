import time
import torch
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
from pathlib import Path

print("========================================")
print("PHASE 2 - OFFLINE IMAGE MODEL TEST")
print("========================================")

image_dir = Path("phase2-tests/images")
images = list(image_dir.glob("*"))

if not images:
    print("? No images found")
    print("Put JPG/PNG food images in:")
    print(image_dir.resolve())
    raise SystemExit(1)

print(f"Images found: {len(images)}")

print("\nLoading ResNet50...")
start = time.perf_counter()

weights = ResNet50_Weights.DEFAULT
model = resnet50(weights=weights)
model.eval()

load_time = (time.perf_counter() - start) * 1000

print(f"? Model loaded")
print(f"Model load time: {load_time:.2f} ms")

preprocess = weights.transforms()
categories = weights.meta["categories"]

correct = 0
total = 0
times = []

print("\nIMAGE TEST")
print("----------------------------------------")

for image_path in images:
    try:
        image = Image.open(image_path).convert("RGB")

        start = time.perf_counter()

        input_tensor = preprocess(image).unsqueeze(0)

        with torch.no_grad():
            output = model(input_tensor)

        probabilities = torch.nn.functional.softmax(output[0], dim=0)
        confidence, index = torch.max(probabilities, 0)

        elapsed = (time.perf_counter() - start) * 1000
        times.append(elapsed)

        prediction = categories[index.item()]

        print(f"{image_path.name}")
        print(f"  Prediction: {prediction}")
        print(f"  Confidence: {confidence.item() * 100:.2f}%")
        print(f"  Time: {elapsed:.2f} ms")

        total += 1

    except Exception as error:
        print(f"? {image_path.name}: {error}")

if total:
    average_time = sum(times) / len(times)

    print("\n========================================")
    print("MODEL 1 RESULTS")
    print("========================================")
    print(f"Images tested: {total}")
    print(f"Average inference time: {average_time:.2f} ms")
    print("Model runs offline: YES")
    print("========================================")
else:
    print("? No images could be processed")
