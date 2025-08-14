"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, X } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { enhancePhoto } from "@/ai/flows/enhance-photo";
import { useToast } from "@/hooks/use-toast";

export default function EnhancePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const photoDataUri = event.target?.result as string;
      setOriginalPhoto(photoDataUri);
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "File Reading Error",
        description: "Could not read the selected file.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleEnhance = async () => {
    if (!originalPhoto) {
      toast({
        variant: "destructive",
        title: "No Image",
        description: "Please upload an image to enhance.",
      });
      return;
    }
    setIsProcessing(true);
    try {
      const result = await enhancePhoto({ photoDataUri: originalPhoto });
      sessionStorage.setItem("enhancedImageDataUrl", result.photoDataUri);
      sessionStorage.setItem("originalImageDataUrl", originalPhoto);
      router.push("/photo/enhance/result");
    } catch (error) {
      console.error("Photo enhancement failed:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Failed to enhance the photo. Please try another image.",
      });
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setOriginalPhoto(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Photo Auto Enhancer" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-4">
        {!originalPhoto ? (
          <Card className="shadow-none border-none">
            <CardContent className="p-0">
              <FileUploader onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                    <Image src={originalPhoto} alt="Original Preview" layout="fill" className="rounded-lg object-contain" />
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full z-10" onClick={handleReset}>
                    <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Button className="w-full" onClick={handleEnhance} disabled={isProcessing}>
            {isProcessing ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enhancing...</>
            ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Enhance Image</>
            )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
