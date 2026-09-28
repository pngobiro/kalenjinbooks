'use client';

import { useState } from 'react';
import { PlayCircle, X } from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '@/lib/blog-utils';

interface VideoThumbnailProps {
    videoUrl: string;
    title?: string;
    className?: string;
    showLabel?: boolean;
}

export default function VideoThumbnail({ videoUrl, title, className = '', showLabel = false }: VideoThumbnailProps) {
    const [isOpen, setIsOpen] = useState(false);
    const embedUrl = getYouTubeEmbedUrl(videoUrl);
    const canEmbed = embedUrl !== '';
    // Only a real YouTube thumbnail is useful; otherwise fall back to a neutral panel.
    const thumbnail = canEmbed ? getYouTubeThumbnail(videoUrl) : '';

    // Not an embeddable YouTube URL (e.g. a direct file or Vimeo link): send the
    // reader straight to the source instead of opening a modal with a blank frame.
    if (!canEmbed) {
        return (
            <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full h-full block cursor-pointer bg-neutral-brown-900/90"
                aria-label={`Open video: ${title || 'video'}`}
            >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                    <PlayCircle size={56} className="text-white/90 group-hover:scale-110 transition-transform" />
                    <span className="text-white/80 text-xs font-medium">
                        Watch on the original site
                    </span>
                </div>
            </a>
        );
    }

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                className="group relative w-full h-full block cursor-pointer"
                aria-label={`Play video: ${title || 'video'}`}
            >
                <img
                    src={thumbnail}
                    alt={title || 'Video'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-neutral-brown-900/30 group-hover:bg-neutral-brown-900/20 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <PlayCircle size={56} className="text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                    {showLabel && (
                        <span className="text-white/90 text-xs font-medium px-3 py-1 bg-neutral-brown-900/60 rounded-full">
                            Video
                        </span>
                    )}
                </div>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-10"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                        aria-label="Close video"
                    >
                        <X size={24} />
                    </button>
                    <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
                        <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-neutral-brown-900">
                            <iframe
                                src={`${embedUrl}?autoplay=1`}
                                title={title || 'Video'}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}