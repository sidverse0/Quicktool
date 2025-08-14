"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function WatermarkResultPage() {
    const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("watermarked-image.png");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const watermarked = sessionStorage.getItem("watermarkedImageDataUrl");
        const name = sessionStorage.getItem("watermarkedImageFileName");

        if (watermarked && name) {
            setWatermarkedUrl(watermarked);
            setFileName(name);
        } else {
            router.replace("/photo/watermark");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("watermarkedImageDataUrl");
        sessionStorage.removeItem("watermarkedImageFileName");
        router.push("/photo/watermark");
    }

    if (loading || !watermarkedUrl) {
        return (
             <div className="flex flex-col h-full">
                <PageHeader title="Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Result" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        <Card className="shadow-none border-none">
            <CardContent className="p-0">
                <div className="relative w-full aspect-square">
                    <Image src={watermarkedUrl} alt="Watermarked Image" layout="fill" className="rounded-lg object-contain" />
                </div>
            </CardContent>
        </Card>
        <Card className="shadow-none border-none">
            <CardContent className="p-0 space-y-2">
                <a href={watermarkedUrl} download={fileName}>
                    <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download
                    </Button>
                </a>
                <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Watermark Another
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
