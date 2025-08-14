"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";

function QRResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const text = searchParams.get('text');
    const color = searchParams.get('color')?.substring(1); // remove #
    const bgColor = searchParams.get('bgColor')?.substring(1); // remove #
    
    if (text && color && bgColor) {
      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        text
      )}&size=512x512&margin=20&format=png&color=${color}&bgcolor=${bgColor}`;
      setQrCodeUrl(url);
    } else {
      router.replace('/qr/maker');
    }
  }, [searchParams, router]);

  const handleDownload = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qrcode.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QR code", error);
    }
  };

  const handleStartOver = () => {
    router.push('/qr/maker');
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="QR Code Result" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        <div className="flex items-center justify-center aspect-square bg-gray-100 rounded-lg">
            {(isLoading || !qrCodeUrl) && (
            <div className="flex flex-col items-center text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
            )}
            {qrCodeUrl && (
            <Image
                src={qrCodeUrl}
                alt="Generated QR Code"
                width={512}
                height={512}
                className={`transition-opacity duration-300 rounded-lg ${
                isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
                unoptimized
            />
            )}
        </div>
        <div className="space-y-2">
            <Button
                className="w-full"
                onClick={handleDownload}
                disabled={!qrCodeUrl || isLoading}
            >
                <Download className="mr-2 h-4 w-4" />
                Download QR Code
            </Button>
                <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Create Another
            </Button>
        </div>
      </div>
    </div>
  );
}

export default function QrMakerResultPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col h-full">
                <PageHeader title="QR Code Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        }>
            <QRResult />
        </Suspense>
    )
}
