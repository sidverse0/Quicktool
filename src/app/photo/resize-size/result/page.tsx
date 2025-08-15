
"use client";

import { useEffect, useState } from "react";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, RefreshCw } from "lucide-react";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useToast } from "@/hooks/use-toast";

export default function ResizeSizeResultPage() {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [resizedUrl, setResizedUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("resized-image.jpg");
    const [originalSize, setOriginalSize] = useState<number | null>(null);
    const [resizedSize, setResizedSize] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [borderColor, setBorderColor] = useState("hsl(var(--border))");
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const original = sessionStorage.getItem("originalImageDataUrl");
        const resized = sessionStorage.getItem("resizedImageDataUrl");
        const name = sessionStorage.getItem("resizedImageFileName");
        const color = sessionStorage.getItem("toolColor");

        if (resized && original && name) {
            setOriginalUrl(original);
            setResizedUrl(resized);
            setFileName(name);
            if(color) {
                setBorderColor(color);
            }
            
            fetch(original).then(res => res.blob()).then(blob => setOriginalSize(blob.size));
            fetch(resized).then(res => res.blob()).then(blob => setResizedSize(blob.size));
            
        } else {
            router.replace("/photo/resize-size");
        }
        setLoading(false);
    }, [router]);
    
    const formatFileSize = (bytes: number | null) => {
        if (bytes === null) return "N/A";
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleStartOver = () => {
        sessionStorage.removeItem("originalImageDataUrl");
        sessionStorage.removeItem("resizedImageDataUrl");
        sessionStorage.removeItem("resizedImageFileName");
        sessionStorage.removeItem("toolColor");
        router.push("/photo/resize-size");
    }

     const handleDownload = () => {
        if (!resizedUrl) return;
        const link = document.createElement("a");
        link.href = resizedUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
            title: "Download Started",
            description: "Your compressed image is downloading.",
        });
    }


    if (loading || !resizedUrl || !originalUrl) {
        return (
             <div className="flex flex-col h-full">
                <PageHeader title="Compression Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingIndicator />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Compression Result" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        <div>
            <CardHeader className="p-0 pb-2">
                <CardTitle>Compressed Image</CardTitle>
                <CardDescription>
                    Original: {formatFileSize(originalSize)} | New: {formatFileSize(resizedSize)}
                </CardDescription>
            </CardHeader>
            <div className="relative w-full aspect-square border-2 border-dashed rounded-lg" style={{ borderColor }}>
                <NextImage src={resizedUrl} alt="Resized Image" layout="fill" className="rounded-lg object-contain p-2" />
            </div>
        </div>
        <div className="space-y-2">
            <Button className="w-full" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Compress Another
            </Button>
        </div>
      </div>
    </div>
  );
}
