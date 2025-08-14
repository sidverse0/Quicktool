"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Droplet, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function WatermarkPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("Quick Tool");
  const [position, setPosition] = useState("center");
  const [opacity, setOpacity] = useState(50);
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(48);

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
  
  const handleWatermark = () => {
    if (!originalUrl || !originalFile) {
      toast({
        variant: "destructive",
        title: "No Image",
        description: "Please upload an image to add a watermark.",
      });
      return;
    }
    
    setIsProcessing(true);

    const img = document.createElement("img");
    img.src = originalUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Could not get canvas context");
        }
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);

        // Watermark styles
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = color;
        ctx.globalAlpha = opacity / 100;
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Position
        let x = canvas.width / 2;
        let y = canvas.height / 2;

        const margin = 20;

        switch (position) {
            case "top-left": x = margin; y = margin; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; break;
            case "top-center": y = margin; ctx.textBaseline = 'top'; break;
            case "top-right": x = canvas.width - margin; y = margin; ctx.textAlign = 'right'; ctx.textBaseline = 'top'; break;
            case "center-left": x = margin; ctx.textAlign = 'left'; break;
            case "center-right": x = canvas.width - margin; ctx.textAlign = 'right'; break;
            case "bottom-left": x = margin; y = canvas.height - margin; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom'; break;
            case "bottom-center": y = canvas.height - margin; ctx.textBaseline = 'bottom'; break;
            case "bottom-right": x = canvas.width - margin; y = canvas.height - margin; ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; break;
        }

        ctx.fillText(watermarkText, x, y);

        const watermarkedDataUrl = canvas.toDataURL(originalFile.type);
        
        sessionStorage.setItem("watermarkedImageDataUrl", watermarkedDataUrl);
        sessionStorage.setItem("watermarkedImageFileName", `watermarked-${originalFile.name}`);
        router.push('/photo/watermark/result');

      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not add watermark.",
        });
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
        setIsProcessing(false);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load image.",
        });
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Image Watermarker" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card className="w-full max-w-lg mx-auto">
          {!originalUrl ? (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Droplet className="mr-2 h-5 w-5 text-primary" />
                  Upload an Image
                </CardTitle>
                <CardDescription>Select an image to add a text watermark.</CardDescription>
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
                
                <div className="space-y-2">
                    <Label htmlFor="watermarkText">Watermark Text</Label>
                    <Input id="watermarkText" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} />
                </div>
                
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Position</Label>
                        <Select value={position} onValueChange={setPosition}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="top-left">Top Left</SelectItem>
                                <SelectItem value="top-center">Top Center</SelectItem>
                                <SelectItem value="top-right">Top Right</SelectItem>
                                <SelectItem value="center-left">Center Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="center-right">Center Right</SelectItem>
                                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                <SelectItem value="bottom-center">Bottom Center</SelectItem>
                                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="color">Text Color</Label>
                        <Input id="color" type="color" value={color} onChange={e => setColor(e.target.value)} className="p-1 h-10 w-full" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label>Font Size: {fontSize}px</Label>
                    <Slider value={[fontSize]} onValueChange={([val]) => setFontSize(val)} min={8} max={128} step={1} />
                </div>

                <div className="space-y-2">
                    <Label>Opacity: {opacity}%</Label>
                    <Slider value={[opacity]} onValueChange={([val]) => setOpacity(val)} min={0} max={100} step={1} />
                </div>


                <Button className="w-full" onClick={handleWatermark} disabled={isProcessing}>
                  {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</> : <><Droplet className="mr-2 h-4 w-4" />Add Watermark</>}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
