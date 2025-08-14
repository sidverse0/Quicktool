"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import LoadingIndicator from "@/components/layout/loading-indicator";
import QRCode from "react-qr-code";

function QRResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  const [qrValue, setQrValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#FFFFFF");
  const [isLoading, setIsLoading] = useState(true);
  const [borderColor, setBorderColor] = useState("hsl(var(--border))");

  useEffect(() => {
    const textFromUrl = searchParams.get('text');
    const colorParam = searchParams.get('color') || '#000000';
    const bgColorParam = searchParams.get('bgColor') || '#FFFFFF';
    const toolColor = sessionStorage.getItem("toolColor");

    if (textFromUrl) {
      setQrValue(textFromUrl);
      setQrColor(colorParam);
      setQrBgColor(bgColorParam);
      if(toolColor) {
          setBorderColor(toolColor);
      }
    } else {
      router.back();
    }
    setIsLoading(false);
  }, [searchParams, router]);

  const handleDownload = () => {
    if (!qrCodeRef.current) return;
    
    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        
        const link = document.createElement("a");
        link.href = pngFile;
        link.download = "qrcode.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };


  const handleStartOver = () => {
    sessionStorage.removeItem("toolColor");
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="QR Code Result" showBackButton />
        <div className="flex-1 flex items-center justify-center">
          <LoadingIndicator />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="QR Code Result" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        <div className="relative flex items-center justify-center aspect-square rounded-lg border-2 border-dashed" style={{ borderColor }}>
            <div ref={qrCodeRef} className="w-full h-full p-6 bg-white flex items-center justify-center">
                {qrValue ? (
                    <QRCode
                        value={qrValue}
                        size={512}
                        fgColor={qrColor}
                        bgColor={qrBgColor}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                ) : (
                    <LoadingIndicator />
                )}
            </div>
        </div>
        <div className="space-y-2">
            <Button
                className="w-full"
                onClick={handleDownload}
                disabled={!qrValue}
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