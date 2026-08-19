import { useState, useRef, useEffect } from 'react';
import { Wand2, Shuffle, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { STYLE_PRESETS, ASPECT_RATIOS, MODELS, type GenerationParams } from '@/types';
import { randomSeed } from '@/lib/imageApi';
import { generateImage } from '@/lib/generate';
import type { GeneratedImage } from '@/types';

interface PromptFormProps {
  onGenerate: (image: GeneratedImage) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
}

export function PromptForm({ onGenerate, isGenerating, setIsGenerating }: PromptFormProps) {
  const [params, setParams] = useState<GenerationParams>({
    prompt: '',
    negativePrompt: '',
    style: 'realistic',
    aspectRatio: '1:1',
    model: 'flux',
    seed: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [params.prompt]);

  const update = <K extends keyof GenerationParams>(key: K, value: GenerationParams[K]) => {
    setParams((p) => ({ ...p, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!params.prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    setError(null);
    setIsGenerating(true);

    generateImage(
      params,
      (image) => {
        onGenerate(image);
        setIsGenerating(false);
      },
      (msg) => {
        setError(msg);
        setIsGenerating(false);
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="space-y-5">
      {/* Prompt Input */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-stone-600 mb-2">
          <Sparkles className="w-4 h-4 text-teal-600" />
          Describe your image
        </label>
        <textarea
          ref={textareaRef}
          value={params.prompt}
          onChange={(e) => update('prompt', e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="A majestic dragon perched on a mountain peak at sunset, breathing fire into the clouds..."
          className="w-full resize-none rounded-xl bg-white border border-stone-300 px-4 py-3 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
          rows={3}
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-stone-400">
            {params.prompt.length} characters
          </span>
          <span className="text-xs text-stone-400">
            Cmd/Ctrl + Enter to generate
          </span>
        </div>
      </div>

      {/* Negative Prompt */}
      <div>
        <label className="text-sm font-medium text-stone-600 mb-2 block">
          What to avoid (optional)
        </label>
        <input
          type="text"
          value={params.negativePrompt}
          onChange={(e) => update('negativePrompt', e.target.value)}
          placeholder="blurry, distorted, low quality, watermark..."
          className="w-full rounded-xl bg-white border border-stone-300 px-4 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition-all"
        />
      </div>

      {/* Style Presets */}
      <div>
        <label className="text-sm font-medium text-stone-600 mb-2 block">Style</label>
        <div className="flex flex-wrap gap-2">
          {STYLE_PRESETS.map((style) => (
            <button
              key={style.id}
              onClick={() => update('style', style.id)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                params.style === style.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
              }`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div>
        <label className="text-sm font-medium text-stone-600 mb-2 block">Aspect Ratio</label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.id}
              onClick={() => update('aspectRatio', ratio.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                params.aspectRatio === ratio.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200 hover:text-stone-700'
              }`}
            >
              <RatioIcon icon={ratio.icon} />
              <span>{ratio.label}</span>
              <span className="text-xs opacity-60">{ratio.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Model & Seed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-stone-600 mb-2 block">Model</label>
          <div className="flex gap-2">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => update('model', model.id)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  params.model === model.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                <div>{model.label}</div>
                <div className="text-xs opacity-60">{model.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-stone-600 mb-2 block">Seed</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={params.seed || ''}
              onChange={(e) => update('seed', parseInt(e.target.value) || 0)}
              placeholder="Random"
              className="flex-1 rounded-xl bg-white border border-stone-300 px-4 py-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
            />
            <button
              onClick={() => update('seed', randomSeed())}
              className="px-3 rounded-xl bg-stone-100 border border-stone-300 text-stone-500 hover:bg-stone-200 hover:text-stone-700 transition-all"
              title="Random seed"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/25 hover:shadow-teal-600/35"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            Generate Image
          </>
        )}
      </button>
    </div>
  );
}

function RatioIcon({ icon }: { icon: string }) {
  const dimensions: Record<string, string> = {
    square: 'w-4 h-4',
    portrait: 'w-3 h-4',
    landscape: 'w-4 h-3',
    wide: 'w-5 h-3',
    story: 'w-3 h-5',
  };
  return <div className={`${dimensions[icon]} border-2 border-current rounded-sm`} />;
}
