import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { GalleryImage } from "../types";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const snap = await getDocs(collection(db, "gallery"));
      if (snap.empty) {
        // Fallback to local data if no cloud data yet
        const localData = [
          { id: '1', url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop', caption: 'Community Support', description: 'Our team providing essential support to local communities.' },
          { id: '2', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013&auto=format&fit=crop', caption: 'Legal Aid Rally', description: 'Standing together for human rights and justice.' },
          { id: '3', url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1931&auto=format&fit=crop', caption: 'Educational Workshops', description: 'Empowering the next generation with knowledge of their rights.' }
        ];
        setImages(localData);
      } else {
        setImages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryImage)));
      }
    } catch (err) {
      console.error("Gallery Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-20">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 uppercase">Impact Gallery</h1>
          <p className="text-muted max-w-2xl mx-auto font-medium">
            Capturing moments from our global mission to protect and advocate for human rights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {images.map((image, i) => (
            <motion.div
              key={image.id || i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedImage(image)}
              className="group relative overflow-hidden rounded-[32px] aspect-[4/3] bg-white border border-border cursor-pointer"
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center">
                <ZoomIn className="text-white h-10 w-10 mb-2" />
                <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">View Details</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-lg font-extrabold tracking-tight line-clamp-1">{image.caption}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-bg/95 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-6xl bg-surface rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-full"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="lg:w-2/3 bg-black flex items-center justify-center overflow-hidden h-[40vh] lg:h-auto">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.caption} 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="lg:w-1/3 p-8 md:p-12 overflow-y-auto bg-surface">
                <div className="mb-8">
                  <span className="text-accent font-extrabold uppercase tracking-[0.3em] text-[10px] mb-4 block">Case Gallery</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-ink uppercase leading-none mb-6">
                    {selectedImage.caption}
                  </h2>
                  <div className="w-12 h-1 bg-accent rounded-full" />
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-extrabold uppercase tracking-[.2em] text-muted mb-3 opacity-60">Context & Narrative</h4>
                    <p className="text-ink font-medium leading-relaxed">
                      {selectedImage.description || "In our ongoing efforts to document and share human rights advancements, this image stands as a testament to the progress and challenges faced by communities worldwide."}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-border">
                    <p className="text-[10px] font-bold text-muted uppercase">Digital Record ID</p>
                    <p className="text-xs font-mono text-muted">{selectedImage.id}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


