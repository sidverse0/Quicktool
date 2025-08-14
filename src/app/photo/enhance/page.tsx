import PageHeader from "@/components/layout/page-header";
import FileUploader from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function EnhancePage() {
  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="Photo Auto Enhancer" showBackButton />
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              Upload your photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUploader onFileSelect={() => {}} />
            <p className="text-sm text-center text-muted-foreground">
              This feature is currently under development.
            </p>
            <Button className="w-full" disabled>
              Enhance Photo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
