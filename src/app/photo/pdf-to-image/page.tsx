"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X, FileImage, Download } from "lucide-react";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import * as pdfjs from "pdfjs-dist";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// Set worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfToImagePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageType, setImageType] = useState<"jpeg" | "png">("png");
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload a PDF file.",
      });
      return;
    }
    setPdfFile(file);
  };

  const handleConvert = async () => {
    if (!pdfFile) {
      toast({
        variant: "destructive",
        title: "No PDF",
        description: "Please upload a PDF file to convert.",
      });
      return;
    }
    setIsProcessing(true);

    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument(typedarray).promise;
        const images: { url: string; page: number }[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          if (context) {
            await page.render({ canvasContext: context, viewport: viewport })
              .promise;
            images.push({
              url: canvas.toDataURL(`image/${imageType}`),
              page: i,
            });
          }
        }
        sessionStorage.setItem("convertedImages", JSON.stringify(images));
        sessionStorage.setItem("imageType", imageType);
        router.push("/photo/pdf-to-image/result");
      };
      fileReader.readAsArrayBuffer(pdfFile);
    } catch (error) {
      console.error("PDF conversion failed:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Failed to convert the PDF. Please try a different file.",
      });
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setIsProcessing(false);
  };
  
  const handleFormatChange = (value: string) => {
    const format = value as "jpeg" | "png";
    setImageType(format);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="PDF to Image Converter" showBackButton />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-none border-none">
          {!pdfFile ? (
            <CardContent>
              <FileUploader
                onFileSelect={handleFileSelect}
                acceptedFileTypes="application/pdf"
                label="Drag & drop a PDF here, or click to select"
              />
            </CardContent>
          ) : (
            <CardContent className="space-y-4">
              <div className={cn(
                "relative w-full p-4 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-secondary/50",
                "transition-all duration-300 ease-in-out"
              )}>
                <FileImage className="h-16 w-16 text-primary" />
                <p className="mt-2 text-sm font-medium text-center">{pdfFile.name}</p>
                <p className="text-xs text-muted-foreground">{ (pdfFile.size / 1024).toFixed(2) } KB</p>

                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full z-10" onClick={handleReset}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                 <label className="text-sm font-medium">Image Format</label>
                <Select value={imageType} onValueChange={handleFormatChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select image format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="jpeg">JPG</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleConvert} disabled={isProcessing}>
                {isProcessing ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...</>
                ) : (
                  <>Convert to Image</>
                )}
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
