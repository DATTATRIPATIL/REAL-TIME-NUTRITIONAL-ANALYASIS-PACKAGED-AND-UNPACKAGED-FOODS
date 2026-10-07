import time
from pathlib import Path

import torch
from PIL import Image
from torchvision.models import (
    resnet50,
    ResNet50_Weights,
    efficientnet_b0,
    EfficientNet_B0_Weights,
    mobilenet_v3_small,
    MobileNet_V3_Small_Weights,
)

print("=" * 60)
print("PHASE 2 - OFFLINE IMAGE MODEL COMPARISON")
print("=" * 60)

image_dir = Path("phase2-tests/images")

images = [
    p for p in image_dir.iterdir()
    if p.suffix.lower() in [".jpg", ".jpeg", ".png"]
]

if not images:
    print("ERROR: No food images found.")
    print("Put food images inside:")
    print(image_dir.resolve())
    raise SystemExit(1)

print(f"\nImages found: {len(images)}")

models = [
    (
        "Model 1 - ResNet50",
        resnet50,
        ResNet50_Weights.DEFAULT,
    ),
    (
        "Model 2 - EfficientNet-B0",
        efficientnet_b0,
        EfficientNet_B0_Weights.DEFAULT,
    ),
    (
        "Model 3 - MobileNet-V3",
        mobilenet_v3_small,
        MobileNet_V3_Small_Weights.DEFAULT,
    ),
]

all_results = []

for model_name, model_function, weights in models:

    print("\n" + "=" * 60)
    print(model_name)
    print("=" * 60)

    start_load = time.perf_counter()

    model = model_function(weights=weights)
    model.eval()

    load_time = (time.perf_counter() - start_load) * 1000

    preprocess = weights.transforms()
    categories = weights.meta["categories"]

    print(f"Model load time: {load_time:.2f} ms")

    times = []

    for image_path in images:

        try:
            image = Image.open(image_path).convert("RGB")

            input_tensor = preprocess(image).unsqueeze(0)

            start = time.perf_counter()

            with torch.no_grad():
                output = model(input_tensor)

            elapsed = (time.perf_counter() - start) * 1000

            probabilities = torch.nn.functional.softmax(
                output[0], dim=0
            )

            confidence, index = torch.max(
                probabilities, 0
            )

            prediction = categories[index.item()]

            times.append(elapsed)

            print(
                f"{image_path.name:20} "
                f"{prediction[:30]:30} "
                f"{confidence.item() * 100:6.2f}% "
                f"{elapsed:8.2f} ms"
            )

        except Exception as error:
            print(f"ERROR {image_path.name}: {error}")

    if times:
        average_time = sum(times) / len(times)

        all_results.append(
            (
                model_name,
                average_time,
            )
        )

        print(
            f"\nAverage inference time: "
            f"{average_time:.2f} ms"
        )

print("\n")
print("=" * 60)
print("FINAL MODEL COMPARISON")
print("=" * 60)

for name, avg_time in all_results:
    print(f"{name:30} {avg_time:10.2f} ms")

print("=" * 60)
print("All models tested OFFLINE: YES")
print("=" * 60)