
"use client";

import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import { useLanguage } from "@/hooks/use-language";
import { PenSquare, FileText } from "lucide-react";

const textTools = [
  {
    key: "calligraphySignature",
    href: "/text/signature",
    icon: PenSquare,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #14b8a6, #2dd4bf)",
  },
  {
    key: "handwrittenNotes",
    href: "/text/notes",
    icon: FileText,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #eab308, #fde047)",
  },
];

export default function TextPage() {
  const { t } = useLanguage();
  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <PageHeader title={t('text_tools')} showBackButton/>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {textTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} title={t(`tools.${tool.key}`)} isTrial />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
