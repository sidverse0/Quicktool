
"use client";

import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import { Link, CaseSensitive, UserSquare, ImageUp } from "lucide-react";

const qrTools = [
  {
    title: "URL to QR",
    href: "/qr/maker",
    icon: Link,
    color: "#7a5de8",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "qr code link"
  },
  {
    title: "Text to QR",
    href: "/qr/text",
    icon: CaseSensitive,
    color: "#e85d87",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "text document"
  },
  {
    title: "vCard to QR",
    href: "/qr/vcard",
    icon: UserSquare,
    color: "#de5de8",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "contact card"
  },
  {
    title: "Image to QR",
    href: "/qr/image",
    icon: ImageUp,
    color: "#5de8d4",
    imgSrc: "https://placehold.co/600x400.png",
    imgHint: "upload image"
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
