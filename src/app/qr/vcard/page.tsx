
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSquare, Upload, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ColorPickerDialog } from "@/components/color-picker-dialog";
import Image from "next/image";

const toolColor = "#de5de8";

export default function VCardPage() {
  const [name, setName] = useState("John Doe");
  const [phone, setPhone] = useState("123-456-7890");
  const [email, setEmail] = useState("john.doe@example.com");
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          if (file.size > 1 * 1024 * 1024) { // 1MB limit
            toast({ variant: 'destructive', title: "Logo is too large!", description: "Please choose a file smaller than 1MB." });
            return;
          }
          setLogo(file);
          setLogoUrl(URL.createObjectURL(file));
      }
  }

  const handleGenerate = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${name}
FN:${name}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
END:VCARD`;

    const processAndNavigate = (logoDataUrl: string | null) => {
        const params = new URLSearchParams({
            text: vCard,
            color,
            bgColor,
        });

        sessionStorage.setItem("toolColor", toolColor);
        if (logoDataUrl) {
            sessionStorage.setItem("qrLogo", logoDataUrl);
        } else {
            sessionStorage.removeItem("qrLogo");
        }
        router.push(`/qr/maker/result?${params.toString()}`);
    };

    if (logo) {
        const reader = new FileReader();
        reader.onload = (e) => {
            processAndNavigate(e.target?.result as string);
        };
        reader.readAsDataURL(logo);
    } else {
        processAndNavigate(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="vCard QR Code" showBackButton />
      <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
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

          <div className="space-y-2">
            <Label>Logo (optional)</Label>
            <div className="flex items-center gap-4">
                <input type="file" accept="image/png, image/jpeg, image/svg+xml" ref={fileInputRef} onChange={handleLogoSelect} className="hidden" />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4"/>
                    {logo ? "Change Logo" : "Upload Logo"}
                </Button>
                 {logoUrl && (
                  <div className="relative h-10 w-10">
                    <Image src={logoUrl} alt="Logo preview" className="rounded-md object-cover" layout="fill" />
                  </div>
                )}
            </div>
          </div>

           <div className="pt-4">
            <Button
              className="w-full"
              onClick={handleGenerate}
              style={{ backgroundColor: toolColor }}
            >
              <UserSquare className="mr-2 h-4 w-4" />
              Generate vCard QR
            </Button>
           </div>
      </div>
    </div>
  );
}
