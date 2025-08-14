
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Maximize, Download, RefreshCw, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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
    if (!originalUrl || !width || !height || Number(width) <= 0 || Number(height) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Dimensions",
        description: "Please enter a valid width and height greater than zero.",
      });
      return;
    }
    
    setIsProcessing(true);
    setResizedUrl(null);

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
        setResizedUrl(resizedDataUrl);
      } catch (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not resize image. The dimensions may be too large.",
        });
      } finally {
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
    setResizedUrl(null);
    setWidth("");
    setHeight("");
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      <PageHeader title="Resize by Dimensions" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {!originalFile ? (
          <div className="flex items-center justify-center h-full">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                <CardTitle className="flex items-center">
                    <Maximize className="mr-2 h-5 w-5 text-primary" />
                    Upload an Image
                </CardTitle>
                <CardDescription>Select an image to resize to specific dimensions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FileUploader onFileSelect={handleFileSelect} />
                </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Original Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {originalUrl && <Image ref={originalImageRef} src={originalUrl} alt="Original" width={512} height={512} className="rounded-lg object-contain w-full h-auto border" onLoad={handleImageLoad} />}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Resize Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white" onClick={handleResize} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resizing...</> : <><Maximize className="mr-2"/>Resize Image</>}
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Resized Image</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center h-[calc(100%-80px)]">
                        {isProcessing && (
                            <div className="text-center space-y-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                                <p className="text-muted-foreground">Processing...</p>
                            </div>
                        )}
                        {resizedUrl && (
                            <Image src={resizedUrl} alt="Resized" width={Number(width)} height={Number(height)} className="rounded-lg object-contain w-full h-auto border" />
                        )}
                        {!isProcessing && !resizedUrl && (
                            <div className="text-center text-muted-foreground space-y-2">
                                <ImageIcon className="h-12 w-12 mx-auto"/>
                                <p>Your resized image will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

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
                        <Button variant="secondary" className="w-full" onClick={handleReset}>
                            <RefreshCw className="mr-2 h-4 w-4" /> Resize Another
                        </Button>
                    </CardContent>
                </Card>
                )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
