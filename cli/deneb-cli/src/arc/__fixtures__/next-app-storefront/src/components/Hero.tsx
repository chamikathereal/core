import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Hero() {
  const badge = 'New Season 2026';

  return (
    <section className="relative grid gap-12 px-6 pt-20 md:grid-cols-2 md:items-center">
      <div className="flex flex-col gap-6">
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-widest">
          {badge}
        </span>
        <h1 className="text-5xl font-semibold leading-tight tracking-tight">
          Engineered for modern living
        </h1>
        <p className="max-w-md text-lg text-slate-600">
          Discover a minimalist collection crafted from premium materials that age beautifully.
        </p>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/products">
              Shop the collection
              <ArrowRight className="ml-2 size-4" aria-hidden="true" />
            </Link>
          </Button>
          <a
            href="https://wa.me/15550192834"
            className="text-sm font-medium underline underline-offset-4"
          >
            Chat with a stylist
          </a>
        </div>
      </div>
      <Image
        src="/hero-lounge.webp"
        alt="Lounge chair in a sunlit room"
        width={720}
        height={540}
        className="rounded-3xl object-cover shadow-2xl"
      />
    </section>
  );
}
