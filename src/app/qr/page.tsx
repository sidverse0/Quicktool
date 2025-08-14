
"use client";

import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import ToolCard from "@/components/tool-card";
import { useLanguage } from "@/hooks/use-language";
import { Link, CaseSensitive, UserSquare, IndianRupee } from "lucide-react";

const qrTools = [
  {
    toolKey: "urlToQr",
    href: "/qr/maker",
    icon: Link,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #8b5cf6, #a78bfa)",
  },
  {
    toolKey: "textToQr",
    href: "/qr/text",
    icon: CaseSensitive,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #ec4899, #f472b6)",
  },
  {
    toolKey: "vcardToQr",
    href: "/qr/vcard",
    icon: UserSquare,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #a855f7, #c084fc)",
  },
  {
    toolKey: "upiToQr",
    href: "/qr/upi",
    icon: IndianRupee,
    color: "#FFFFFF",
    gradient: "linear-gradient(to top right, #10b981, #34d399)",
  },
];

export default function QrPage() {
  const { t } = useLanguage();

  return (
    <MainLayout>
       <div className="flex flex-col h-full">
        <PageHeader title={t('qr_tools')} showBackButton/>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {qrTools.map(({ toolKey, ...rest }) => (
              <ToolCard key={toolKey} {...rest} title={t(`tools.${toolKey}`)} isTrial />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
