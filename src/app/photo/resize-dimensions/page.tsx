
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ResizeDimensionsPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [width, setWidth] = useState<number | string>("");
  const [height, setHeight] = useState<number | string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      const url = e.target?.result as string;
      img.src = url;
      img.onload = () => {
        setOriginalUrl(url);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
      };
    };
    reader.readAsDataURL(file);
  };
  
  const handleResize = () => {
    if (!originalUrl || !width || !height || Number(width) <= 0 || Number(height) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Dimensions",
        description: "Please enter a valid width and height greater than zero.",
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
        canvas.width = Number(width);
        canvas.height = Number(height);
        ctx?.drawImage(img, 0, 0, Number(width), Number(height));
        const resizedDataUrl = canvas.toDataURL(originalFile?.type || "image/png");
        
        sessionStorage.setItem("resizedImageDataUrl", resizedDataUrl);
        sessionStorage.setItem("originalImageDataUrl", originalUrl);
        sessionStorage.setItem("resizedImageFileName", `resized-${originalFile?.name || 'image.png'}`);
        router.push('/photo/resize-dimensions/result');

      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not resize image. The dimensions may be too large.",
        });
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
        setIsProcessing(false);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load image for resizing.",
        });
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setWidth("");
    setHeight("");
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Resize by Dimensions" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {!originalUrl ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md shadow-none border-none">
              <CardContent className="p-0">
                <FileUploader onFileSelect={handleFileSelect} color="#5d87e8" />
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
                <CardContent className="p-0 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input id="width" type="number" placeholder="e.g., 1920" value={width} onChange={e => setWidth(e.target.value === '' ? '' : Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input id="height" type="number" placeholder="e.g., 1080" value={height} onChange={e => setHeight(e.target.value === '' ? '' : Number(e.target.value))} />
                    </div>
                    </div>
                    <Button className="w-full" onClick={handleResize} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resizing...</> : <><Maximize className="mr-2 h-4 w-4" />Resize Image</>}
                    </Button>
                </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
