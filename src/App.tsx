import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { PromptForm } from '@/components/PromptForm';
import { HistoryGallery } from '@/components/HistoryGallery';
import { useImageHistory } from '@/hooks/useImageHistory';
import { generateImage, regenerateFromImage } from '@/lib/generate';
import type { GeneratedImage } from '@/types';

function App() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { history, addImage, removeImage, clearHistory } = useImageHistory();

  const handleGenerate = useCallback(
    (image: GeneratedImage) => {
      addImage(image);
    },
    [addImage],
  );

  const handleRegenerate = useCallback(
    (image: GeneratedImage) => {
      setIsGenerating(true);
      regenerateFromImage(
        image,
        (newImage) => {
          addImage(newImage);
          setIsGenerating(false);
        },
        () => {
          setIsGenerating(false);
        },
        () => {
          setIsGenerating(false);
        },
      );
    },
    [addImage],
  );

  return (
    <div className="min-h-screen bg-[#fbf7f0] text-stone-800">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-400/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* Sidebar — Prompt Form */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white/70 backdrop-blur-sm border border-stone-200 rounded-2xl p-5 shadow-sm">
              <PromptForm
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            </div>
          </aside>

          {/* Main — Gallery */}
          <section>
            {isGenerating && history.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-teal-600/30 border-t-teal-600 rounded-full animate-spin mb-4" />
                <p className="text-stone-500">Creating your image...</p>
              </div>
            )}
            <HistoryGallery
              history={history}
              onRemove={removeImage}
              onClear={clearHistory}
              onRegenerate={handleRegenerate}
            />
          </section>
        </div>
      </main>

      <footer className="relative border-t border-stone-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 text-center text-sm text-stone-400">
          Built with Pollinations.ai — Free, open-source AI image generation
        </div>
      </footer>
    </div>
  );
}

export default App;
