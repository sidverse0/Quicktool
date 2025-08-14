import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Maximize } from "lucide-react";

export default function ResizeDimensionsPage() {
  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="Resize by Dimensions" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Maximize className="mr-2 h-5 w-5 text-primary" />
              Upload and Resize
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader onFileSelect={() => {}} />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (px)</Label>
                <Input id="width" type="number" placeholder="e.g., 1920" disabled/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (px)</Label>
                <Input id="height" type="number" placeholder="e.g., 1080" disabled/>
              </div>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              This feature is currently under development.
            </p>
            <Button className="w-full" disabled>
              Resize and Download
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
