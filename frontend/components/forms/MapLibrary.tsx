'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MapPin, FolderOpen, Heart, Download, Loader2 } from 'lucide-react';
import { mapsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import Link from 'next/link';

export function MapLibrary() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({ queryKey: ['maps'], queryFn: mapsApi.list, enabled: !!user });

  if (!user) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <FolderOpen size={48} className="text-primary/30" />
      <h3 className="text-lg font-semibold text-text">Sign in to save maps</h3>
      <p className="text-text-muted text-center max-w-sm">Create an account to save your generated posters and organize them in folders.</p>
      <Link href="/auth/signup" className="btn-primary mt-2">Create free account</Link>
    </div>
  );

  if (isLoading) return (
    <div className="flex items-center justify-center py-24 gap-3 text-text-muted">
      <Loader2 size={24} className="animate-spin text-primary" /> Loading your maps…
    </div>
  );

  const maps = data?.maps ?? [];

  if (maps.length === 0) return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <MapPin size={48} className="text-primary/30" />
      <h3 className="text-lg font-semibold text-text">No saved maps yet</h3>
      <p className="text-text-muted">Generate your first poster and save it here!</p>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-bold text-text mb-6">My Maps ({maps.length})</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {maps.map((map: { id: string; title: string; city: string; theme: string; file_path?: string; is_favorite: boolean }, i: number) => (
          <motion.div key={map.id} className="card p-3 group cursor-pointer hover:border-primary/40"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}>
            <div className="aspect-[3/4] bg-surface-2 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              {map.file_path ? <img src={map.file_path} alt={map.title} className="w-full h-full object-cover" /> : <MapPin size={24} className="text-primary/40" />}
            </div>
            <p className="text-sm font-medium text-text truncate">{map.title}</p>
            <p className="text-xs text-text-muted">{map.city} · {map.theme}</p>
            <div className="flex items-center gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 hover:text-red-400 transition-colors"><Heart size={14} className={map.is_favorite ? 'fill-red-400 text-red-400' : ''} /></button>
              {map.file_path && <a href={map.file_path} download className="p-1.5 hover:text-primary transition-colors"><Download size={14} /></a>}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
