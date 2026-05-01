# New Features: Unfolding Map & Gallery

## 🗺️ Unfolding Map Animation

The map now has an interactive "unfold" experience that reveals the map like a real paper map opening with gravity and wave effects.

### How It Works

1. **Initial State**: Users see an "Unfold the map" button with a subtle bouncing chevron
2. **Click to Unfold**: Clicking the button triggers a smooth spring animation
3. **Wave Effect**: A subtle wave ripple appears as the map unfolds
4. **Fold Option**: A "Fold" button appears to collapse the map back

### Animation Details

- **Duration**: 0.8 seconds
- **Effect**: Spring physics (stiffness: 80, damping: 12)
- **Wave**: Subtle gradient effect during unfold
- **Responsive**: Works on all screen sizes

### Code Location

**Component**: `client/src/components/UnfoldingMap.tsx`

```tsx
import UnfoldingMap from "@/components/UnfoldingMap";

// Usage:
<UnfoldingMap 
  active={active}
  onSelect={setActive}
  modeFilter={filter}
/>
```

---

## 🖼️ Property Gallery

A beautiful, interactive gallery for displaying property photos and sketches with lightbox viewing.

### Features

- **Responsive Grid**: Auto-adapts from 1 to 3 columns
- **Hover Effects**: Image info slides up on hover
- **Lightbox Modal**: Click images to view full-size
- **Badges**: Shows image type (Sketch/Photo)
- **Smooth Animations**: Framer Motion transitions

### Gallery Images Structure

```tsx
interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  style: "sketch" | "photograph";
}
```

### Code Location

**Component**: `client/src/components/PropertyGallery.tsx`
**Page Integration**: `client/src/pages/Home.tsx` (Line 126)

---

## 📸 Converting Photos to Sketches

Use the provided Python script to convert property photos into beautiful pencil sketches.

### Quick Start

1. **Locate your image**:
   ```bash
   # Example: ~/property.jpg
   ```

2. **Run the conversion script**:
   ```bash
   python3 scripts/convert-to-sketch.py ~/property.jpg output-sketch.jpg
   ```

3. **Upload the sketch** to a CDN (Cloudinary, Imgur, or your server)

4. **Add to gallery** (see below)

### Script Location

`scripts/convert-to-sketch.py`

### Intensity Levels

```bash
# Light sketch (feathery)
python3 scripts/convert-to-sketch.py input.jpg output.jpg 0.5

# Normal sketch (recommended)
python3 scripts/convert-to-sketch.py input.jpg output.jpg 1.0

# Dark sketch (bold)
python3 scripts/convert-to-sketch.py input.jpg output.jpg 1.5
```

---

## 🎨 Adding Images to Gallery

### Step 1: Convert Image to Sketch (Optional)

```bash
python3 scripts/convert-to-sketch.py your-photo.jpg your-sketch.jpg
```

### Step 2: Upload Image to CDN

Upload your sketch/photo to:
- **Cloudinary** (free tier: 5GB storage)
- **Imgur** (free, no signup required)
- **GitHub** (free for public repos)
- Your own server/CDN

Get the public URL of the uploaded image.

### Step 3: Add to PropertyGallery.tsx

Edit `client/src/components/PropertyGallery.tsx`:

```tsx
const DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: "property-sketch-1",
    src: "https://your-cdn.com/property-sketch.jpg", // Your image URL
    title: "Trails of Bheta — Main Lodge",
    description: "Pencil sketch rendering of the main building",
    style: "sketch",
  },
  {
    id: "property-photo-1",
    src: "https://your-cdn.com/property-photo.jpg",
    title: "Trails of Bheta — Aerial View",
    description: "Photograph of the property from above",
    style: "photograph",
  },
  // Add more images...
];
```

### Step 4: Deploy

```bash
git add .
git commit -m "feat: add property sketches to gallery"
git push origin main
```

Vercel will automatically redeploy with your new images!

---

## 🔧 Customizing the Experience

### Change Animation Speed

**UnfoldingMap.tsx** (line 16-27):
```tsx
const mapVariants = {
  unfolding: {
    transition: {
      duration: 0.8,  // Change this (in seconds)
      ease: "easeOut",
      type: "spring",
      stiffness: 80,  // Spring stiffness (higher = faster)
      damping: 12,    // Damping (higher = less bouncy)
    },
  },
};
```

### Change Gallery Grid

**PropertyGallery.tsx** (line 48):
```tsx
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//                                    ^^^^^^^^^
//                            Change 3 to 2 or 4
</div>
```

### Change Sketch Intensity

The default is `1.0`. Try `0.5` to `2.0`:

```bash
python3 scripts/convert-to-sketch.py input.jpg output.jpg 0.7
```

---

## 📦 What Was Changed

### New Files
- `client/src/components/UnfoldingMap.tsx` - Map unfolding animation
- `client/src/components/PropertyGallery.tsx` - Image gallery component
- `scripts/convert-to-sketch.py` - Image to sketch converter
- `scripts/README.md` - Script documentation

### Modified Files
- `client/src/pages/Home.tsx` - Integrated new components

### Git Commits
```
c5edd75 feat: add unfolding map animation and property gallery
bf907f5 docs: add sketch conversion script and instructions
```

---

## 🚀 Deployment

All changes are live on Vercel! Visit:
```
https://trails-of-bheta-4gceipss3-piyush-vermas-projects-4a8be759.vercel.app
```

Changes auto-deploy when you push to `main`:
```bash
git push origin main
```

---

## 📝 Next Steps

1. **Take a photo** of the property (if you have one)
2. **Convert to sketch**: `python3 scripts/convert-to-sketch.py photo.jpg sketch.jpg`
3. **Upload to CDN** (Cloudinary is easiest for free)
4. **Add URL to PropertyGallery.tsx**
5. **Push to GitHub** → Auto-deploys to Vercel

Need help? Check the code comments in the component files!
