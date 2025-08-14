
"use client";

import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import { Link, CaseSensitive, UserSquare, IndianRupee } from "lucide-react";

const qrTools = [
  {
    title: "URL to QR",
    href: "/qr/maker",
    icon: Link,
    color: "#7a5de8",
    imgSrc: "https://i.postimg.cc/3JcWwms9/url-to-qr.png",
    imgHint: "qr code link"
  },
  {
    title: "Text to QR",
    href: "/qr/text",
    icon: CaseSensitive,
    color: "#e85d87",
    imgSrc: "https://i.postimg.cc/L5KZyYJb/text-to-qr.png",
    imgHint: "text document"
  },
  {
    title: "vCard to QR",
    href: "/qr/vcard",
    icon: UserSquare,
    color: "#de5de8",
    imgSrc: "https://i.postimg.cc/tRnWzT2S/vcard-to-qr.png",
    imgHint: "contact card"
  },
  {
    title: "UPI Payment QR",
    href: "/qr/upi",
    icon: IndianRupee,
    color: "#5de87a",
    imgSrc: "https://i.postimg.cc/7PMFk6B7/upi-to-qr.png",
    imgHint: "payment currency"
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
