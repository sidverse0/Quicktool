import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import {
  Maximize,
  Minimize,
  FileImage,
} from "lucide-react";

const photoTools = [
  {
    title: "PDF to Image",
    description: "Convert PDF pages to JPG/PNG images.",
    icon: <FileImage className="h-8 w-8" />,
    href: "/photo/pdf-to-image",
    color: 'from-red-500 to-orange-500',
  },
  {
    title: "Dimension Resizer",
    description: "Adjust image width and height easily.",
    icon: <Maximize className="h-8 w-8" />,
    href: "/photo/resize-dimensions",
     color: 'from-green-500 to-green-600',
  },
  {
    title: "File Size Resizer",
    description: "Shrink file size without losing quality.",
    icon: <Minimize className="h-8 w-8" />,
    href: "/photo/resize-size",
    color: 'from-yellow-500 to-yellow-600',
  },
];

export default function PhotoPage() {
  return (
    <MainLayout>
      <PageHeader title="Photo Tools" showBackButton/>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {photoTools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
