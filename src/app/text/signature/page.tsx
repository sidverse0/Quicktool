
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { useUserData } from "@/hooks/use-user-data";
import { UsageLimitDialog } from "@/components/usage-limit-dialog";
import { ColorPickerDialog } from "@/components/color-picker-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const toolName = "calligraphySignature";
const toolColor = "#5de8e2";

const fontOptions = [
    { value: "'Great Vibes', cursive", label: "Great Vibes" },
    { value: "'Parisienne', cursive", label: "Parisienne" },
    { value: "'Sacramento', cursive", label: "Sacramento" },
    { value: "'Dancing Script', cursive", label: "Dancing Script" },
    { value: "'Pacifico', cursive", label: "Pacifico" },
];

export default function SignaturePage() {
  const [text, setText] = useState("Your Name");
  const [color, setColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(64);
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { canUseTool, incrementToolUsage } = useUserData();
  const [showUsageLimitDialog, setShowUsageLimitDialog] = useState(false);

  const signatureStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    color: color,
    whiteSpace: 'nowrap',
  };
  
  const handleGenerate = () => {
    if (!text) {
        toast({ variant: "destructive", title: "Text is empty!" });
        return;
    }

    if (!canUseTool(toolName)) {
      setShowUsageLimitDialog(true);
      return;
    }
    
    setIsProcessing(true);

    setTimeout(() => {
        try {
            const tempSpan = document.createElement('span');
            tempSpan.style.fontFamily = fontFamily;
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
            
            ctx.font = `${fontSize}px ${fontFamily}`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            ctx.fillText(text, canvas.width / (2*dpr), canvas.height / (2*dpr));
            
            document.body.removeChild(tempSpan);

            const dataUrl = canvas.toDataURL("image/png");

            incrementToolUsage(toolName);
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
      <UsageLimitDialog isOpen={showUsageLimitDialog} onOpenChange={setShowUsageLimitDialog} />
      <PageHeader title="Calligraphy Signature" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div className="flex-1 flex items-center justify-center bg-secondary rounded-lg">
            <span style={signatureStyle}>{text || "Your Name"}</span>
        </div>
          
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="signatureText">Text</Label>
                    <Input id="signatureText" value={text} onChange={e => setText(e.target.value)} placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="fontStyle">Font Style</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger id="fontStyle">
                            <SelectValue placeholder="Select a font" />
                        </SelectTrigger>
                        <SelectContent>
                            {fontOptions.map(font => (
                                <SelectItem key={font.value} value={font.value}>
                                    <span style={{fontFamily: font.value}}>{font.label}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 flex flex-col items-center">
                    <Label>Color</Label>
                    <ColorPickerDialog value={color} onChange={setColor}>
                        <button className="h-10 w-10 rounded-full border-2 border-muted" style={{ backgroundColor: color }} aria-label="Select color" />
                    </ColorPickerDialog>
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
