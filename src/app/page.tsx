import {
  Image as ImageIcon,
  QrCode,
  ArrowRight,
  Maximize,
  Minimize,
  Sparkles,
  Scissors,
  Wand2,
} from 'lucide-react';
import MainLayout from '@/components/layout/main-layout';
import ToolCard from '@/components/tool-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const photoTools = [
  {
    title: 'Background Remover',
    description: 'Erase backgrounds with AI.',
    icon: <Scissors className="h-6 w-6 text-white" />,
    href: '/photo/remove-background',
    color: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Dimension Resizer',
    description: 'Adjust image width & height.',
    icon: <Maximize className="h-6 w-6 text-white" />,
    href: '/photo/resize-dimensions',
    color: 'from-green-500 to-green-600',
  },
  {
    title: 'File Size Resizer',
    description: 'Shrink file size easily.',
    icon: <Minimize className="h-6 w-6 text-white" />,
    href: '/photo/resize-size',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    title: 'Auto Enhancer',
    description: 'One-click photo improvement.',
    icon: <Sparkles className="h-6 w-6 text-white" />,
    href: '/photo/enhance',
    color: 'from-purple-500 to-purple-600',
  },
];

const qrTools = [
  {
    title: 'QR Code Maker',
    description: 'Generate custom QR codes.',
    icon: <QrCode className="h-6 w-6 text-white" />,
    href: '/qr/maker',
    color: 'from-red-500 to-red-600',
  },
];

export default function Home() {
  return (
    <MainLayout>
      <div className="p-4 md:p-6 space-y-8">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold font-headline tracking-tight text-primary">
            AppSuite
          </h1>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Your all-in-one toolbox for photos, QR codes, and more, powered by AI.
          </p>
        </header>

        <section className="bg-primary/10 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className='flex items-center gap-4'>
              <div className="bg-primary p-3 rounded-full">
                <Wand2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-headline text-xl font-semibold text-primary">
                  AI-Powered Tools
                </h2>
                <p className="text-primary/80 mt-1">
                  Enhance your images and create QR codes instantly.
                </p>
              </div>
            </div>
            <Link href="/photo">
              <Button>
                Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-headline flex items-center">
              <ImageIcon className="mr-3 h-6 w-6 text-accent" /> Photo Tools
            </h2>
            <p className="text-muted-foreground">Everything you need for your images.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photoTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-headline flex items-center">
              <QrCode className="mr-3 h-6 w-6 text-accent" /> QR Tools
            </h2>
            <p className="text-muted-foreground">Generate and customize QR codes.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {qrTools.map((tool) => (
              <ToolCard key={tool.href} {...tool} />
            ))}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
