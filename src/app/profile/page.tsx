
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Image, LifeBuoy, User as UserIcon, Settings, Moon, Sun, Languages } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const stats = [
  {
    icon: <Image className="h-6 w-6 text-primary" />,
    label: "Photos Edited",
    value: "0",
  },
  {
    icon: <QrCode className="h-6 w-6 text-primary" />,
    label: "QRs Generated",
    value: "0",
  },
];

export default function ProfilePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
          <PageHeader title="Profile" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        <PageHeader title="Profile" />
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-primary to-accent">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src="https://i.postimg.cc/kXnSKfgf/wrench.png" alt="Quick Tool Logo" />
                  <AvatarFallback>
                    <UserIcon className="h-10 w-10 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <h2 className="text-2xl font-bold font-headline mt-4">Quick Tool</h2>
              <p className="text-muted-foreground">quicktool@sid.com</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="dark-mode" className="text-base flex items-center">
                    {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                    Dark Mode
                    </Label>
                </div>
                <Switch
                    id="dark-mode"
                    checked={theme === "dark"}
                    onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
                </div>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Languages className="mr-2 h-5 w-5 text-muted-foreground" />
                    Language
                </CardTitle>
                <CardDescription>Select your preferred language.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Button onClick={() => setLanguage('en')} variant={language === 'en' ? 'default' : 'outline'} className="w-full">English</Button>
                <Button onClick={() => setLanguage('hi')} variant={language === 'hi' ? 'default' : 'outline'} className="w-full">Hindi</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="p-4 bg-secondary rounded-lg flex flex-col items-center text-center"
                  >
                    {stat.icon}
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support</CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                  <LifeBuoy className="mr-2 h-4 w-4"/>
                  Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
