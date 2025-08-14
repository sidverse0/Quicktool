"use client";

import { useState } from "react";
import Image from "next/image";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Minimize, Download, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ResizeSizePage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [targetSize, setTargetSize] = useState<number | string>(100); // Default 100KB
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

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
    setCompressedUrl(null);
    setCompressedSize(null);
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
    setCompressedUrl(null);
    setCompressedSize(null);

    const targetBytes = Number(targetSize) * 1024;
    
    const img = document.createElement('img');
    img.src = originalUrl;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);

        // Simple iterative quality reduction
        let quality = 0.9;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        let currentSize = dataUrl.length;

        const attemptCompression = (q: number) => {
            const dUrl = canvas.toDataURL('image/jpeg', q);
            return {
                url: dUrl,
                size: atob(dUrl.split(',')[1]).length
            };
        };

        let result = attemptCompression(quality);

        // Binary search for optimal quality would be better, but this is simpler
        while(result.size > targetBytes && quality > 0.1) {
            quality -= 0.1;
            result = attemptCompression(quality);
        }

        setCompressedUrl(result.url);
        setCompressedSize(result.size);
        setIsProcessing(false);
         toast({
            title: "Compression Complete",
            description: `Image compressed to ${formatFileSize(result.size)}.`,
        });
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
    setCompressedUrl(null);
    setCompressedSize(null);
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
    <div className="flex flex-col h-screen">
      <PageHeader title="Resize by File Size" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {!originalFile ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Minimize className="mr-2 h-5 w-5 text-primary" />
                Upload and Compress
              </CardTitle>
              <CardDescription>Reduce image file size while maintaining quality.</CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Compression Options</CardTitle>
                <CardDescription>Original size: {formatFileSize(originalSize)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Target Size (KB)</Label>
                  <Input id="size" type="number" placeholder="e.g., 200" value={targetSize} onChange={(e) => setTargetSize(Number(e.target.value))} />
                </div>
                <Button className="w-full" onClick={handleCompress} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    "Compress Image"
                  )}
                </Button>
              </CardContent>
            </Card>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">Original</h3>
                    {originalUrl && <Image src={originalUrl} alt="Original" width={512} height={512} className="rounded-lg object-contain w-full h-auto" />}
                    <p className="text-sm text-muted-foreground">Size: {formatFileSize(originalSize)}</p>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold">Compressed</h3>
                    {isProcessing && <div className="flex items-center justify-center h-full text-muted-foreground"><p>Compressing...</p></div>}
                    {compressedUrl && <Image src={compressedUrl} alt="Compressed" width={512} height={512} className="rounded-lg object-contain w-full h-auto" />}
                    {compressedUrl && <p className="text-sm text-muted-foreground">Size: {formatFileSize(compressedSize)}</p>}
                </div>
            </div>

            {compressedUrl && (
              <Card>
                <CardHeader>
                  <CardTitle>Download</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a href={compressedUrl} download={`compressed-${originalFile.name.split('.').slice(0,-1).join('.')}.jpg`}>
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" /> Download Compressed Image
                    </Button>
                  </a>
                   <Button variant="outline" className="w-full" onClick={handleReset}>
                      <RefreshCw className="mr-2 h-4 w-4" /> Compress Another
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
