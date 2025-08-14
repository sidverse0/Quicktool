"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type ToolCardProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color?: string;
};

export default function ToolCard({
  href,
  icon,
  title,
  description,
  color,
}: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="h-full"
      >
        <Card
          className={cn(
            "h-full transition-all duration-300 shadow-sm hover:shadow-lg border-primary/20 hover:border-primary/40",
            color ? "text-white bg-gradient-to-br" : "bg-card"
          )}
        >
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
              <div className={cn("p-2 rounded-lg", color ? "" : "bg-primary/10 text-primary")}>
                {icon}
              </div>
               <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
            </div>
            <div className="mt-4">
              <h3 className="font-semibold font-headline">{title}</h3>
              <p className={cn("text-xs", color ? "text-white/80" : "text-muted-foreground")}>{description}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
