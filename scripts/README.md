# Scripts Directory

Utility scripts for the Trails of Bheta website.

## Convert Image to Sketch Style

Convert photographs to beautiful pencil sketch drawings.

### Usage

```bash
# Basic usage
python3 scripts/convert-to-sketch.py input.jpg output.jpg

# With custom intensity (0.5-2.0)
python3 scripts/convert-to-sketch.py input.jpg output.jpg 1.5
```

### Intensity Levels

- **0.5** - Light, feathery sketch
- **1.0** - Normal sketch (recommended)
- **1.5** - Dark, bold sketch
- **2.0** - Very dark sketch

### Examples

```bash
# Convert property photo to sketch
python3 scripts/convert-to-sketch.py ~/property.jpg ./property-sketch.jpg

# Create a light sketch version
python3 scripts/convert-to-sketch.py ~/photo.jpg ./photo-light.jpg 0.5

# Create a bold sketch version
python3 scripts/convert-to-sketch.py ~/photo.jpg ./photo-bold.jpg 1.5
```

### Adding Sketch to Gallery

Once you have your sketch image:

1. **Place the image** in a public location (CDN or public folder)
2. **Get the URL** (e.g., from Cloudinary, Imgur, or your server)
3. **Update PropertyGallery.tsx**:

```tsx
// In client/src/components/PropertyGallery.tsx
const DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: "property-sketch-1",
    src: "YOUR_SKETCH_IMAGE_URL", // Replace with your image URL
    title: "Trails of Bheta — Main Lodge",
    description: "Hand-drawn sketch style rendering of the main property building",
    style: "sketch",
  },
  // Add more images here...
];
```

### Tips

- **Best results** with high-quality source images (2000x2000px or larger)
- **File size**: Sketches are typically 30-50% smaller than original photos
- **Quality**: JPEG quality is set to 95 for best results
- **Batch processing**: Run the script multiple times for different intensity levels to choose the best one

### Requirements

- Python 3.6+
- PIL (Python Imaging Library)
- NumPy

Install dependencies:
```bash
pip install pillow numpy
```
