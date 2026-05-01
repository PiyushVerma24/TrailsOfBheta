import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  description: string;
  style: "sketch" | "photograph";
}

interface PropertyGalleryProps {
  images?: GalleryImage[];
}

const DEFAULT_IMAGES: GalleryImage[] = [
  {
    id: "property-image-1",
    src: "/bheta-property-sketch.jpg",
    title: "Trails of Bheta — Nestled in the Kumaon",
    description: "The main residence, perched quietly among ancient deodar forests at 1,890 metres. A place where the mountains echo silence.",
    style: "photograph",
  },
  {
    id: "property-image-2",
    src: "/bheta-property-sketch-2.jpg",
    title: "Trails of Bheta — Where the Hills Meet Home",
    description: "The grounds embrace the landscape without disturbing it. Every window frames a different fold of the Himalayas.",
    style: "photograph",
  },
];

export default function PropertyGallery({ images = DEFAULT_IMAGES }: PropertyGalleryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedImage = images.find((img) => img.id === selectedId);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--color-terracotta)] mb-3 flex items-center gap-3">
            <span className="inline-block w-8 h-px bg-[color:var(--color-terracotta)]" />
            Gallery
          </div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-4">
            A Sketch of Bheta
          </h2>
          <p className="text-[color:var(--color-ink-soft)] max-w-2xl">
            Hand-drawn sketches and photographs capturing the essence of Trails of Bheta — nestled in the quiet folds of the Kumaon hills.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <motion.button
              key={image.id}
              onClick={() => setSelectedId(image.id)}
              className="group relative overflow-hidden rounded-md aspect-square"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Image */}
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--color-ink)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Info */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 text-[color:var(--color-paper)]">
                <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="font-display text-lg leading-tight mb-1">{image.title}</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-[color:var(--color-paper)]/80">
                    {image.style}
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-mono uppercase tracking-[0.1em] bg-[color:var(--color-terracotta)] text-[color:var(--color-paper)]">
                {image.style === "sketch" ? "✏ Sketch" : "📷 Photo"}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[color:var(--color-paper)] rounded-md overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-[color:var(--color-ink)]/10 text-[color:var(--color-ink)] hover:bg-[color:var(--color-ink)]/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image */}
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[80vh] object-contain"
              />

              {/* Info */}
              <div className="p-6">
                <h3 className="font-display text-2xl mb-2">{selectedImage.title}</h3>
                <p className="text-[color:var(--color-ink-soft)] mb-3">{selectedImage.description}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded text-[10px] font-mono uppercase tracking-[0.1em] bg-[color:var(--color-terracotta)] text-[color:var(--color-paper)]">
                    {selectedImage.style === "sketch" ? "✏ Pencil Sketch" : "📷 Photograph"}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
