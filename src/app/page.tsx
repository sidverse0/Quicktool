
"use client";

import Image from 'next/image';
import MainLayout from '@/components/layout/main-layout';
import { motion } from 'framer-motion';
import { ImageIcon, PenSquare, QrCode } from 'lucide-react';

const iconVariants = {
  hidden: { scale: 0, y: 20 },
  visible: (i: number) => ({
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15 + 0.5,
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  }),
};

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full p-4">
        <div className="flex flex-col items-center justify-center text-center flex-grow">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            className="rounded-full overflow-hidden h-28 w-28 flex items-center justify-center bg-primary/10 mb-6 border-4 border-primary/20 shadow-lg"
          >
            <Image src="https://i.postimg.cc/kXnSKfgf/wrench.png" alt="Quick Tool Logo" width={72} height={72} className="object-contain" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-4 text-5xl font-bold font-headline tracking-tight text-primary"
          >
            Quick Tool
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-3 max-w-sm text-lg text-muted-foreground"
          >
            Your all-in-one toolbox for photos, QR codes, and more, powered by AI.
          </motion.p>
          
          <div className="mt-12 flex space-x-6">
            <motion.div custom={0} initial="hidden" animate="visible" variants={iconVariants}>
              <div className="p-4 bg-secondary rounded-full">
                <ImageIcon className="h-7 w-7 text-rose-500" />
              </div>
            </motion.div>
            <motion.div custom={1} initial="hidden" animate="visible" variants={iconVariants}>
              <div className="p-4 bg-secondary rounded-full">
                <QrCode className="h-7 w-7 text-indigo-500" />
              </div>
            </motion.div>
            <motion.div custom={2} initial="hidden" animate="visible" variants={iconVariants}>
              <div className="p-4 bg-secondary rounded-full">
                <PenSquare className="h-7 w-7 text-teal-500" />
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center text-sm text-muted-foreground pb-4"
        >
          <p>made with love ❤️</p>
        </motion.div>
      </div>
    </MainLayout>
  );
}
