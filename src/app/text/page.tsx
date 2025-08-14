import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import { PenSquare, FileText } from "lucide-react";

const textTools = [
  {
    title: "Calligraphy Signature",
    description: "Convert your text into a stylish signature.",
    icon: <PenSquare className="h-8 w-8" />,
    href: "/text/signature",
    color: 'from-blue-500 to-sky-500',
  },
  {
    title: "Hand-written Notes",
    description: "Convert text into hand-written style notes.",
    icon: <FileText className="h-8 w-8" />,
    href: "/text/notes",
    color: 'from-green-500 to-teal-500',
  },
];

export default function TextPage() {
  return (
    <MainLayout>
      <PageHeader title="Text Tools" showBackButton/>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {textTools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
