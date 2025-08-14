
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { UserSquare } from "lucide-react";

const toolColor = "#de5de8";

export default function VCardPage() {
  const [name, setName] = useState("John Doe");
  const [phone, setPhone] = useState("123-456-7890");
  const [email, setEmail] = useState("john.doe@example.com");
  const router = useRouter();

  const handleGenerate = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
N:${name}
FN:${name}
TEL;TYPE=CELL:${phone}
EMAIL:${email}
END:VCARD`;

    const params = new URLSearchParams({
        text: vCard,
        color: '000000',
        bgColor: 'FFFFFF',
    });
    sessionStorage.setItem("toolColor", toolColor);
    router.push(`/qr/maker/result?${params.toString()}`);
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="vCard QR Code" showBackButton />
      <div className="flex-1 flex flex-col justify-center p-4 space-y-6">
          <Card className="shadow-none border-none">
            <CardContent className="space-y-4 p-0">
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
            </CardContent>
          </Card>
           <Card className="shadow-none border-none">
             <CardContent className="p-0">
                <Button
                  className="w-full"
                  onClick={handleGenerate}
                >
                  <UserSquare className="mr-2 h-4 w-4" />
                  Generate vCard QR
                </Button>
             </CardContent>
           </Card>
      </div>
    </div>
  );
}
