import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import { QrCode } from "lucide-react";

const qrTools = [
  {
    title: "QR Code Maker",
    description: "Generate QR codes for links, text & more.",
    icon: <QrCode className="h-8 w-8 text-primary" />,
    href: "/qr/maker",
  },
];

export default function QrPage() {
  return (
    <MainLayout>
      <PageHeader title="QR Tools" />
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {qrTools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
