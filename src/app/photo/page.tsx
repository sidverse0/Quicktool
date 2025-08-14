
"use client";

import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import {
  FileImage,
  Maximize,
  Minimize,
  Palette,
  ImageUp,
} from "lucide-react";

const photoTools = [
  {
    title: "PDF to Image",
    href: "/photo/pdf-to-image",
    icon: FileImage,
    color: "#e85d5d",
    imgSrc: "https://i.postimg.cc/d1T5nSJM/pdf-to-image.png",
    imgHint: "file document"
  },
  {
    title: "Image to PDF",
    href: "/photo/image-to-pdf",
    icon: ImageUp,
    color: "#e88d5d",
    imgSrc: "https://i.postimg.cc/qMhN1W2t/image-to-pdf.png",
    imgHint: "image file"
  },
  {
    title: "Dimension Resizer",
    href: "/photo/resize-dimensions",
    icon: Maximize,
    color: "#5d87e8",
    imgSrc: "https://i.postimg.cc/tJ05F2Yv/dimension-resizer.png",
    imgHint: "landscape resize"
  },
  {
    title: "File Size Resizer",
    href: "/photo/resize-size",
    icon: Minimize,
    color: "#5de899",
    imgSrc: "https://i.postimg.cc/Kz8q4J9t/size-resizer.png",
    imgHint: "compress quality"
  },
  {
    title: "Image Filters",
    href: "/photo/filters",
    icon: Palette,
    color: "#e85dd5",
    imgSrc: "https://i.postimg.cc/C5zB9fB5/image-filters.png",
    imgHint: "camera filters"
  },
  {
    title: "Color Palette",
    href: "/photo/palette-generator",
    icon: Palette,
    color: "#e8a05d",
    imgSrc: "https://i.postimg.cc/P5LgZzP4/color-palette.png",
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
