"use client";

import { useTheme } from "next-themes";
import MainLayout from "@/components/layout/main-layout";
import PageHeader from "@/components/layout/page-header";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Paintbrush, Languages, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <MainLayout>
        <PageHeader title="Settings" />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader title="Settings" />
      <div className="p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-base flex items-center">
                  {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                  Dark Mode
                </Label>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes.
                </p>
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
                <Paintbrush className="mr-2 h-4 w-4 text-muted-foreground" />
                Theme Color
            </CardTitle>
            <CardDescription>
              This feature is coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex gap-2">
                <Button variant="outline" className="h-8 w-8 rounded-full bg-primary" disabled />
                <Button variant="outline" className="h-8 w-8 rounded-full bg-red-500" disabled />
                <Button variant="outline" className="h-8 w-8 rounded-full bg-blue-500" disabled />
                <Button variant="outline" className="h-8 w-8 rounded-full bg-green-500" disabled />
             </div>
          </CardContent>
        </Card>

        <Card>
           <CardHeader>
            <CardTitle className="flex items-center">
                <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                Language
            </CardTitle>
            <CardDescription>
              This feature is coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex gap-2">
                <Button variant="secondary" disabled>English</Button>
                <Button variant="ghost" disabled>Hindi</Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
