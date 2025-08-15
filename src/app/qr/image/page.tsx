
"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { DownloadDialog } from "@/components/download-dialog";
import QRCodeStyling from "qr-code-styling";
import type { Options as QRCodeStylingOptions } from "qr-code-styling";

function QRResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [qrValue, setQrValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [borderColor, setBorderColor] = useState("hsl(var(--border))");
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const [options, setOptions] = useState<QRCodeStylingOptions>({
    data: "https://firebasestudio.com",
    image: "",
    dotsOptions: {
      color: "#000000",
      type: "squares",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
  });

  useEffect(() => {
    const textFromUrl = searchParams.get('text');
    const colorParam = searchParams.get('color') || '#000000';
    const bgColorParam = searchParams.get('bgColor') || '#FFFFFF';
    const styleParam = (searchParams.get('style') as 'squares' | 'dots') || 'squares';
    const toolColor = sessionStorage.getItem("toolColor");

    if (textFromUrl) {
      setQrValue(textFromUrl);
      setOptions(prev => ({
          ...prev,
          data: textFromUrl,
          dotsOptions: { ...prev.dotsOptions, color: colorParam, type: styleParam },
          backgroundOptions: { ...prev.backgroundOptions, color: bgColorParam },
      }));

      if(toolColor) {
          setBorderColor(toolColor);
      }
    } else {
      router.back();
    }
    setIsLoading(false);
  }, [searchParams, router]);

  useEffect(() => {
    if (isLoading || !qrValue || !ref.current || !containerRef.current) return;
    
    const size = containerRef.current.offsetWidth - 48; // p-6 is 24px, so 2*24=48

    const qrCode = new QRCodeStyling({
      ...options,
      width: size,
      height: size,
    });
    
    if(ref.current) {
        ref.current.innerHTML = "";
        qrCode.append(ref.current);
        qrCode.getRawData("png").then((blob) => {
            if(blob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setDataUrl(reader.result as string);
                };
                reader.readAsDataURL(blob);
            }
        });
    }
    
    const handleResize = () => {
        if (!ref.current || !containerRef.current) return;
        const newSize = containerRef.current.offsetWidth - 48;
        qrCode.update({ width: newSize, height: newSize });
    }
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
    }

  }, [options, ref, containerRef, isLoading, qrValue]);

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
        <div ref={containerRef} className="relative flex items-center justify-center aspect-square rounded-lg border-2 border-dashed" style={{ borderColor }}>
            <div className="w-full h-full p-6 bg-white flex items-center justify-center">
                <div ref={ref} />
            </div>
        </div>
        <div className="space-y-2">
            <DownloadDialog dataUrl={dataUrl} fileName="qrcode">
                <Button
                    className="w-full"
                    disabled={!qrValue}
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download QR Code
                </Button>
            </DownloadDialog>
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
