import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

type ToolCardProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function ToolCard({
  href,
  icon,
  title,
  description,
}: ToolCardProps) {
  return (
    <Link href={href} className="group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
        <CardContent className="p-4 flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold font-headline">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground self-center transition-transform duration-300 group-hover:translate-x-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
