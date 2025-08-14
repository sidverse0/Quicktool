
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function ResizeResultPage() {
    const [resizedUrl, setResizedUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("resized-image.png");
    const [loading, setLoading] = useState(true);
    const [borderColor, setBorderColor] = useState("hsl(var(--border))");
    const router = useRouter();

    useEffect(() => {
        const resized = sessionStorage.getItem("resizedImageDataUrl");
        const name = sessionStorage.getItem("resizedImageFileName");
        const color = sessionStorage.getItem("toolColor");

        if (resized && name) {
            setResizedUrl(resized);
            setFileName(name);
            if (color) {
                setBorderColor(color);
            }
        } else {
            router.replace("/photo/resize-dimensions");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("originalImageDataUrl");
        sessionStorage.removeItem("resizedImageDataUrl");
        sessionStorage.removeItem("resizedImageFileName");
        sessionStorage.removeItem("toolColor");
        router.push("/photo/resize-dimensions");
    }

    if (loading || !resizedUrl) {
        return (
             <div className="flex flex-col h-full">
                <PageHeader title="Resizing Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Resizing Result" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4 justify-center">
        <div className="relative w-full aspect-square border-2 border-dashed rounded-lg" style={{ borderColor }}>
            <Image src={resizedUrl} alt="Resized Image" layout="fill" className="rounded-lg object-contain p-2" />
        </div>
        <div className="space-y-2">
            <a href={resizedUrl} download={fileName}>
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download
                </Button>
            </a>
            <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Resize Another
            </Button>
        </div>
      </div>
    </div>
  );
}
