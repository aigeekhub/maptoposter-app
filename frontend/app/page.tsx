'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, FolderOpen, Download } from 'lucide-react';

const features = [
  { icon: MapPin, title: 'Any City', desc: 'Generate posters for any city in the world with OpenStreetMap data.' },
  { icon: Sparkles, title: '17 Themes', desc: 'From Noir to Neon Cyberpunk — premium artistic styles for every taste.' },
  { icon: FolderOpen, title: 'Organize', desc: 'Save maps in custom folders and build your personal collection.' },
  { icon: Download, title: 'Export', desc: 'Download high-resolution PNG, SVG, or PDF ready for printing.' },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">MapToPoster</span>
        <div className="flex gap-3">
          <Link href="/auth/login" className="btn-outline py-2 px-4 text-sm">Log in</Link>
          <Link href="/auth/signup" className="btn-primary py-2 px-4 text-sm">Get started</Link>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <div className="inline-flex items-center gap-2 bg-surface border border-primary/30 text-primary text-sm px-4 py-1.5 rounded-full mb-6">
            <Sparkles size={14} />
            17 premium themes
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-text mb-6 leading-tight">
            Your city.<br />
            <span className="text-primary">Your art.</span>
          </h1>
          <p className="text-xl text-text-muted max-w-xl mx-auto mb-10">
            Turn any city into a stunning poster. Print-ready maps with beautiful artistic themes.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/signup" className="btn-primary text-lg px-8 py-4">Create free account</Link>
            <Link href="/dashboard" className="btn-outline text-lg px-8 py-4">Try demo</Link>
          </div>
        </motion.div>

        <motion.div className="mt-20 flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {['tokyo', 'paris', 'new_york', 'london', 'barcelona'].map((city, i) => (
            <motion.div key={city} className="w-32 h-44 bg-surface-2 border border-border rounded-lg flex-shrink-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }} whileHover={{ y: -6, scale: 1.03 }}>
              <MapPin size={24} className="text-primary opacity-60" />
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="border-t border-border px-6 py-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} className="card hover:border-primary/40 transition-colors"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
              <Icon size={24} className="text-primary mb-3" />
              <h3 className="font-semibold text-text mb-1">{title}</h3>
              <p className="text-sm text-text-muted">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-6 py-6 text-center text-text-subtle text-sm">
        © 2026 MapToPoster — Beautiful maps, premium art
      </footer>
    </main>
  );
}
