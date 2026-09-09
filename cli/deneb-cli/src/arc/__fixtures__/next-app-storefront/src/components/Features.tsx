'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Recycle } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Free carbon-neutral shipping', body: 'On every order above $80.' },
  { icon: ShieldCheck, title: 'Five year warranty', body: 'Repairs handled in-house, forever.' },
  { icon: Recycle, title: 'Circular by design', body: 'Send it back and we rebuild it.' },
];

export function Features() {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
        {features.map((feature) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <feature.icon className="size-6 text-slate-900" aria-hidden="true" />
            <h3 className="text-base font-semibold">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
