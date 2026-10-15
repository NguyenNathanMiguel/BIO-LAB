import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Image } from '@/components/ui/image';
export default function JournalCaptureImage({ entry, expanded = false }) {
  const { data, isPending, error } = useQuery({ queryKey: ['microscope-capture', entry.id], queryFn: async () => (await base44.functions.invoke('getMicroscopeCapture', { entry_id: entry.id })).data.signed_url, staleTime: 240000 });
  if (isPending) return <span className="text-xs text-muted-foreground">Đang tải ảnh…</span>;
  if (error) return <span className="text-xs text-destructive">Không tải được ảnh chụp.</span>;
  return <Image src={data} alt={`Ảnh chụp ${entry.title}`} fittingType="fit" className={expanded ? 'h-80 w-full rounded-xl bg-lab-surface object-contain' : 'h-12 w-12 rounded-xl'} />;
}