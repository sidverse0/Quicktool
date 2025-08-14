
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

type Filters = {
  grayscale: number;
  brightness: number;
  contrast: number;
  sepia: number;
  invert: number;
};

export default function FiltersPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    grayscale: 0,
    brightness: 100,
    contrast: 100,
    sepia: 0,
    invert: 0,
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleApply = () => {
    if (!originalUrl || !originalFile) {
      toast({ variant: "destructive", title: "No Image" });
      return;
    }
    
    setIsProcessing(true);

    setTimeout(() => {
        try {
            const img = document.createElement("img");
            img.src = originalUrl;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if(!ctx) { throw new Error("No context"); }
                
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                ctx.filter = `grayscale(${filters.grayscale}%) brightness(${filters.brightness}%) contrast(${filters.contrast}%) sepia(${filters.sepia}%) invert(${filters.invert}%)`;
                ctx.drawImage(img, 0, 0);

                const filteredDataUrl = canvas.toDataURL(originalFile.type);
                
                sessionStorage.setItem("filteredImageDataUrl", filteredDataUrl);
                sessionStorage.setItem("filteredImageFileName", `filtered-${originalFile.name}`);
                router.push('/photo/filters/result');
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not apply filters.",
            });
            setIsProcessing(false);
        }
    }, 100);
  };
  
  const getFilterStyle = () => {
    return { 
        filter: `grayscale(${filters.grayscale}%) brightness(${filters.brightness}%) contrast(${filters.contrast}%) sepia(${filters.sepia}%) invert(${filters.invert}%)`
    };
  }

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl(null);
    setIsProcessing(false);
  };
  
  const resetFilters = () => {
      setFilters({
          grayscale: 0,
          brightness: 100,
          contrast: 100,
          sepia: 0,
          invert: 0,
      });
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Image Filters" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {!originalUrl ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md shadow-none border-none">
              <CardContent className="p-0">
                <FileUploader onFileSelect={handleFileSelect} color="#e85dd5" />
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 flex items-center justify-center">
                <div className="relative w-full h-full border-2 border-dashed rounded-lg">
                    <Image src={originalUrl} alt="Original" layout="fill" className="rounded-lg object-contain p-2" style={getFilterStyle()}/>
                    <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7 rounded-full z-10" onClick={handleReset}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="space-y-4 overflow-y-auto">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Grayscale: {filters.grayscale}%</Label>
                        <Slider value={[filters.grayscale]} onValueChange={([val]) => setFilters(f => ({...f, grayscale: val}))} max={100} />
                    </div>
                    <div className="space-y-2">
                        <Label>Brightness: {filters.brightness}%</Label>
                        <Slider value={[filters.brightness]} onValueChange={([val]) => setFilters(f => ({...f, brightness: val}))} max={200} />
                    </div>
                    <div className="space-y-2">
                        <Label>Contrast: {filters.contrast}%</Label>
                        <Slider value={[filters.contrast]} onValueChange={([val]) => setFilters(f => ({...f, contrast: val}))} max={200} />
                    </div>
                    <div className="space-y-2">
                        <Label>Sepia: {filters.sepia}%</Label>
                        <Slider value={[filters.sepia]} onValueChange={([val]) => setFilters(f => ({...f, sepia: val}))} max={100} />
                    </div>
                    <div className="space-y-2">
                        <Label>Invert: {filters.invert}%</Label>
                        <Slider value={[filters.invert]} onValueChange={([val]) => setFilters(f => ({...f, invert: val}))} max={100} />
                    </div>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button variant="secondary" className="w-full" onClick={resetFilters}>Reset Filters</Button>
                    <Button className="w-full" onClick={handleApply} disabled={isProcessing}>
                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</> : <>Apply & Continue</>}
                    </Button>
                </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
