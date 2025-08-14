"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Maximize, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResizeDimensionsPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [width, setWidth] = useState<number | string>("");
  const [height, setHeight] = useState<number | string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const originalImageRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setResizedUrl(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleImageLoad = () => {
      if (originalImageRef.current) {
          setWidth(originalImageRef.current.naturalWidth);
          setHeight(originalImageRef.current.naturalHeight);
      }
  };

  const handleResize = () => {
    if (!originalUrl || !width || !height) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please upload an image and specify both width and height.",
      });
      return;
    }
    
    setIsProcessing(true);
    setResizedUrl(null);

    const img = document.createElement("img");
    img.src = originalUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = Number(width);
      canvas.height = Number(height);
      ctx?.drawImage(img, 0, 0, Number(width), Number(height));
      const resizedDataUrl = canvas.toDataURL(originalFile?.type || "image/png");
      setResizedUrl(resizedDataUrl);
      setIsProcessing(false);
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
    setResizedUrl(null);
    setWidth("");
    setHeight("");
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="Resize by Dimensions" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {!originalFile ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Maximize className="mr-2 h-5 w-5 text-primary" />
                Upload an Image
              </CardTitle>
              <CardDescription>Select an image to resize.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resize Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input id="width" type="number" placeholder="e.g., 1920" value={width} onChange={e => setWidth(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input id="height" type="number" placeholder="e.g., 1080" value={height} onChange={e => setHeight(Number(e.target.value))} />
                    </div>
                </div>
                <Button className="w-full" onClick={handleResize} disabled={isProcessing}>
                  {isProcessing ? "Resizing..." : "Resize Image"}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">Original</h3>
                    {originalUrl && <Image ref={originalImageRef} src={originalUrl} alt="Original" width={512} height={512} className="rounded-lg object-contain w-full h-auto" onLoad={handleImageLoad} />}
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold">Resized</h3>
                    {isProcessing && <p>Processing...</p>}
                    {resizedUrl && <Image src={resizedUrl} alt="Resized" width={Number(width)} height={Number(height)} className="rounded-lg object-contain w-full h-auto" />}
                </div>
            </div>

            {resizedUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Download</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a href={resizedUrl} download={`resized-${originalFile.name}`}>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Download Resized Image
                    </Button>
                  </a>
                  <Button variant="outline" className="w-full" onClick={handleReset}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Resize Another
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
