"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Loader2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ColorPalette = string[];

export default function PaletteResultPage() {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [palette, setPalette] = useState<ColorPalette | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        const url = sessionStorage.getItem("paletteOriginalUrl");
        const paletteStr = sessionStorage.getItem("paletteResult");

        if (url && paletteStr) {
            setOriginalUrl(url);
            setPalette(JSON.parse(paletteStr));
        } else {
            router.replace("/photo/palette-generator");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("paletteOriginalUrl");
        sessionStorage.removeItem("paletteResult");
        router.push("/photo/palette-generator");
    }

    const handleCopy = (color: string) => {
        navigator.clipboard.writeText(color);
        toast({ title: "Copied!", description: `${color} copied to clipboard.` });
    }

    if (loading || !originalUrl || !palette) {
        return (
             <div className="flex flex-col min-h-screen">
                <PageHeader title="Result" showBackButton />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </div>
        )
    }


  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Result" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="w-full max-w-lg mx-auto space-y-4">
            <Card>
                <CardHeader><CardTitle>Original Image</CardTitle></CardHeader>
                <CardContent>
                    <div className="relative w-full h-auto aspect-square border rounded-lg flex items-center justify-center bg-secondary/50">
                        <Image src={originalUrl} alt="Original Image" layout="fill" className="rounded-lg object-contain p-2" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Generated Palette</CardTitle></CardHeader>
                <CardContent>
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {palette.map(color => (
                            <div key={color} onClick={() => handleCopy(color)} className="cursor-pointer group">
                                <div style={{ backgroundColor: color }} className="h-20 w-full rounded-md border" />
                                <div className="flex items-center justify-between p-2 bg-muted rounded-b-md">
                                    <span className="font-mono text-sm">{color}</span>
                                    <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Generate Another
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
