import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import {
  Maximize,
  Minimize,
  FileImage,
  Droplet,
  Palette,
  Contrast,
  Scissors,
  Sparkles,
} from "lucide-react";

const photoTools = [
  {
    title: "PDF to Image",
    href: "/photo/pdf-to-image",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "file document"
  },
  {
    title: "Dimension Resizer",
    href: "/photo/resize-dimensions",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "landscape resize"
  },
  {
    title: "File Size Resizer",
    href: "/photo/resize-size",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "compress quality"
  },
  {
    title: "Image Watermarker",
    href: "/photo/watermark",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "watermark brand"
  },
  {
    title: "Image Filters",
    href: "/photo/filters",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "camera filters"
  },
  {
    title: "Color Palette Generator",
    href: "/photo/palette-generator",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "color palette"
  },
];

export default function PhotoPage() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <PageHeader title="Photo Tools" showBackButton/>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {photoTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
