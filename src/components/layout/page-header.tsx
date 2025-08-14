"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  showBackButton?: boolean;
  actions?: React.ReactNode;
};

export default function PageHeader({
  title,
  showBackButton = false,
  actions,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-14 items-center px-4 md:px-6">
        <div className="flex items-center">
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 h-8 w-8"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold font-headline">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {actions}
        </div>
      </div>
    </header>
  );
}
