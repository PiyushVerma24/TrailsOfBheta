#!/usr/bin/env python3
"""
Apply vintage/sepia filter matching Trails of Bheta website aesthetic
- Aged paper background: #f4ebd9, #fbf3df
- Deodar green: #2F4A3A
- Terracotta: #B0512E
- Ink: #1b1a17

Usage: python3 scripts/apply-vintage-filter.py input.jpg output.jpg
"""

from PIL import Image, ImageEnhance
import numpy as np
import sys
import os

def apply_vintage_filter(input_path: str, output_path: str):
    """
    Apply vintage filter matching Trails of Bheta aesthetic
    """
    try:
        # Open image
        img = Image.open(input_path)
        print(f"✓ Opened: {input_path}")
        print(f"  Size: {img.size}, Mode: {img.mode}")

        # Convert RGBA to RGB if needed
        if img.mode == 'RGBA':
            background = Image.new('RGB', img.size, (244, 235, 217))  # Aged paper color
            background.paste(img, mask=img.split()[3] if len(img.split()) > 3 else None)
            img = background

        # Resize if too large
        max_size = 1200
        if max(img.size) > max_size:
            img.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
            print(f"  Resized to: {img.size}")

        # Convert to numpy array
        img_array = np.array(img, dtype=np.float32)

        # Apply vintage/sepia-like tone
        # Reduce saturation slightly
        from PIL import ImageOps
        img = ImageOps.autocontrast(img)

        # Reduce saturation for vintage look
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(0.8)  # 80% saturation
        print("✓ Reduced saturation for vintage feel")

        # Warm up the image (sepia-like)
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(0.95)  # Slightly darker
        print("✓ Applied warmth adjustment")

        # Add subtle aged paper overlay
        img_array = np.array(img, dtype=np.float32)

        # Create aged paper effect by shifting color slightly toward cream/tan
        aged_overlay = np.array([244, 235, 217], dtype=np.float32)  # #f4ebd9
        img_array = img_array * 0.92 + aged_overlay * 0.08
        img_array = np.clip(img_array, 0, 255)

        img = Image.fromarray(np.uint8(img_array))
        print("✓ Applied aged paper overlay")

        # Enhance contrast slightly
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.1)
        print("✓ Enhanced contrast")

        # Save
        os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)
        img.save(output_path, 'JPEG', quality=92)
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
        print("Usage: python3 apply-vintage-filter.py <input.jpg> <output.jpg>")
        print("\nExample:")
        print("  python3 apply-vintage-filter.py property.jpg property-vintage.jpg")
        print("\nThis applies a vintage filter matching the Trails of Bheta aesthetic:")
        print("  - Aged paper tones")
        print("  - Reduced saturation")
        print("  - Warm color cast")
        print("  - Enhanced contrast")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    success = apply_vintage_filter(input_file, output_file)
    sys.exit(0 if success else 1)
