#!/usr/bin/env python3
"""
Convert images to pencil sketch style
Usage: python3 scripts/convert-to-sketch.py input.jpg output.jpg
"""

from PIL import Image, ImageFilter, ImageOps
import numpy as np
import sys
import os

def convert_to_sketch(input_path: str, output_path: str, intensity: float = 1.0):
    """
    Convert image to sketch/pencil drawing style using PIL

    Args:
        input_path: Path to input image
        output_path: Path to save sketch image
        intensity: Sketch intensity (0.5-2.0, default 1.0)
    """
    try:
        # Open image
        img = Image.open(input_path)
        print(f"✓ Opened: {input_path}")
        print(f"  Size: {img.size}, Mode: {img.mode}")

        # Resize if too large (for processing speed)
        max_size = 2000
        if max(img.size) > max_size:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            print(f"  Resized to: {img.size}")

        # Convert to grayscale
        gray = ImageOps.grayscale(img)
        print("✓ Converted to grayscale")

        # Invert image
        inverted = ImageOps.invert(gray)

        # Apply Gaussian blur
        blurred = inverted.filter(ImageFilter.GaussianBlur(radius=7))
        print("✓ Applied blur filter")

        # Convert to numpy arrays for dodge blend
        gray_arr = np.array(gray, dtype=np.float32)
        blurred_arr = np.array(blurred, dtype=np.float32)

        # Dodge blend mode: creates sketch effect
        # Formula: gray / (inverted_blurred / 255) * intensity
        sketch_arr = np.clip(
            (gray_arr * 255 / (blurred_arr + 1)) * intensity,
            0, 255
        )

        sketch = Image.fromarray(np.uint8(sketch_arr))
        print("✓ Applied dodge blend")

        # Increase contrast for better sketch look
        sketch = ImageOps.autocontrast(sketch, cutoff=2)
        print("✓ Enhanced contrast")

        # Save with high quality
        os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
        sketch.save(output_path, 'JPEG', quality=95)
        print(f"✓ Saved: {output_path}")

        return True

    except FileNotFoundError:
        print(f"✗ Error: File not found - {input_path}")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 convert-to-sketch.py <input.jpg> <output.jpg> [intensity]")
        print("\nExample:")
        print("  python3 convert-to-sketch.py property.jpg property-sketch.jpg")
        print("  python3 convert-to-sketch.py property.jpg property-sketch.jpg 1.5")
        print("\nIntensity options:")
        print("  0.5  - Light sketch")
        print("  1.0  - Normal sketch (default)")
        print("  1.5  - Dark sketch")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    intensity = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0

    success = convert_to_sketch(input_file, output_file, intensity)
    sys.exit(0 if success else 1)
