
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import LoadingIndicator from "@/components/layout/loading-indicator";
import { useToast } from "@/hooks/use-toast";

export default function FilterResultPage() {
    const [filteredUrl, setFilteredUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("filtered-image.png");
    const [loading, setLoading] = useState(true);
    const [borderColor, setBorderColor] = useState("hsl(var(--border))");
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const filtered = sessionStorage.getItem("filteredImageDataUrl");
        const name = sessionStorage.getItem("filteredImageFileName");
        const color = sessionStorage.getItem("toolColor");

        if (filtered && name) {
            setFilteredUrl(filtered);
            setFileName(name);
            if (color) {
                setBorderColor(color);
            }
        } else {
            router.replace("/photo/filters");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("filteredImageDataUrl");
        sessionStorage.removeItem("filteredImageFileName");
        sessionStorage.removeItem("toolColor");
        router.push("/photo/filters");
    }

    const handleDownload = () => {
        if (!filteredUrl) return;
        const link = document.createElement("a");
        link.href = filteredUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
            title: "Download Started",
            description: "Your filtered image is downloading.",
        });
    }

    if (loading || !filteredUrl) {
        return (
             <div className="flex flex-col h-full">
                <PageHeader title="Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <LoadingIndicator />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Result" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        <div className="relative w-full aspect-square border-2 border-dashed rounded-lg" style={{ borderColor }}>
            <Image src={filteredUrl} alt="Filtered Image" layout="fill" className="rounded-lg object-contain p-2" />
        </div>
        <div className="space-y-2">
            <Button className="w-full" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Filter Another
            </Button>
        </div>
      </div>
    </div>
  );
}
