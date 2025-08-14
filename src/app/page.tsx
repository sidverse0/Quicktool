
"use client";

import Image from 'next/image';
import MainLayout from '@/components/layout/main-layout';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <motion.div 
            className="flex flex-col items-center justify-center text-center flex-grow p-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
            className="relative h-32 w-32 mb-6"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
            <Image src="https://i.postimg.cc/kXnSKfgf/wrench.png" alt="Quick Tool Logo" width={128} height={128} className="relative z-10 object-contain drop-shadow-lg" />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mt-4 text-5xl md:text-6xl font-bold font-headline tracking-tight text-primary"
          >
            Quick Tool
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-3 max-w-md text-lg text-muted-foreground"
          >
            Your all-in-one toolbox for photos, QR codes, and more, powered by AI.
          </motion.p>
          
          <motion.div
            variants={itemVariants}
            className="mt-16 bg-secondary text-secondary-foreground py-2 px-6 rounded-full flex items-center text-sm"
          >
             <Image src="https://i.postimg.cc/kXnSKfgf/wrench.png" alt="Quick Tool Logo" width={16} height={16} className="mr-2 opacity-80" />
             <p>&copy; 2024 Quick Tool. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
