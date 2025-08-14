
"use client";

import Image from 'next/image';
import MainLayout from '@/components/layout/main-layout';
import { motion } from 'framer-motion';
import { ImageIcon, PenSquare, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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

const iconVariants = {
    hidden: { scale: 0, y: 20 },
    visible: (i: number) => ({
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1 + 0.8,
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    }),
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
          
          <div className="mt-16 flex space-x-8">
            <motion.div custom={0} variants={iconVariants}>
                <Link href="/photo" className="p-4 bg-secondary rounded-full shadow-md block">
                    <ImageIcon className="h-8 w-8 text-rose-500" />
                </Link>
            </motion.div>
            <motion.div custom={1} variants={iconVariants}>
                <Link href="/qr" className="p-4 bg-secondary rounded-full shadow-md block">
                    <QrCode className="h-8 w-8 text-indigo-500" />
                </Link>
            </motion.div>
            <motion.div custom={2} variants={iconVariants}>
                <Link href="/text" className="p-4 bg-secondary rounded-full shadow-md block">
                    <PenSquare className="h-8 w-8 text-teal-500" />
                </Link>
            </motion.div>
          </div>
        </motion.div>

        <footer className="w-full shrink-0 border-t mt-auto">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="container flex h-16 items-center justify-center text-sm text-muted-foreground"
            >
                <Image src="https://i.postimg.cc/kXnSKfgf/wrench.png" alt="Quick Tool Logo" width={20} height={20} className="mr-2 opacity-70" />
                <p>&copy; 2024 Quick Tool. All rights reserved.</p>
            </motion.div>
        </footer>
      </div>
    </MainLayout>
  );
}
