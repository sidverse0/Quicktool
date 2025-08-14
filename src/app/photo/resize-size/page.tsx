"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription
} from "@/components/ui/card";
import { Minimize, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function ResizeSizePage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [targetSize, setTargetSize] = useState<number | string>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
       toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please select an image file.",
      });
      return;
    }
    setOriginalFile(file);
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleCompress = async () => {
    if (!originalUrl || !targetSize || !originalFile) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please upload an image and specify a target size.",
        });
        return;
    }

    setIsProcessing(true);

    const targetBytes = Number(targetSize) * 1024;
    
    const img = document.createElement('img');
    img.src = originalUrl;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const qualityReductionStep = 0.05;
        let quality = 0.95;

        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        const attemptCompression = (q: number): { url: string; size: number } | null => {
            try {
                const dataUrl = canvas.toDataURL('image/jpeg', q);
                const size = atob(dataUrl.split(',')[1]).length;
                return { url: dataUrl, size };
            } catch (e) {
                return null;
            }
        };

        let result = attemptCompression(quality);
        while (result && result.size > targetBytes && quality > qualityReductionStep) {
            quality -= qualityReductionStep;
            result = attemptCompression(quality);
        }
        
        if (result) {
            sessionStorage.setItem("resizedImageDataUrl", result.url);
            sessionStorage.setItem("originalImageDataUrl", originalUrl);
            sessionStorage.setItem("resizedImageFileName", `resized-${originalFile.name || 'image.jpg'}`);
            router.push('/photo/resize-size/result');
        } else {
             toast({
                variant: "destructive",
                title: "Compression Failed",
                description: "Could not compress the image.",
            });
            setIsProcessing(false);
        }
    }
    img.onerror = () => {
        setIsProcessing(false);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load image for compression.",
        });
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setOriginalSize(null);
    setIsProcessing(false);
  };
  
  const formatFileSize = (bytes: number | null) => {
    if (bytes === null) return "N/A";
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Resize by File Size" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {!originalUrl ? (
          <div className="flex-1 flex items-center justify-center">
             <Card className="w-full max-w-md shadow-none border-none">
              <CardContent className="p-0">
                <FileUploader onFileSelect={handleFileSelect} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image src={originalUrl} alt="Original Preview" layout="fill" className="rounded-lg object-contain" />
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full z-10" onClick={handleReset}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Card className="shadow-none border-none">
                <CardContent className="p-0 space-y-4">
                    <CardDescription className="text-center">Original size: {formatFileSize(originalSize)}</CardDescription>

                    <div className="space-y-2">
                        <Label htmlFor="size">Target Size (KB)</Label>
                        <Input id="size" type="number" placeholder="e.g., 100" value={targetSize} onChange={(e) => setTargetSize(Number(e.target.value))} />
                    </div>
                    
                    <Button className="w-full" onClick={handleCompress} disabled={isProcessing}>
                        {isProcessing ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing...</>
                        ) : (
                        <><Minimize className="mr-2 h-4 w-4" />Compress Image</>
                        )}
                    </Button>
                </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
