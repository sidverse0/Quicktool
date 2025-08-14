
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

const toolColor = "#5de8e2";

export default function SignaturePage() {
  const [text, setText] = useState("Your Name");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(64);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const signatureStyle: React.CSSProperties = {
    fontFamily: "'Great Vibes', cursive",
    fontSize: `${fontSize}px`,
    color: color,
    whiteSpace: 'nowrap',
  };
  
  const handleGenerate = () => {
    if (!text) {
        toast({ variant: "destructive", title: "Text is empty!" });
        return;
    }
    
    setIsProcessing(true);

    setTimeout(() => {
        try {
            const tempSpan = document.createElement('span');
            tempSpan.style.fontFamily = "'Great Vibes', cursive";
            tempSpan.style.fontSize = `${fontSize}px`;
            tempSpan.style.position = 'absolute';
            tempSpan.style.left = '-9999px';
            tempSpan.style.whiteSpace = 'nowrap';
            tempSpan.innerText = text;
            document.body.appendChild(tempSpan);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context not available");

            const dpr = window.devicePixelRatio || 1;
            canvas.width = (tempSpan.offsetWidth + 20) * dpr;
            canvas.height = (tempSpan.offsetHeight + 20) * dpr;
            
            ctx.scale(dpr, dpr);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = `${fontSize}px 'Great Vibes', cursive`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillText(text, canvas.width / (2*dpr), canvas.height / (2*dpr));
            
            document.body.removeChild(tempSpan);

            const dataUrl = canvas.toDataURL("image/png");
            sessionStorage.setItem("toolColor", toolColor);
            sessionStorage.setItem("signatureImageDataUrl", dataUrl);
            router.push('/text/signature/result');
            
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "Could not generate the signature image.",
            });
        } finally {
            setIsProcessing(false);
        }
    }, 100);
  };


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Calligraphy Signature" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div className="flex-1 flex items-center justify-center bg-secondary rounded-lg">
            <span style={signatureStyle}>{text || "Your Name"}</span>
        </div>
          
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="signatureText">Text</Label>
                <Input id="signatureText" value={text} onChange={e => setText(e.target.value)} placeholder="Enter your name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input id="color" type="color" value={color} onChange={e => setColor(e.target.value)} className="p-1 h-10 w-full" />
                </div>
                    <div className="space-y-2">
                    <Label>Font Size: {fontSize}px</Label>
                    <Slider value={[fontSize]} onValueChange={([val]) => setFontSize(val)} min={24} max={128} step={1} />
                </div>
            </div>
          
            <Button className="w-full" onClick={handleGenerate} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Signature"}
            </Button>
        </div>
      </div>
    </div>
  );
}
