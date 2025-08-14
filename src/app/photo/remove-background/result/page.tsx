"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Download, RefreshCw, Loader2, Palette } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function RemoveBackgroundResultPage() {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [processedUrl, setProcessedUrl] = useState<string | null>(null);
    const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const original = sessionStorage.getItem("originalImageDataUrl");
        const processed = sessionStorage.getItem("processedImageDataUrl");

        if (processed && original) {
            setOriginalUrl(original);
            setProcessedUrl(processed);
        } else {
            router.replace("/photo/remove-background");
        }
        setLoading(false);
    }, [router]);

    const handleStartOver = () => {
        sessionStorage.removeItem("originalImageDataUrl");
        sessionStorage.removeItem("processedImageDataUrl");
        router.push("/photo/remove-background");
    };

    const downloadWithColor = () => {
      if (!processedUrl) return;
      const img = document.createElement('img');
      img.crossOrigin = "anonymous";
      img.src = processedUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const link = document.createElement('a');
          link.download = 'background-removed-colored.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        }
      }
    };

    if (loading || !processedUrl || !originalUrl) {
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card>
                  <CardHeader><CardTitle>Original</CardTitle></CardHeader>
                  <CardContent>
                      <div className="relative w-full h-auto aspect-square border rounded-lg flex items-center justify-center bg-secondary/50">
                          <Image src={originalUrl} alt="Original Image" layout="fill" className="rounded-lg object-contain p-2" />
                      </div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle>Processed</CardTitle></CardHeader>
                  <CardContent>
                      <div className="relative w-full h-auto aspect-square border rounded-lg flex items-center justify-center bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23F0F0F0%22/%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23F0F0F0%22/%3E%3C/svg%3E')]">
                          <Image src={processedUrl} alt="Processed Image" layout="fill" className="rounded-lg object-contain p-2" />
                      </div>
                  </CardContent>
              </Card>
            </div>

             <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <a href={processedUrl} download="background-removed.png">
                        <Button className="w-full">
                            <Download className="mr-2 h-4 w-4" /> Download (Transparent)
                        </Button>
                    </a>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Palette className="mr-2 h-4 w-4" />
                          Download with Color
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Choose Background Color</DialogTitle>
                        </DialogHeader>
                        <div className="flex items-center gap-4">
                          <label htmlFor="color-picker">Color:</label>
                          <Input
                            id="color-picker"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-16 h-10 p-1"
                          />
                          <span>{backgroundColor}</span>
                        </div>
                        <Button onClick={downloadWithColor}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="secondary" className="w-full" onClick={handleStartOver}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Process Another
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
