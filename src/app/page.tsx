import Image from 'next/image';
import MainLayout from '@/components/layout/main-layout';

export default function Home() {
  return (
    <MainLayout>
      <div className="flex flex-col h-full p-4">
        <div className="flex flex-col items-center justify-center text-center flex-grow">
          <div className="rounded-full overflow-hidden h-24 w-24 flex items-center justify-center bg-primary/10 mb-4 border-4 border-primary/20 shadow-lg">
            <Image src="https://i.postimg.cc/kXnSKfgf/wrench.png" alt="Quick Tool Logo" width={64} height={64} className="object-contain" />
          </div>
          <h1 className="mt-6 text-5xl font-bold font-headline tracking-tight text-primary">
            Quick Tool
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Your all-in-one toolbox for photos, QR codes, and more, powered by AI.
          </p>
        </div>
        <div className="text-center text-sm text-muted-foreground pb-4">
          <p>made with love ❤️</p>
        </div>
      </div>
    </MainLayout>
  );
}
