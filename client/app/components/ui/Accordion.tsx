import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Accordion = ({ items }: { items: { q: string; a: string }[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="border-b border-zinc-200">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full py-6 flex justify-between items-center text-left font-bold text-zinc-900"
          >
            {item.q}
            <motion.span animate={{ rotate: openIndex === i ? 45 : 0 }} className="text-2xl text-zinc-400">+</motion.span>
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-zinc-500 leading-relaxed">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};