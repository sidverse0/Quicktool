
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateImage } from "@/ai/flows/generate-qr-image";

const toolColor = "#5de8d4";

export default function AiImagePage() {
  const [prompt, setPrompt] = useState("A majestic lion in a grasslands");
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      toast({ variant: "destructive", title: "Prompt is empty" });
      return;
    }

    setIsProcessing(true);
    setImageUrl(null);
    try {
      const result = await generateImage(prompt);
      if (result) {
        setImageUrl(result);
      } else {
        toast({ variant: "destructive", title: "Image generation failed" });
      }
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "An error occurred", description: "Could not generate image." });
    }
    setIsProcessing(false);
  };

  const handleGenerateQrCode = () => {
    if (!imageUrl) return;

    const params = new URLSearchParams({
        text: imageUrl,
        color: '000000',
        bgColor: 'FFFFFF',
    });
    sessionStorage.setItem("toolColor", toolColor);
    router.push(`/qr/maker/result?${params.toString()}`);
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="AI Image to QR" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div className="space-y-2">
            <Label htmlFor="prompt">Image Prompt</Label>
            <Input id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A cat wearing a spacesuit" />
        </div>
        <Button className="w-full" onClick={handleGenerateImage} disabled={isProcessing}>
            {isProcessing && !imageUrl ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Generating Image...</> : <><Wand2 className="mr-2 h-4 w-4"/>Generate Image</>}
        </Button>
        
        <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-lg bg-secondary/50 min-h-[200px]">
            {isProcessing && !imageUrl && <Loader2 className="h-8 w-8 animate-spin text-primary"/>}
            {imageUrl && <Image src={imageUrl} alt="Generated AI Image" width={256} height={256} className="rounded-md object-contain"/>}
            {!isProcessing && !imageUrl && <p className="text-muted-foreground text-sm">Image will appear here</p>}
        </div>

        <Button className="w-full" onClick={handleGenerateQrCode} disabled={!imageUrl}>
            Generate QR Code for Image
        </Button>
      </div>
    </div>
  );
}
