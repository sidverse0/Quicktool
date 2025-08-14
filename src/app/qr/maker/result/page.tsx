
"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import LoadingIndicator from "@/components/layout/loading-indicator";
import QRCode from "react-qr-code";
import { DownloadDialog } from "@/components/download-dialog";

function QRResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qrCodeRef = useRef<HTMLDivElement>(null);
  
  const [qrValue, setQrValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#FFFFFF");
  const [isLoading, setIsLoading] = useState(true);
  const [borderColor, setBorderColor] = useState("hsl(var(--border))");
  const [dataUrl, setDataUrl] = useState<string | null>(null);

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
  
   useEffect(() => {
    if (qrCodeRef.current) {
        const svg = qrCodeRef.current.querySelector('svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            setDataUrl(`data:image/svg+xml;base64,${btoa(svgData)}`);
        }
    }
  }, [qrValue, qrColor, qrBgColor]);

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
