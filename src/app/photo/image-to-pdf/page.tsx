
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, X, ImageUp, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from 'jspdf';
import { cn } from "@/lib/utils";

const toolColor = "#e88d5d";

interface ImageFile {
    file: File;
    url: string;
}

export default function ImageToPdfPage() {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) {
        toast({
            variant: "destructive",
            title: "Invalid File",
            description: "Please select an image file.",
        });
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const newImageFile: ImageFile = { file, url: e.target?.result as string };
        setImageFiles(prev => [...prev, newImageFile]);
    };
    reader.readAsDataURL(file);
  };
  
  const handleAdditionalFileSelect = (files: FileList | null) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
        handleFileSelect(files[i]);
    }
  }

  const handleConvert = () => {
    if (imageFiles.length === 0) {
        toast({
            variant: "destructive",
            title: "No Images",
            description: "Please select at least one image to convert.",
        });
        return;
    };
    
    setIsProcessing(true);

    (async () => {
      try {
        const doc = new jsPDF();
        for (let i = 0; i < imageFiles.length; i++) {
          if (i > 0) {
            doc.addPage();
          }
          const imgData = imageFiles[i].url;
          const img = new (window as any).Image();
          img.src = imgData;

          await new Promise<void>((resolve) => {
            img.onload = () => {
              const imgWidth = img.width;
              const imgHeight = img.height;
              const pdfWidth = doc.internal.pageSize.getWidth();
              const pdfHeight = doc.internal.pageSize.getHeight();
              
              const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
              
              const newImgWidth = imgWidth * ratio;
              const newImgHeight = imgHeight * ratio;

              const x = (pdfWidth - newImgWidth) / 2;
              const y = (pdfHeight - newImgHeight) / 2;

              doc.addImage(imgData, imageFiles[i].file.type.split('/')[1].toUpperCase(), x, y, newImgWidth, newImgHeight);
              resolve();
            }
          });
        }
        
        const pdfDataUrl = doc.output('datauristring');
        
        sessionStorage.setItem("toolColor", toolColor);
        sessionStorage.setItem("pdfDataUrl", pdfDataUrl);
        sessionStorage.setItem("pdfFileName", `converted.pdf`);
        router.push('/photo/image-to-pdf/result');
      } catch (error) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not convert images to PDF.",
        });
        setIsProcessing(false);
      }
    })();
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddMoreClick = () => {
      fileInputRef.current?.click();
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Image to PDF" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {imageFiles.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md shadow-none border-none">
                <CardContent className="p-0">
                    <FileUploader onFileSelect={handleFileSelect} color={toolColor} />
                </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 p-2 border-2 border-dashed rounded-lg" style={{ borderColor: toolColor }}>
                <div className="grid grid-cols-4 gap-2 overflow-y-auto h-full">
                    {imageFiles.map((imgFile, index) => (
                        <div key={index} className="relative aspect-square">
                            <Image src={imgFile.url} alt={`Preview ${index + 1}`} layout="fill" className="object-cover rounded-md" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 rounded-full z-10"
                                onClick={() => handleRemoveImage(index)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                     <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={(e) => handleAdditionalFileSelect(e.target.files)}
                        className="hidden"
                        accept="image/*"
                        multiple
                     />
                    <button 
                        onClick={handleAddMoreClick}
                        className="flex items-center justify-center aspect-square rounded-md border-2 border-dashed border-muted-foreground/50 hover:border-primary transition-colors group"
                    >
                        <Plus className="h-8 w-8 text-muted-foreground/50 group-hover:text-primary"/>
                    </button>
                </div>
            </div>
            <Card className="shadow-none border-none pt-2">
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
