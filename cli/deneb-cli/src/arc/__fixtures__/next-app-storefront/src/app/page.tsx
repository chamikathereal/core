import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { Features } from '@/components/Features';

export default function HomePage() {
  return (
    <main className="flex flex-col gap-24 pb-24">
      <Hero />
      <ProductGrid />
      <Features />
    </main>
  );
}
