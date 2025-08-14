"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text, Palette, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QrMakerPage() {
  const [text, setText] = useState("https://firebase.google.com/");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!text.trim()) {
      toast({
        variant: "destructive",
        title: "Input is empty",
        description: "Please enter some text or a URL.",
      });
      return;
    }
    const params = new URLSearchParams({
        text,
        color,
        bgColor,
    });
    router.push(`/qr/maker/result?${params.toString()}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader title="QR Code Maker" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Text className="mr-2 h-5 w-5 text-primary" />
                Enter Your Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="text">Text or URL</Label>
                <Input
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2 h-5 w-5 text-primary" />
                Customize Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
           <Card>
             <CardHeader>
                <CardTitle>Generate</CardTitle>
             </CardHeader>
             <CardContent>
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
