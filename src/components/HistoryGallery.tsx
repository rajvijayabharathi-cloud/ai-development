import { Trash2, ImageIcon } from 'lucide-react';
import type { GeneratedImage } from '@/types';
import { ImageCard } from './ImageCard';

interface HistoryGalleryProps {
  history: GeneratedImage[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onRegenerate: (image: GeneratedImage) => void;
}

export function HistoryGallery({ history, onRemove, onClear, onRegenerate }: HistoryGalleryProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-200/60 flex items-center justify-center mb-4">
          <ImageIcon className="w-10 h-10 text-stone-400" />
        </div>
        <h3 className="text-lg font-semibold text-stone-500 mb-1">No images yet</h3>
        <p className="text-sm text-stone-400 max-w-sm">
          Your generated images will appear here. Start by describing what you want to create.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-700">
          Your Creations
          <span className="ml-2 text-sm font-normal text-stone-400">({history.length})</span>
        </h2>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear all
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {history.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onRemove={onRemove}
            onRegenerate={onRegenerate}
          />
        ))}
      </div>
    </div>
  );
}
