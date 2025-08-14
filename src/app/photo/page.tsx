
"use client";

import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import { useLanguage } from "@/hooks/use-language";
import {
  FileImage,
  Maximize,
  Minimize,
  Palette,
  ImageUp,
} from "lucide-react";

const photoTools = [
  {
    key: "pdfToImage",
    href: "/photo/pdf-to-image",
    icon: FileImage,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #ef4444, #f87171)",
  },
  {
    key: "imageToPdf",
    href: "/photo/image-to-pdf",
    icon: ImageUp,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #f97316, #fb923c)",
  },
  {
    key: "dimensionResizer",
    href: "/photo/resize-dimensions",
    icon: Maximize,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #3b82f6, #60a5fa)",
  },
  {
    key: "fileSizeResizer",
    href: "/photo/resize-size",
    icon: Minimize,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #22c55e, #4ade80)",
  },
  {
    key: "imageFilters",
    href: "/photo/filters",
    icon: Palette,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #d946ef, #e879f9)",
  },
  {
    key: "colorPalette",
    href: "/photo/palette-generator",
    icon: Palette,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #f59e0b, #facc15)",
  },
];

export default function PhotoPage() {
  const { t } = useLanguage();
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <PageHeader title={t('photo_tools')} showBackButton/>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {photoTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} title={t(`tools.${tool.key}`)} isTrial />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
