import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import {
  FileImage,
  Maximize,
  Minimize,
  Droplet,
  Palette,
  Sparkles,
  Scissors
} from "lucide-react";

const photoTools = [
  {
    title: "Enhance Photo",
    href: "/photo/enhance",
    icon: Sparkles,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "galaxy stars"
  },
  {
    title: "Remove BG",
    href: "/photo/remove-background",
    icon: Scissors,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "person portrait"
  },
  {
    title: "PDF to Image",
    href: "/photo/pdf-to-image",
    icon: FileImage,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "file document"
  },
  {
    title: "Dimension Resizer",
    href: "/photo/resize-dimensions",
    icon: Maximize,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "landscape resize"
  },
  {
    title: "File Size Resizer",
    href: "/photo/resize-size",
    icon: Minimize,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "compress quality"
  },
  {
    title: "Image Watermarker",
    href: "/photo/watermark",
    icon: Droplet,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "watermark brand"
  },
  {
    title: "Image Filters",
    href: "/photo/filters",
    icon: Palette,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "camera filters"
  },
  {
    title: "Color Palette",
    href: "/photo/palette-generator",
    icon: Palette,
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
