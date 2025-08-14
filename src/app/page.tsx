import { Wand2 } from 'lucide-react';
import MainLayout from '@/components/layout/main-layout';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-8rem)] p-4">
        <Wand2 className="h-24 w-24 text-primary animate-pulse" />
        <h1 className="mt-6 text-5xl font-bold font-headline tracking-tight text-primary">
          AppSuite
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          Your all-in-one toolbox for photos, QR codes, and more, powered by AI.
        </p>
      </div>
    </MainLayout>
  );
}
