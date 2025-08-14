
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2 } from "lucide-react";

export default function FilterResultPage() {
    const [filteredUrl, setFilteredUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState("filtered-image.png");
    const [loading, setLoading] = useState(true);
    const [borderColor, setBorderColor] = useState("hsl(var(--border))");
    const router = useRouter();

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

    if (loading || !filteredUrl) {
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
        <div className="relative w-full aspect-square border-2 border-dashed rounded-lg" style={{ borderColor }}>
            <Image src={filteredUrl} alt="Filtered Image" layout="fill" className="rounded-lg object-contain p-2" />
        </div>
        <div className="space-y-2">
            <a href={filteredUrl} download={fileName}>
                <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Download
                </Button>
            </a>
            <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                <RefreshCw className="mr-2 h-4 w-4" /> Filter Another
            </Button>
        </div>
      </div>
    </div>
  );
}
