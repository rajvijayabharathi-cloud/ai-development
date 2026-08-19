import { useState } from 'react';
import { Download, Copy, Check, Trash2, RefreshCw, Maximize2, X, Clock } from 'lucide-react';
import type { GeneratedImage } from '@/types';
import { STYLE_PRESETS, ASPECT_RATIOS } from '@/types';

interface ImageCardProps {
  image: GeneratedImage;
  onRemove: (id: string) => void;
  onRegenerate?: (image: GeneratedImage) => void;
}

export function ImageCard({ image, onRemove, onRegenerate }: ImageCardProps) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const styleLabel = STYLE_PRESETS.find((s) => s.id === image.style)?.label ?? image.style;
  const ratio = ASPECT_RATIOS.find((r) => r.id === image.aspectRatio);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${image.seed}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(image.url, '_blank');
    }
  };

  return (
    <>
      <div className="group relative rounded-2xl overflow-hidden bg-white border border-stone-200 hover:border-teal-300 hover:shadow-lg transition-all">
        {/* Image */}
        <div
          className="relative cursor-pointer overflow-hidden"
          style={{ aspectRatio: `${image.width} / ${image.height}` }}
          onClick={() => setShowModal(true)}
        >
          <img
            src={image.url}
            alt={image.prompt}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Top badges */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-xs text-stone-700 font-medium">
              {image.model}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm text-xs text-stone-700 font-medium">
              {styleLabel}
            </span>
          </div>

          {/* Expand icon */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="p-1.5 rounded-lg bg-white/80 backdrop-blur-sm text-stone-700">
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>

          {/* Bottom info on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-sm text-white line-clamp-2">{image.prompt}</p>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-1.5 text-xs text-stone-400">
            <Clock className="w-3 h-3" />
            {formatTime(image.createdAt)}
            {ratio && <span className="ml-1">· {ratio.label}</span>}
          </div>
          <div className="flex items-center gap-1">
            <IconButton onClick={handleCopyPrompt} title="Copy prompt">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </IconButton>
            <IconButton onClick={handleDownload} title="Download">
              <Download className="w-4 h-4" />
            </IconButton>
            {onRegenerate && (
              <IconButton onClick={() => onRegenerate(image)} title="Regenerate">
                <RefreshCw className="w-4 h-4" />
              </IconButton>
            )}
            <IconButton onClick={() => onRemove(image.id)} title="Delete" danger>
              <Trash2 className="w-4 h-4" />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ImageModal image={image} onClose={() => setShowModal(false)} onDownload={handleDownload} />
      )}
    </>
  );
}

function IconButton({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        danger
          ? 'text-stone-400 hover:text-red-500 hover:bg-red-50'
          : 'text-stone-400 hover:text-teal-600 hover:bg-teal-50'
      }`}
    >
      {children}
    </button>
  );
}

function ImageModal({
  image,
  onClose,
  onDownload,
}: {
  image: GeneratedImage;
  onClose: () => void;
  onDownload: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 p-2 rounded-full bg-white text-stone-600 hover:bg-stone-100 hover:text-stone-800 transition-colors z-10 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-xl">
          <img
            src={image.url}
            alt={image.prompt}
            className="max-w-full max-h-[70vh] object-contain rounded-xl"
          />
        </div>

        <div className="bg-white rounded-xl p-4 space-y-3 shadow-xl">
          <div className="flex items-start gap-3">
            <p className="flex-1 text-stone-700 text-sm leading-relaxed">{image.prompt}</p>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-2 rounded-lg bg-stone-100 text-stone-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge label={`Model: ${image.model}`} />
            <Badge label={`Seed: ${image.seed}`} />
            <Badge label={`Size: ${image.width}×${image.height}`} />
            <button
              onClick={onDownload}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium hover:bg-teal-500 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-500 font-medium">
      {label}
    </span>
  );
}

function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(ts).toLocaleDateString();
}
