import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";

export default function WhatsAppButton() {
  const phoneNumber = "1234567890"; // Replace with real number
  const message = encodeURIComponent("Hello! I need assistance with a human rights concern.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-20 right-10 z-50 bg-[#25D366] text-white px-6 py-3 rounded-full shadow-2xl font-bold text-sm flex items-center gap-2"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      Legal Hotline
    </motion.a>
  );
}

