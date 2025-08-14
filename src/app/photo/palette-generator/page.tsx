"use client";

import { useState } from "react";
import Image from "next/image";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Palette, Loader2, X, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type ColorPalette = string[];

export default function PaletteGeneratorPage() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<ColorPalette | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalUrl(e.target?.result as string);
      setPalette(null); // Reset palette on new image
    };
    reader.readAsDataURL(file);
  };
  
  const handleGeneratePalette = () => {
    if (!originalUrl) return;
    
    setIsProcessing(true);
    setPalette(null);

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
            // Quantize colors to reduce the number of unique colors
            const r = Math.round(imageData[i] / 32) * 32;
            const g = Math.round(imageData[i + 1] / 32) * 32;
            const b = Math.round(imageData[i + 2] / 32) * 32;

            if (imageData[i+3] < 128) continue; // ignore transparent pixels
            
            const hex = `#${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`;
            colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }

        const sortedColors = Object.keys(colorCounts).sort((a, b) => colorCounts[b] - colorCounts[a]);
        setPalette(sortedColors.slice(0, 6));

      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate palette. The image might be from a restricted source.",
        });
      } finally {
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
    setPalette(null);
    setIsProcessing(false);
  };
  
  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    toast({ title: "Copied!", description: `${color} copied to clipboard.` });
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Color Palette Generator" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card className="w-full max-w-lg mx-auto">
          {!originalUrl ? (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="mr-2 h-5 w-5 text-primary" />
                  Upload an Image
                </CardTitle>
                <CardDescription>Extract a color palette from any image.</CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader onFileSelect={handleFileSelect} />
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className={cn(
                    "relative w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center bg-secondary/50",
                    "transition-all duration-300 ease-in-out"
                  )}>
                  <Image src={originalUrl} alt="Original" layout="fill" className="rounded-lg object-contain p-2" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full z-10" onClick={handleReset}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Button className="w-full" onClick={handleGeneratePalette} disabled={isProcessing}>
                  {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Palette className="mr-2 h-4 w-4" />Generate Palette</>}
                </Button>
                
                {palette && (
                    <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-2 text-center">Generated Palette</h3>
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
                    </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
