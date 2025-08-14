"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function EnhanceResultPage() {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [enhancedUrl, setEnhancedUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const original = sessionStorage.getItem("originalImageDataUrl");
        const enhanced = sessionStorage.getItem("enhancedImageDataUrl");

        if (enhanced && original) {
            setOriginalUrl(original);
            setEnhancedUrl(enhanced);
        } else {
            router.replace("/photo/enhance");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("originalImageDataUrl");
        sessionStorage.removeItem("enhancedImageDataUrl");
        router.push("/photo/enhance");
    }

    if (loading || !enhancedUrl || !originalUrl) {
        return (
             <div className="flex flex-col h-full">
                <PageHeader title="Enhancement Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Enhancement Result" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="relative w-full aspect-square bg-secondary rounded-lg">
                <Image src={enhancedUrl} alt="Enhanced Image" layout="fill" className="object-contain p-2" />
                 <p className="absolute top-2 left-2 text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full">Enhanced</p>
            </div>
            <div className="relative w-full aspect-square bg-secondary rounded-lg">
                <Image src={originalUrl} alt="Original Image" layout="fill" className="object-contain p-2" />
                <p className="absolute top-2 left-2 text-xs font-semibold bg-muted text-muted-foreground px-2 py-1 rounded-full">Original</p>
            </div>
        </div>

        <div className="space-y-2">
            <a href={enhancedUrl} download="enhanced-photo.png">
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download
                </Button>
            </a>
            <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Enhance Another
            </Button>
        </div>
      </div>
    </div>
  );
}
