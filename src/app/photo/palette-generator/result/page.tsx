
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ColorPalette = string[];

export default function PaletteResultPage() {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [palette, setPalette] = useState<ColorPalette | null>(null);
    const [loading, setLoading] = useState(true);
    const [borderColor, setBorderColor] = useState("hsl(var(--border))");
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const url = sessionStorage.getItem("paletteOriginalUrl");
        const paletteStr = sessionStorage.getItem("paletteResult");
        const color = sessionStorage.getItem("toolColor");

        if (url && paletteStr) {
            setOriginalUrl(url);
            setPalette(JSON.parse(paletteStr));
            if(color) {
                setBorderColor(color);
            }
        } else {
            router.replace("/photo/palette-generator");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("paletteOriginalUrl");
        sessionStorage.removeItem("paletteResult");
        sessionStorage.removeItem("toolColor");
        router.push("/photo/palette-generator");
    }

    const handleCopy = (color: string) => {
        navigator.clipboard.writeText(color);
        toast({ title: "Copied!", description: `${color} copied to clipboard.` });
    }

    if (loading || !originalUrl || !palette) {
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
            <Image src={originalUrl} alt="Original Image" layout="fill" className="rounded-lg object-contain p-2" />
        </div>

        <div className="grid grid-cols-6 gap-2 justify-center px-4">
        {palette.map(color => (
            <div key={color} onClick={() => handleCopy(color)} className="cursor-pointer group relative aspect-square">
                <div style={{ backgroundColor: color }} className="h-full w-full rounded-full border" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Copy className="h-5 w-5 text-white" />
                </div>
            </div>
        ))}
        </div>

        <Button variant="secondary" className="w-full" onClick={handleStartOver}>
            <RefreshCw className="mr-2 h-4 w-4" /> Generate Another
        </Button>
      </div>
    </div>
  );
}
