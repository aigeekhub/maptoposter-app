'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/auth-store';
import { MapGenerator } from '@/components/forms/MapGenerator';
import { MapLibrary } from '@/components/forms/MapLibrary';
import { Map, Library, LogOut, MapPin } from 'lucide-react';
import Link from 'next/link';

type Tab = 'generate' | 'library';

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>('generate');
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-border px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary font-bold text-lg">
          <MapPin size={20} /> MapToPoster
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-text-muted text-sm hidden sm:block">{user?.display_name || 'Guest'}</span>
          {user ? (
            <button onClick={() => { logout(); window.location.href = '/'; }} className="text-text-subtle hover:text-text transition-colors">
              <LogOut size={18} />
            </button>
          ) : (
            <Link href="/auth/login" className="btn-primary py-1.5 px-4 text-sm">Log in</Link>
          )}
        </div>
      </nav>
      <div className="border-b border-border px-6">
        <div className="flex gap-1 -mb-px">
          {([['generate', Map, 'Generator'], ['library', Library, 'My Maps']] as const).map(([id, Icon, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === id ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'
              }`}>
              <Icon size={16} />{label}
            </button>
          ))}
        </div>
      </div>
      <motion.div key={tab} className="flex-1 p-6 max-w-6xl mx-auto w-full"
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
        {tab === 'generate' ? <MapGenerator /> : <MapLibrary />}
      </motion.div>
    </div>
  );
}
