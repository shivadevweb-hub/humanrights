import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { GalleryImage } from "../types";

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(err => console.error("Failed to fetch gallery", err));
  }, []);

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
              className="group relative overflow-hidden rounded-[32px] aspect-[4/3] bg-white border border-border"
            >
              <img
                src={image.url}
                alt={image.caption}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <p className="text-white font-extrabold uppercase text-xs tracking-widest mb-1 opacity-60">Impact Moment</p>
                <h3 className="text-white text-xl font-extrabold tracking-tight">{image.caption}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}


