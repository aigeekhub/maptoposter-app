'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Save, MapPin, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { themesApi, mapsApi } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';

const schema = z.object({
  city: z.string().min(1, 'City is required'),
  theme: z.string(),
  distance_meters: z.number().int().min(1000).max(50000),
  width_inches: z.number().min(4).max(40),
  height_inches: z.number().min(4).max(40),
  export_format: z.enum(['png', 'svg', 'pdf']),
});
type FormData = z.infer<typeof schema>;

interface Theme { id: string; name: string; description: string; }

export function MapGenerator() {
  const [result, setResult] = useState<{ file_path: string; map_id?: string } | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  const { data: themesData } = useQuery({ queryKey: ['themes'], queryFn: themesApi.list });
  const themes: Theme[] = themesData?.themes ?? [];

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { theme: 'terracotta', distance_meters: 12000, width_inches: 18, height_inches: 24, export_format: 'png' },
  });

  const selectedTheme = watch('theme');

  const onSubmit = async (data: FormData) => {
    setError(''); setGenerating(true); setResult(null);
    try {
      const res = await mapsApi.generate(data);
      setResult(res);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(msg || 'Generation failed. Please try again.');
    } finally { setGenerating(false); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h2 className="text-xl font-bold text-text mb-6">Create your map poster</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input label="City" placeholder="e.g. Tokyo, Paris, New York" error={errors.city?.message} {...register('city')} />
          <div>
            <label className="label">Theme</label>
            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {themes.map((t) => (
                <motion.button key={t.id} type="button" onClick={() => setValue('theme', t.id)}
                  className={`p-2.5 rounded-lg border text-left text-sm transition-all ${
                    selectedTheme === t.id ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface-2 text-text-muted hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  {t.name}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">Width (in)</label><input className="input" type="number" min="4" max="40" step="0.5" {...register('width_inches', { valueAsNumber: true })} /></div>
            <div><label className="label">Height (in)</label><input className="input" type="number" min="4" max="40" step="0.5" {...register('height_inches', { valueAsNumber: true })} /></div>
          </div>
          <div><label className="label">Map radius (meters)</label><input className="input" type="number" min="1000" max="50000" step="500" {...register('distance_meters', { valueAsNumber: true })} /></div>
          <div>
            <label className="label">Export format</label>
            <div className="flex gap-2">
              {(['png', 'svg', 'pdf'] as const).map((f) => (
                <button key={f} type="button" onClick={() => setValue('export_format', f)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    watch('export_format') === f ? 'border-primary bg-primary/10 text-primary' : 'border-border text-text-muted hover:border-primary/50'
                  }`}>{f.toUpperCase()}</button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <Button type="submit" className="w-full" size="lg" loading={generating}>
            <Sparkles size={18} />{generating ? 'Generating…' : 'Generate poster'}
          </Button>
          {!user && <p className="text-text-subtle text-xs text-center"><a href="/auth/signup" className="text-primary hover:underline">Sign up</a> to save your maps</p>}
        </form>
      </div>
      <div className="lg:sticky lg:top-6">
        <h2 className="text-xl font-bold text-text mb-6">Preview</h2>
        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div key="loading" className="card aspect-[3/4] flex flex-col items-center justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Loader2 size={40} className="text-primary animate-spin" />
              <p className="text-text-muted">Fetching map data and rendering…</p>
              <p className="text-text-subtle text-sm">This takes 15–60 seconds</p>
            </motion.div>
          ) : result ? (
            <motion.div key="result" className="card aspect-[3/4] flex flex-col items-center justify-center gap-4" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
              <img src={result.file_path} alt="Generated map poster" className="w-full h-full object-contain rounded-lg" />
              <div className="flex gap-3 w-full">
                <a href={result.file_path} download className="flex-1"><Button variant="outline" className="w-full" size="sm"><Download size={16} /> Download</Button></a>
                {user && <Button variant="primary" size="sm" className="flex-1"><Save size={16} /> Save</Button>}
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" className="card aspect-[3/4] flex flex-col items-center justify-center gap-3 border-dashed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MapPin size={48} className="text-primary/30" />
              <p className="text-text-muted text-center">Your generated poster will appear here</p>
              <p className="text-text-subtle text-sm text-center">Choose a city and theme, then click Generate</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
