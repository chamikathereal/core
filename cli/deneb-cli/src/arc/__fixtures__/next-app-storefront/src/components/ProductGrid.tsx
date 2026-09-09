import Image from 'next/image';

const products = [
  {
    id: 'prod-1',
    title: 'Minimalist Smart Watch',
    price: '$249.00',
    image: '/watch.webp',
    description: 'Titanium case with a sapphire display.',
  },
  {
    id: 'prod-2',
    title: 'Leather Travel Backpack',
    price: '$189.00',
    image: '/backpack.webp',
    description: 'Full-grain waterproof Italian leather.',
  },
  {
    id: 'prod-3',
    title: 'Linen Weekend Shirt',
    price: '$89.00',
    image: '/shirt.webp',
    description: 'Breathable European linen, garment washed.',
  },
];

export function ProductGrid() {
  return (
    <section className="px-6">
      <h2 className="mb-10 text-center text-3xl font-semibold">Featured products</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="group flex flex-col gap-4">
            <Image
              src={product.image}
              alt={product.title}
              width={480}
              height={480}
              className="rounded-2xl object-cover transition group-hover:scale-[1.02]"
            />
            <h3 className="text-lg font-medium">{product.title}</h3>
            <p className="text-sm text-slate-600">{product.description}</p>
            <span className="text-base font-semibold">{product.price}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
