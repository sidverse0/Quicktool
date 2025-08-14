"use client";

import { useState } from "react";
import Image from "next/image";
import { Scissors, Download, Loader2, AlertTriangle, Palette } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { removePhotoBackground } from "@/ai/flows/remove-photo-background";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Status = "idle" | "loading" | "success" | "error";

export default function RemoveBackgroundPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [processedPhoto, setProcessedPhoto] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const photoDataUri = event.target?.result as string;
      if (photoDataUri) {
        setOriginalPhoto(photoDataUri);
        setStatus("loading");
        setProcessedPhoto(null);
        try {
          const result = await removePhotoBackground({ photoDataUri });
          setProcessedPhoto(result.photoDataUri);
          setStatus("success");
        } catch (error) {
          console.error("Background removal failed:", error);
          setStatus("error");
          toast({
            variant: "destructive",
            title: "An error occurred",
            description: "Failed to remove background. Please try another image.",
          });
        }
      }
    };
    reader.onerror = () => {
      setStatus("error");
      toast({
        variant: "destructive",
        title: "File Reading Error",
        description: "Could not read the selected file.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setStatus("idle");
    setOriginalPhoto(null);
    setProcessedPhoto(null);
  };

  const downloadWithColor = () => {
    if (!processedPhoto) return;
    const img = document.createElement('img');
    img.crossOrigin = "anonymous";
    img.src = processedPhoto;
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
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Background Remover" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {status === "idle" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scissors className="mr-2 h-5 w-5 text-primary" />
                Upload an Image
              </CardTitle>
              <CardDescription>
                Our AI will automatically remove the background for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>
        )}

        {status === "loading" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Original</CardTitle></CardHeader>
              <CardContent>
                {originalPhoto && <Image src={originalPhoto} alt="Original" width={512} height={512} className="rounded-lg object-contain w-full h-auto" />}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Processing...</CardTitle></CardHeader>
              <CardContent className="flex flex-col items-center justify-center space-y-4">
                <Skeleton className="w-full h-64 md:h-96" />
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">AI is working its magic...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {status === "error" && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Processing Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>We couldn't process your image. Please try a different one.</p>
              <Button onClick={handleReset}>Try Again</Button>
            </CardContent>
          </Card>
        )}

        {status === "success" && processedPhoto && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold mb-2">Original</h3>
                <Image
                  src={originalPhoto!}
                  alt="Original image"
                  width={512}
                  height={512}
                  className="rounded-lg object-contain w-full h-auto"
                />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Background Removed</h3>
                <div className="bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Crect%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23F0F0F0%22/%3E%3Crect%20x%3D%2210%22%20y%3D%2210%22%20width%3D%2210%22%20height%3D%2210%22%20fill%3D%22%23F0F0F0%22/%3E%3C/svg%3E')] rounded-lg">
                   <Image
                    src={processedPhoto}
                    alt="Image with background removed"
                    width={512}
                    height={512}
                    className="rounded-lg object-contain w-full h-auto"
                  />
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Download Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href={processedPhoto} download="background-removed.png">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download as PNG (Transparent)
                  </Button>
                </a>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Palette className="mr-2 h-4 w-4" />
                      Download with Color Background
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

                <Button variant="secondary" onClick={handleReset} className="w-full">
                  Process Another Image
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
