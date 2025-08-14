"use client";

import { useTheme } from "next-themes";
import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
            <PageHeader title="Settings" showBackButton/>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
        <div className="flex flex-col h-full">
            <PageHeader title="Settings" showBackButton/>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
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
                        <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                        Language
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <p className="text-sm text-muted-foreground">Language selection is not yet available.</p>
                    </div>
                </CardContent>
                </Card>
            </div>
      </div>
    </MainLayout>
  );
}
