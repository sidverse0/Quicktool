import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ToolCardProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="h-full"
      >
        <Card
          className={cn(
            "h-full transition-all duration-300 shadow-md hover:shadow-lg text-white bg-gradient-to-br",
            color
          )}
        >
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div className="flex-shrink-0">{icon}</div>
            <div className="mt-2">
              <h3 className="font-semibold font-headline">{title}</h3>
              <p className="text-xs text-white/80">{description}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
