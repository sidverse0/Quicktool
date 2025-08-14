
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ColorPickerDialog } from "@/components/color-picker-dialog";

const toolColor = "#7a5de8";

export default function QrMakerPage() {
  const [url, setUrl] = useState("https://firebase.google.com/");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "URL is empty",
        description: "Please enter a URL.",
      });
      return;
    }

    const params = new URLSearchParams({
        text: url,
        color,
        bgColor,
    });

    sessionStorage.setItem("toolColor", toolColor);
    router.push(`/qr/maker/result?${params.toString()}`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="URL to QR Code" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-4">
            <Label>Colors</Label>
            <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-2">
                     <ColorPickerDialog value={color} onChange={setColor}>
                        <button className="h-12 w-12 rounded-full border-2 border-muted" style={{ backgroundColor: color }} aria-label="Select dot color" />
                     </ColorPickerDialog>
                     <span className="text-xs">Dots</span>
                </div>
                 <div className="flex flex-col items-center gap-2">
                     <ColorPickerDialog value={bgColor} onChange={setBgColor}>
                        <button className="h-12 w-12 rounded-full border-2 border-muted" style={{ backgroundColor: bgColor }} aria-label="Select background color" />
                     </ColorPickerDialog>
                     <span className="text-xs">Background</span>
                </div>
            </div>
          </div>
           
           <div className="pt-4">
            <Button
              className="w-full"
              onClick={handleGenerate}
              style={{ backgroundColor: toolColor }}
            >
              <QrCode className="mr-2 h-4 w-4" />
              Generate QR Code
            </Button>
           </div>
      </div>
    </div>
  );
}
