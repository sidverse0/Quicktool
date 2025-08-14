import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minimize } from "lucide-react";

export default function ResizeSizePage() {
  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="Resize by File Size" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Minimize className="mr-2 h-5 w-5 text-primary" />
              Upload and Compress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader onFileSelect={() => {}} />
            <div className="space-y-2">
              <Label htmlFor="size">Target Size (KB)</Label>
              <Input id="size" type="number" placeholder="e.g., 200" disabled/>
            </div>
            <p className="text-sm text-center text-muted-foreground">
              This feature is currently under development.
            </p>
            <Button className="w-full" disabled>
              Compress and Download
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
