
"use client";

import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import LoadingIndicator from "@/components/layout/loading-indicator";

function QRResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [borderColor, setBorderColor] = useState("hsl(var(--border))");

  useEffect(() => {
    const textFromUrl = searchParams.get('text');
    const colorParam = searchParams.get('color')?.substring(1) || '000000';
    const bgColor = searchParams.get('bgColor')?.substring(1) || 'FFFFFF';
    
    const textFromSession = sessionStorage.getItem("qrImageDataUrl");
    const toolColor = sessionStorage.getItem("toolColor");

    const text = textFromSession || textFromUrl;

    if (text) {
      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        text
      )}&size=512x512&margin=20&format=png&color=${colorParam}&bgcolor=${bgColor}`;
      setQrCodeUrl(url);
      if(toolColor) {
          setBorderColor(toolColor);
      }
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
    const isImageQr = !!sessionStorage.getItem("qrImageDataUrl");
    sessionStorage.removeItem("toolColor");
    sessionStorage.removeItem("qrImageDataUrl");
    
    if (isImageQr) {
        router.push('/qr/image');
    } else {
        router.push('/qr/maker');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="QR Code Result" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        <div className="relative flex items-center justify-center aspect-square rounded-lg border-2 border-dashed" style={{ borderColor }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingIndicator />
              </div>
            )}
            <div className="w-full h-full p-2 flex items-center justify-center">
              {qrCodeUrl && (
              <Image
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  width={512}
                  height={512}
                  className={`transition-opacity duration-300 rounded-lg max-w-full max-h-full ${
                  isLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setIsLoading(false)}
                  unoptimized
              />
              )}
            </div>
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
                    <LoadingIndicator />
                </div>
            </div>
        }>
            <QRResult />
        </Suspense>
    )
}
