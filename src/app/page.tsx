import {
  Image as ImageIcon,
  QrCode,
  ArrowRight,
  Maximize,
  Minimize,
  Sparkles,
  Scissors,
} from 'lucide-react';
import MainLayout from '@/components/layout/main-layout';
import ToolCard from '@/components/tool-card';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const photoTools = [
  {
    title: 'Photo Background Remover',
    description: 'Erase backgrounds with AI precision.',
    icon: <Scissors className="h-8 w-8 text-primary" />,
    href: '/photo/remove-background',
    color: 'bg-blue-100',
  },
  {
    title: 'Photo Resizer (Dimensions)',
    description: 'Adjust image width and height easily.',
    icon: <Maximize className="h-8 w-8 text-primary" />,
    href: '/photo/resize-dimensions',
    color: 'bg-green-100',
  },
  {
    title: 'Photo Resizer (File Size)',
    description: 'Shrink file size without losing quality.',
    icon: <Minimize className="h-8 w-8 text-primary" />,
    href: '/photo/resize-size',
    color: 'bg-yellow-100',
  },
  {
    title: 'Photo Auto Enhancer',
    description: 'Improve photos with a single click.',
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    href: '/photo/enhance',
    color: 'bg-purple-100',
  },
];

const qrTools = [
  {
    title: 'QR Code Maker',
    description: 'Generate QR codes for links, text & more.',
    icon: <QrCode className="h-8 w-8 text-primary" />,
    href: '/qr/maker',
    color: 'bg-red-100',
  },
];

export default function Home() {
  return (
    <MainLayout>
      <div className="p-4 md:p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold font-headline tracking-tight text-primary">
            AppSuite
          </h1>
          <p className="text-muted-foreground mt-1">
            Your all-in-one toolbox for photos, QR codes, and more.
          </p>
        </header>

        <section className="mb-8">
          <Card className="bg-primary/10 border-primary/20">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-headline text-xl font-semibold text-primary">
                  AI Photo Enhancer
                </h2>
                <p className="text-primary/80 mt-1">
                  Instantly improve your photos with a single click.
                </p>
              </div>
              <Link href="/photo/enhance">
                <Button>
                  Try Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold font-headline flex items-center">
              <ImageIcon className="mr-2 h-5 w-5 text-accent" /> Photo Tools
            </h2>
            <p className="text-muted-foreground">Everything you need for your images.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {photoTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6">
            <h2 className="text-xl font-bold font-headline flex items-center">
              <QrCode className="mr-2 h-5 w-5 text-accent" /> QR Tools
            </h2>
            <p className="text-muted-foreground">Generate and customize QR codes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {qrTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
