"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Download, Loader2, AlertTriangle } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { enhancePhoto } from "@/ai/flows/enhance-photo";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

type Status = "idle" | "loading" | "success" | "error";

export default function EnhancePage() {
  const [status, setStatus] = useState<Status>("idle");
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [processedPhoto, setProcessedPhoto] = useState<string | null>(null);
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
          const result = await enhancePhoto({ photoDataUri });
          setProcessedPhoto(result.photoDataUri);
          setStatus("success");
        } catch (error) {
          console.error("Photo enhancement failed:", error);
          setStatus("error");
          toast({
            variant: "destructive",
            title: "An error occurred",
            description:
              "Failed to enhance the photo. Please try another image.",
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

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="Photo Auto Enhancer" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {status === "idle" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-primary" />
                Upload your photo
              </CardTitle>
              <CardDescription>
                Let our AI automatically improve your image quality.
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
              <CardHeader>
                <CardTitle>Original</CardTitle>
              </CardHeader>
              <CardContent>
                {originalPhoto && (
                  <Image
                    src={originalPhoto}
                    alt="Original"
                    width={512}
                    height={512}
                    className="rounded-lg object-contain w-full h-auto"
                  />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Enhancing...</CardTitle>
              </CardHeader>
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
                <h3 className="font-semibold mb-2">Enhanced</h3>
                <Image
                  src={processedPhoto}
                  alt="Enhanced image"
                  width={512}
                  height={512}
                  className="rounded-lg object-contain w-full h-auto"
                />
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Download</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <a href={processedPhoto} download="enhanced-photo.png">
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Enhanced Photo
                  </Button>
                </a>
                <Button
                  variant="secondary"
                  onClick={handleReset}
                  className="w-full"
                >
                  Enhance Another Photo
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
