
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Pipette } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const toolName = "handwrittenNotes";
const toolColor = "#e8d55d";

const fontOptions = [
    { value: "'Kalam', cursive", label: "Kalam" },
    { value: "'Great Vibes', cursive", label: "Great Vibes" },
    { value: "'Parisienne', cursive", label: "Parisienne" },
    { value: "'Sacramento', cursive", label: "Sacramento" },
    { value: "'Dancing Script', cursive", label: "Dancing Script" },
    { value: "'Pacifico', cursive", label: "Pacifico" },
];

export default function HandwrittenNotesPage() {
  const [text, setText] = useState("This is a sample note.\nYou can write multiple lines here.");
  const [inkColor, setInkColor] = useState("#1E40AF");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [showLines, setShowLines] = useState(true);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState(fontOptions[0].value);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { canUseTool, incrementToolUsage } = useUserData();
  const [showUsageLimitDialog, setShowUsageLimitDialog] = useState(false);

  const noteStyle: React.CSSProperties = {
    fontFamily: fontFamily,
    fontSize: `${fontSize}px`,
    color: inkColor,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    backgroundColor: bgColor,
    backgroundSize: showLines ? `auto ${fontSize * 1.6}px` : undefined,
    backgroundImage: showLines ? `linear-gradient(to bottom, transparent ${fontSize * 1.6 - 1}px, #aab5f1 1px)` : undefined,
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
            const padding = 20;
            const lineHeight = fontSize * 1.6;

            const tempDiv = document.createElement('div');
            tempDiv.style.fontFamily = fontFamily;
            tempDiv.style.fontSize = `${fontSize}px`;
            tempDiv.style.lineHeight = `${lineHeight}px`;
            tempDiv.style.whiteSpace = 'pre-wrap';
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.padding = `${padding}px`;
            tempDiv.innerText = text;
            document.body.appendChild(tempDiv);
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context not available");

            const dpr = window.devicePixelRatio || 1;
            canvas.width = (tempDiv.offsetWidth) * dpr;
            canvas.height = (tempDiv.offsetHeight) * dpr;
            
            ctx.scale(dpr, dpr);
            
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width/dpr, canvas.height/dpr);
            
            const lines = text.split('\n');

            if (showLines) {
                ctx.strokeStyle = '#aab5f1';
                ctx.lineWidth = 1;
                for (let i = 0; i < lines.length; i++) {
                    const y = padding + (i * lineHeight) + (fontSize * 1.2);
                    if (y < canvas.height/dpr - padding/2) {
                        ctx.beginPath();
                        ctx.moveTo(padding, y);
                        ctx.lineTo(canvas.width/dpr - padding, y);
                        ctx.stroke();
                    }
                }
            }

            ctx.font = `400 ${fontSize}px ${fontFamily.split(',')[0]}`;
            ctx.fillStyle = inkColor;
            ctx.textBaseline = 'top';

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
            console.error(error);
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
            className="flex-1 min-h-[200px] w-full p-5 rounded-lg border shadow-inner overflow-y-auto"
            style={noteStyle}
        >
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

            <div className="space-y-2">
              <Label>Font Style</Label>
              <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger>
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

            <div className="grid grid-cols-2 gap-4 items-end">
                <div className="space-y-2">
                    <Label>Font Size: {fontSize}px</Label>
                    <Slider value={[fontSize]} onValueChange={([val]) => setFontSize(val)} min={12} max={48} step={1} />
                </div>
                 <div className="flex items-center space-x-2">
                    <Switch id="show-lines" checked={showLines} onCheckedChange={setShowLines} />
                    <Label htmlFor="show-lines">Show Lines</Label>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2 flex flex-col items-center">
                    <Label>Ink Color</Label>
                    <ColorPickerDialog value={inkColor} onChange={setInkColor}>
                        <button className="h-10 w-10 rounded-full border-2 border-muted" style={{ backgroundColor: inkColor }} aria-label="Select ink color" />
                    </ColorPickerDialog>
                </div>
                <div className="space-y-2 flex flex-col items-center">
                    <Label>Paper Color</Label>
                    <ColorPickerDialog value={bgColor} onChange={setBgColor}>
                        <button className="h-10 w-10 rounded-full border-2 border-muted" style={{ backgroundColor: bgColor }} aria-label="Select background color" />
                    </ColorPickerDialog>
                </div>
            </div>
        </div>

        <Button className="w-full mt-4" onClick={handleGenerate} disabled={isProcessing}>
            {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Generate Note"}
        </Button>

      </div>
    </div>
  );
}
