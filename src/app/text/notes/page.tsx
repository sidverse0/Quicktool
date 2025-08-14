
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { useUserData } from "@/hooks/use-user-data";
import { UsageLimitDialog } from "@/components/usage-limit-dialog";

const toolName = "handwrittenNotes";
const toolColor = "#e8d55d";

export default function HandwrittenNotesPage() {
  const [text, setText] = useState("This is a sample note.\nYou can write multiple lines here.");
  const [inkColor, setInkColor] = useState("#1E40AF"); // A nice blue ink color
  const [fontSize, setFontSize] = useState(24);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { canUseTool, incrementToolUsage } = useUserData();
  const [showUsageLimitDialog, setShowUsageLimitDialog] = useState(false);

  const noteStyle: React.CSSProperties = {
    fontFamily: "'Kalam', cursive",
    fontSize: `${fontSize}px`,
    color: inkColor,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
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
            const tempDiv = document.createElement('div');
            tempDiv.style.fontFamily = "'Kalam', cursive";
            tempDiv.style.fontSize = `${fontSize}px`;
            tempDiv.style.lineHeight = '1.6';
            tempDiv.style.whiteSpace = 'pre-wrap';
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.padding = '20px';
            tempDiv.innerText = text;
            document.body.appendChild(tempDiv);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context not available");

            const dpr = window.devicePixelRatio || 1;
            canvas.width = tempDiv.offsetWidth * dpr;
            canvas.height = tempDiv.offsetHeight * dpr;
            
            ctx.scale(dpr, dpr);
            ctx.fillStyle = "#FFFFFF"; // White paper background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = `400 ${fontSize}px 'Kalam', cursive`;
            ctx.fillStyle = inkColor;
            ctx.textBaseline = 'top';

            const lines = text.split('\n');
            const lineHeight = fontSize * 1.6;
            const padding = 20;

            for (let i = 0; i < lines.length; i++) {
                ctx.fillText(lines[i], padding, padding + (i * lineHeight));
            }
            
            document.body.removeChild(tempDiv);

            const dataUrl = canvas.toDataURL("image/png");
            
            incrementToolUsage(toolName);
            sessionStorage.setItem("toolColor", toolColor);
            sessionStorage.setItem("noteImageDataUrl", dataUrl);
            router.push('/text/notes/result');
            
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Generation Failed",
                description: "Could not generate the note image.",
            });
        } finally {
            setIsProcessing(false);
        }
    }, 100);
  };


  return (
    <div className="flex flex-col h-full">
      <UsageLimitDialog isOpen={showUsageLimitDialog} onOpenChange={setShowUsageLimitDialog} />
      <PageHeader title="Hand-written Notes" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <div 
            className="flex-1 min-h-0 w-full p-5 bg-white rounded-lg border shadow-inner overflow-y-auto bg-[linear-gradient(to_bottom,transparent_29px,hsl(var(--primary))_30px),linear-gradient(to_right,transparent_29px,hsl(var(--primary))_30px)] bg-size-[30px_30px]"
            style={{ backgroundPosition: "-1px -1px", backgroundOrigin: "content-box", backgroundColor: "#fff" }}
        >
            <div style={noteStyle}>{text || "Start typing..."}</div>
        </div>
          
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="noteText">Text</Label>
                <Textarea 
                    id="noteText"
                    value={text} 
                    onChange={e => setText(e.target.value)} 
                    placeholder="Write your notes here..."
                    rows={3}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="color">Ink Color</Label>
                    <Input id="color" type="color" value={inkColor} onChange={e => setInkColor(e.target.value)} className="p-1 h-10 w-full" />
                </div>
                    <div className="space-y-2">
                    <Label>Font Size: {fontSize}px</Label>
                    <Slider value={[fontSize]} onValueChange={([val]) => setFontSize(val)} min={12} max={48} step={1} />
                </div>
            </div>
        </div>

        <Button className="w-full" onClick={handleGenerate} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Note"}
        </Button>

      </div>
    </div>
  );
}
