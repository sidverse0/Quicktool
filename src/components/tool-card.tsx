"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from 'next/image';
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  href: string;
  title: string;
  imgSrc: string;
  imgHint?: string;
  icon: LucideIcon;
};

export default function ToolCard({
  href,
  title,
  imgSrc,
  imgHint,
  icon: Icon,
}: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card className="h-full w-full overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0 relative">
                <div className="relative aspect-square w-full">
                    <Image 
                        src={imgSrc} 
                        alt={title}
                        layout="fill" 
                        className="object-cover transition-transform duration-300 group-hover:scale-110 filter blur-sm"
                        data-ai-hint={imgHint}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <Icon className="h-10 w-10 text-primary mb-2" />
                    <h3 className="font-semibold text-white font-headline text-base text-center">
                        {title}
                    </h3>
                </div>
            </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
