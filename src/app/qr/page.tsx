import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import { QrCode } from "lucide-react";

const qrTools = [
  {
    title: "QR Code Maker",
    href: "/qr/maker",
    icon: QrCode,
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "qr code"
  },
];

export default function QrPage() {
  return (
    <MainLayout>
       <div className="flex flex-col h-full">
        <PageHeader title="QR Tools" showBackButton/>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {qrTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
