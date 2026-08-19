export interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  style: string;
  aspectRatio: string;
  model: string;
  seed: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  fullPrompt: string;
  style: string;
  aspectRatio: string;
  model: string;
  seed: number;
  width: number;
  height: number;
  createdAt: number;
}

export interface StylePreset {
  id: string;
  label: string;
  suffix: string;
}

export interface AspectRatioOption {
  id: string;
  label: string;
  width: number;
  height: number;
  icon: string;
}

export const STYLE_PRESETS: StylePreset[] = [
  { id: 'none', label: 'No Style', suffix: '' },
  { id: 'realistic', label: 'Realistic', suffix: ', photorealistic, ultra detailed, 8k, professional photography, sharp focus' },
  { id: 'digital', label: 'Digital Art', suffix: ', digital art, trending on artstation, highly detailed, vibrant colors' },
  { id: 'anime', label: 'Anime', suffix: ', anime style, studio ghibli inspired, cel shaded, detailed anime art' },
  { id: 'oil', label: 'Oil Painting', suffix: ', oil painting, textured brushstrokes, classical art style, rich colors' },
  { id: 'cyberpunk', label: 'Cyberpunk', suffix: ', cyberpunk, neon lights, futuristic, dystopian, blade runner aesthetic' },
  { id: 'watercolor', label: 'Watercolor', suffix: ', watercolor painting, soft colors, artistic, flowing paint' },
  { id: '3d', label: '3D Render', suffix: ', 3d render, octane render, cinema4d, volumetric lighting, ultra detailed' },
  { id: 'pixel', label: 'Pixel Art', suffix: ', pixel art, 16-bit, retro game style, pixelated' },
  { id: 'minimalist', label: 'Minimalist', suffix: ', minimalist, clean, simple, elegant, negative space' },
];

export const ASPECT_RATIOS: AspectRatioOption[] = [
  { id: '1:1', label: 'Square', width: 1024, height: 1024, icon: 'square' },
  { id: '3:4', label: 'Portrait', width: 768, height: 1024, icon: 'portrait' },
  { id: '4:3', label: 'Standard', width: 1024, height: 768, icon: 'landscape' },
  { id: '16:9', label: 'Widescreen', width: 1024, height: 576, icon: 'wide' },
  { id: '9:16', label: 'Story', width: 576, height: 1024, icon: 'story' },
];

export const MODELS = [
  { id: 'flux', label: 'Flux', description: 'Best quality, slower' },
  { id: 'turbo', label: 'Turbo', description: 'Fast generation' },
];
