import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import { PenSquare, FileText } from "lucide-react";

const textTools = [
  {
    title: "Calligraphy Signature",
    href: "/text/signature",
    icon: PenSquare,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "signature calligraphy"
  },
  {
    title: "Hand-written Notes",
    href: "/text/notes",
    icon: FileText,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "notebook paper"
  },
];

export default function TextPage() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <PageHeader title="Text Tools" showBackButton/>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {textTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
