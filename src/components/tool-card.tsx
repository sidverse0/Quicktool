
"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Badge } from "./ui/badge";

type ToolCardProps = {
  href: string;
  title: string;
  icon: LucideIcon;
  color?: string;
  gradient?: string;
  isTrial?: boolean;
};

export default function ToolCard({
  href,
  title,
  icon: Icon,
  color,
  gradient,
  isTrial = false,
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
                <div 
                    className="relative aspect-square w-full transition-transform duration-300 group-hover:scale-110"
                    style={{ background: gradient || 'hsl(var(--secondary))' }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/20">
                    <Icon className="h-10 w-10 mb-2 drop-shadow-lg" style={{ color: color || 'white' }} />
                    <h3 className="font-semibold text-white font-headline text-base text-center drop-shadow-lg">
                        {title}
                    </h3>
                </div>
                {isTrial && (
                  <Badge variant="destructive" className="absolute top-2 right-2">Trial</Badge>
                )}
            </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
