
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const toolColor = "#5de8d4";

export default function ImageToQrPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
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
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleGenerateQrCode = () => {
    if (!imageUrl) {
        toast({
            variant: "destructive",
            title: "No Image",
            description: "Please select an image to generate a QR code.",
        });
        return;
    }
    setIsProcessing(true);
    
    // The image data URL can be very long, which might create a QR code
    // that is too dense to be scanned by some readers. This is a limitation
    // of storing image data directly in a QR code.
    sessionStorage.setItem("qrImageDataUrl", imageUrl);
    sessionStorage.setItem("toolColor", toolColor);
    router.push(`/qr/maker/result`);
  };

  const handleReset = () => {
    setImageFile(null);
    setImageUrl(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Image to QR Code" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4 justify-center">
        {!imageUrl ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md shadow-none border-none">
                <CardContent className="p-0">
                    <FileUploader onFileSelect={handleFileSelect} color={toolColor} />
                </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="relative w-full h-full border-2 border-dashed rounded-lg">
                  <Image src={imageUrl} alt="Selected" layout="fill" className="rounded-lg object-contain p-2" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full z-10" onClick={handleReset}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
            </div>
            <Card className="shadow-none border-none">
                <CardContent className="p-0">
                    <Button className="w-full" onClick={handleGenerateQrCode} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><QrCode className="mr-2 h-4 w-4" />Generate QR Code</>}
                    </Button>
                </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
