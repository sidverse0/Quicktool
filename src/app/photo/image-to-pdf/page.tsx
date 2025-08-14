
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, X, ImageUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';

const toolColor = "#e88d5d";

export default function ImageToPdfPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
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
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleConvert = () => {
    if (!originalUrl || !originalFile) return;
    
    setIsProcessing(true);

    const img = document.createElement("img");
    img.src = originalUrl;
    img.onload = () => {
      try {
        const doc = new jsPDF();
        const imgWidth = img.width;
        const imgHeight = img.height;
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        
        const newImgWidth = imgWidth * ratio;
        const newImgHeight = imgHeight * ratio;

        const x = (pdfWidth - newImgWidth) / 2;
        const y = (pdfHeight - newImgHeight) / 2;

        doc.addImage(originalUrl, 'PNG', x, y, newImgWidth, newImgHeight);
        
        const pdfDataUrl = doc.output('datauristring');
        
        sessionStorage.setItem("toolColor", toolColor);
        sessionStorage.setItem("pdfDataUrl", pdfDataUrl);
        sessionStorage.setItem("pdfFileName", `${originalFile.name.split('.')[0]}.pdf`);
        router.push('/photo/image-to-pdf/result');

      } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not convert image to PDF.",
        });
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      setIsProcessing(false);
      toast({ variant: "destructive", title: "Error", description: "Could not load image." });
    }
  };

  const handleReset = () => {
    setOriginalUrl(null);
    setOriginalFile(null);
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Image to PDF" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4 justify-center">
        {!originalUrl ? (
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
                <div className="relative w-full h-full border-2 border-dashed rounded-lg" style={{ borderColor: toolColor }}>
                  <Image src={originalUrl} alt="Original" layout="fill" className="rounded-lg object-contain p-2" />
                  <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full z-10" onClick={handleReset}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
            </div>
            <Card className="shadow-none border-none">
                <CardContent className="p-0">
                    <Button className="w-full" onClick={handleConvert} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...</> : <><ImageUp className="mr-2 h-4 w-4" />Convert to PDF</>}
                    </Button>
                </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
