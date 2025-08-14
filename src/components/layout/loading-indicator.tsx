
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LoadingIndicator() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        className="absolute inset-0 border-4 border-primary/50 border-t-primary rounded-full"
      />
      <Image src="https://i.postimg.cc/kXnSKfgf/wrench.png" alt="Quick Tool Logo" width={48} height={48} />
    </div>
  );
}
