
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Palette, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaletteGeneratorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleGeneratePalette = () => {
    if (!originalUrl || !originalFile) return;
    
    setIsProcessing(true);

    const img = document.createElement("img");
    img.src = originalUrl;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("Canvas not supported");
        
        const scale = Math.min(100 / img.width, 100 / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        const colorCounts: { [key: string]: number } = {};
        
        for (let i = 0; i < imageData.length; i += 4) {
            const r = Math.round(imageData[i] / 32) * 32;
            const g = Math.round(imageData[i + 1] / 32) * 32;
            const b = Math.round(imageData[i + 2] / 32) * 32;

            if (imageData[i+3] < 128) continue;
            
            const hex = `#${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`;
            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
        const palette = sortedColors.slice(0, 6);
        
        sessionStorage.setItem("paletteOriginalUrl", originalUrl);
        sessionStorage.setItem("paletteResult", JSON.stringify(palette));
        router.push('/photo/palette-generator/result');

      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate palette. The image might be from a restricted source.",
        });
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      setIsProcessing(false);
      toast({ variant: "destructive", title: "Error", description: "Could not load image." });
    }
  };

  const handleReset = () => {
    setOriginalUrl(null);
    setOriginalFile(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Color Palette Generator" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4 justify-center">
        {!originalUrl ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md shadow-none border-none">
                <CardContent className="p-0">
                    <FileUploader onFileSelect={handleFileSelect} color="#e8a05d" />
                </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="relative w-full h-full border-2 border-dashed rounded-lg">
                  <Image src={originalUrl} alt="Original" layout="fill" className="rounded-lg object-contain p-2" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full z-10" onClick={handleReset}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
            </div>
            <Card className="shadow-none border-none">
                <CardContent className="p-0">
                    <Button className="w-full" onClick={handleGeneratePalette} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Palette className="mr-2 h-4 w-4" />Generate Palette</>}
                    </Button>
                </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
