import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import {
  Maximize,
  Minimize,
  Sparkles,
  Scissors,
} from "lucide-react";

const photoTools = [
  {
    title: "Photo Background Remover",
    description: "Erase backgrounds with AI precision.",
    icon: <Scissors className="h-8 w-8 text-primary" />,
    href: "/photo/remove-background",
  },
  {
    title: "Photo Resizer (Dimensions)",
    description: "Adjust image width and height easily.",
    icon: <Maximize className="h-8 w-8 text-primary" />,
    href: "/photo/resize-dimensions",
  },
  {
    title: "Photo Resizer (File Size)",
    description: "Shrink file size without losing quality.",
    icon: <Minimize className="h-8 w-8 text-primary" />,
    href: "/photo/resize-size",
  },
  {
    title: "Photo Auto Enhancer",
    description: "Improve photos with a single click.",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    href: "/photo/enhance",
  },
];

export default function PhotoPage() {
  return (
    <MainLayout>
      <PageHeader title="Photo Tools" />
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photoTools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
