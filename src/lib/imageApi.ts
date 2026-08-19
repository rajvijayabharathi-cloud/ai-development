import { STYLE_PRESETS, ASPECT_RATIOS, type GenerationParams } from '@/types';

export function buildFullPrompt(params: GenerationParams): string {
  const style = STYLE_PRESETS.find((s) => s.id === params.style);
  let full = params.prompt.trim();
  if (style && style.suffix) {
    full += style.suffix;
  }
  if (params.negativePrompt.trim()) {
    full += `. Avoid: ${params.negativePrompt.trim()}`;
  }
  return full;
}

export function buildImageUrl(params: GenerationParams): { url: string; width: number; height: number } {
  const ratio = ASPECT_RATIOS.find((r) => r.id === params.aspectRatio) ?? ASPECT_RATIOS[0];
  const fullPrompt = buildFullPrompt(params);
  const encoded = encodeURIComponent(fullPrompt);
  const seed = params.seed || Math.floor(Math.random() * 1_000_000);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=${ratio.width}&height=${ratio.height}&seed=${seed}&nologo=true&model=${params.model}`;
  return { url, width: ratio.width, height: ratio.height };
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 1_000_000);
}
