"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from 'next/image';
import { cn } from "@/lib/utils";

type ToolCardProps = {
  href: string;
  title: string;
  imgSrc: string;
  imgHint?: string;
};

export default function ToolCard({
  href,
  title,
  imgSrc,
  imgHint
}: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="h-full w-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="relative aspect-[4/3] w-full">
                <Image 
                    src={imgSrc} 
                    alt={title}
                    layout="fill" 
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    data-ai-hint={imgHint}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                 <h3 className="absolute bottom-2 left-3 font-semibold text-white font-headline text-base">
                    {title}
                 </h3>
            </div>
        </Card>
      </motion.div>
    </Link>
  );
}
