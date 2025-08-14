
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const toolColor = "#e85d87";

export default function TextToQrPage() {
  const [text, setText] = useState("Hello, World!");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Text is empty",
        description: "Please enter some text.",
      });
      return;
    }
    const params = new URLSearchParams({
        text,
        color,
        bgColor,
    });
    sessionStorage.setItem("toolColor", toolColor);
    router.push(`/qr/maker/result?${params.toString()}`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Text to QR Code" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-6">
          <Card className="shadow-none border-none">
            <CardContent className="space-y-4 p-0">
              <div className="space-y-2">
                <Label htmlFor="text">Your Text</Label>
                <Textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter any text here"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none border-none">
            <CardContent className="space-y-4 p-0">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Dot Color</Label>
                  <Input id="color" type="color" value={color} onChange={e => setColor(e.target.value)} className="p-1 h-10"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bgColor">Background Color</Label>
                  <Input id="bgColor" type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="p-1 h-10"/>
                </div>
              </div>
            </CardContent>
          </Card>
           <Card className="shadow-none border-none">
             <CardContent className="p-0">
                <Button
                  className="w-full"
                  onClick={handleGenerate}
                >
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
             </CardContent>
           </Card>
      </div>
    </div>
  );
}
