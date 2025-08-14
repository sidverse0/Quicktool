"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2, X, FileImage, Download } from "lucide-react";
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

interface ConvertedImage {
  url: string;
  page: number;
}

export default function PdfToImagePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [imageType, setImageType] = useState<"jpeg" | "png">("png");
  const { toast } = useToast();

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
    setConvertedImages([]);
    handleConvert(file, "png"); // Automatically convert on select
  };

  const handleConvert = async (file: File | null, format: "jpeg" | "png") => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No PDF",
        description: "Please upload a PDF file to convert.",
      });
      return;
    }
    setIsProcessing(true);
    setConvertedImages([]);

    try {
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const typedarray = new Uint8Array(event.target?.result as ArrayBuffer);
        const pdf = await pdfjs.getDocument(typedarray).promise;
        const images: ConvertedImage[] = [];

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
              url: canvas.toDataURL(`image/${format}`),
              page: i,
            });
          }
        }
        setConvertedImages(images);
      };
      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("PDF conversion failed:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description:
          "Failed to convert the PDF. Please try a different file.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setPdfFile(null);
    setConvertedImages([]);
    setIsProcessing(false);
  };
  
  const handleFormatChange = (value: string) => {
    const format = value as "jpeg" | "png";
    setImageType(format);
    if(pdfFile) {
        handleConvert(pdfFile, format);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="PDF to Image Converter" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card className="w-full max-w-lg mx-auto">
          {!pdfFile ? (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileImage className="mr-2 h-5 w-5 text-primary" />
                  Upload your PDF
                </CardTitle>
                <CardDescription>
                  Convert each page of your PDF into an image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUploader
                  onFileSelect={handleFileSelect}
                  acceptedFileTypes="application/pdf"
                  label="Drag & drop a PDF here, or click to select"
                />
              </CardContent>
            </>
          ) : (
            <CardContent className="pt-6 space-y-4">
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
                <Select value={imageType} onValueChange={handleFormatChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select image format" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              
            </CardContent>
          )}
        </Card>

        {isProcessing && (
          <div className="text-center p-10">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Converting PDF...</p>
          </div>
        )}
        
        {convertedImages.length > 0 && (
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold text-center">Conversion Results</h2>
            {convertedImages.map(image => (
              <Card key={image.page}>
                <CardHeader>
                  <CardTitle>Page {image.page}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative w-full aspect-[8.5/11] border rounded-lg bg-white">
                     <Image src={image.url} alt={`Page ${image.page}`} layout="fill" className="object-contain p-2" />
                  </div>
                  <a href={image.url} download={`page-${image.page}.${imageType}`}>
                    <Button className="w-full">
                        <Download className="mr-2 h-4 w-4" /> Download Image
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
