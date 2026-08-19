import { ASPECT_RATIOS, type GeneratedImage, type GenerationParams } from '@/types';
import { buildImageUrl, buildFullPrompt, randomSeed } from '@/lib/imageApi';

export function generateImage(
  params: GenerationParams,
  onSuccess: (image: GeneratedImage) => void,
  onError: (msg: string) => void,
  onDone?: () => void,
): void {
  const seed = params.seed || randomSeed();
  const { url, width, height } = buildImageUrl({ ...params, seed });
  const fullPrompt = buildFullPrompt({ ...params, seed });

  const img = new Image();
  img.onload = () => {
    onSuccess({
      id: crypto.randomUUID(),
      url,
      prompt: params.prompt.trim(),
      fullPrompt,
      style: params.style,
      aspectRatio: params.aspectRatio,
      model: params.model,
      seed,
      width,
      height,
      createdAt: Date.now(),
    });
    onDone?.();
  };
  img.onerror = () => {
    onError('Failed to generate image. Please try again.');
    onDone?.();
  };
  img.src = url;
}

export function regenerateFromImage(
  image: GeneratedImage,
  onSuccess: (image: GeneratedImage) => void,
  onError: (msg: string) => void,
  onDone?: () => void,
): void {
  const ratio = ASPECT_RATIOS.find((r) => r.id === image.aspectRatio) ?? ASPECT_RATIOS[0];
  const seed = randomSeed();
  const encoded = encodeURIComponent(image.fullPrompt);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=${ratio.width}&height=${ratio.height}&seed=${seed}&nologo=true&model=${image.model}`;

  const img = new Image();
  img.onload = () => {
    onSuccess({
      ...image,
      id: crypto.randomUUID(),
      url,
      seed,
      createdAt: Date.now(),
    });
    onDone?.();
  };
  img.onerror = () => {
    onError('Failed to regenerate image. Please try again.');
    onDone?.();
  };
  img.src = url;
}
