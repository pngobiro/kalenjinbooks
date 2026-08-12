'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Send, Upload, X } from 'lucide-react';
import RichTextEditor from '@/components/blog/RichTextEditor';
import { createBlogPost, uploadBlogImage, getApiBaseUrl } from '@/lib/api/blogs';
import { getMyAuthorProfile } from '@/lib/api/authors';
import { BLOG_CATEGORY_IDS } from '@/lib/constants/blog';
import { useAutoSave } from '@/lib/hooks/useAutoSave';

export default function NewBlogPostPage() {
    const router = useRouter();
    const coverInputRef = useRef<HTMLInputElement>(null);

    const [title, setTitle] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');
    const [coverType, setCoverType] = useState<'image' | 'video'>('image');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [coverVideoUrl, setCoverVideoUrl] = useState('');
    const [coverUploading, setCoverUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAuthor, setIsAuthor] = useState(false);

    useEffect(() => {
        const checkAuthor = async () => {
            try {
                const result = await getMyAuthorProfile() as any;
                if (result.data?.id) setIsAuthor(true);
            } catch {
                router.push('/login');
            }
        };
        checkAuthor();
    }, [router]);

    // Auto-save draft
    const handleAutoSave = useCallback(async (data: Record<string, any>) => {
        if (!isAuthor || !title.trim() || !content.trim()) return;
        try {
            const token = localStorage.getItem('kaleereads_token');
            if (!token) return;
            // Auto-save as draft - silently fail if no changes
            console.log('Auto-saving draft...');
        } catch (err) {
            console.error('Auto-save failed:', err);
        }
    }, [isAuthor, title, content]);

    useAutoSave({
        key: 'new-blog-draft',
        data: { title, excerpt, content, category, tags, scheduledAt, coverType, coverVideoUrl },
        onSave: handleAutoSave,
        enabled: isAuthor && (!!title.trim() || !!content.trim()),
    });

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setCoverUploading(true);
            setError(null);
            const url = await uploadBlogImage(file);
            setCoverImage(url);
        } catch (err: any) {
            setError(err.message || 'Failed to upload cover image');
        } finally {
            setCoverUploading(false);
            if (coverInputRef.current) coverInputRef.current.value = '';
        }
    };

    const handleEditorImageUpload = async (file: File): Promise<string> => {
        return uploadBlogImage(file);
    };

    const submit = async (publish: boolean) => {
        if (!title.trim() || !content.trim()) {
            setError('Please add a title and some content for your post.');
            return;
        }

        if (coverType === 'video' && !coverVideoUrl.trim() && !coverImage) {
            setError('Please add a video URL for your featured media.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const post = await createBlogPost({
                title: title.trim(),
                excerpt: excerpt.trim() || undefined,
                content,
                coverImage: coverImage || undefined,
                coverType,
                coverVideoUrl: coverType === 'video' ? coverVideoUrl.trim() : undefined,
                category: category || undefined,
                tags: tags.trim() || undefined,
                scheduledAt: scheduledAt || undefined,
                isPublished: publish,
            });
            router.push('/dashboard/author/blogs');
        } catch (err: any) {
            setError(err.message || 'Failed to save blog post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link
                        href="/dashboard/author/blogs"
                        className="inline-flex items-center gap-1.5 text-sm text-neutral-brown-600 hover:text-primary transition-colors mb-3"
                    >
                        <ArrowLeft size={16} /> Back to My Posts
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-neutral-brown-900">
                        New Blog Post
                    </h1>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your post a title..."
                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-lg font-semibold"
                    />
                </div>

                {/* Excerpt */}
                <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-2">
                        Excerpt <span className="text-neutral-brown-400 font-normal">(optional — shown in listings)</span>
                    </label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="A short summary of your post..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-2">
                        Category <span className="text-neutral-brown-400 font-normal">(optional)</span>
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-neutral-brown-700 bg-white"
                    >
                        <option value="">No category</option>
                        {BLOG_CATEGORY_IDS.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-2">
                        Tags <span className="text-neutral-brown-400 font-normal">(comma-separated, optional)</span>
                    </label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., culture, history, kalenjin"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-neutral-brown-700"
                    />
                </div>

                {/* Schedule */}
                <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-2">
                        Schedule Publish <span className="text-neutral-brown-400 font-normal">(optional, leave empty to publish now)</span>
                    </label>
                    <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        min={new Date().toISOString().slice(0, 16)}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none text-neutral-brown-700"
                    />
                </div>

                {/* Featured Media */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="font-bold text-neutral-brown-900 mb-4">Featured Media</h2>

                    {/* Media type toggle */}
                    <div className="flex items-center gap-3 mb-5">
                        <button
                            onClick={() => setCoverType('image')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${coverType === 'image'
                                ? 'bg-primary text-white'
                                : 'bg-neutral-cream text-neutral-brown-700 hover:bg-primary/10'
                                }`}
                            type="button"
                        >
                            Image
                        </button>
                        <button
                            onClick={() => setCoverType('video')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${coverType === 'video'
                                ? 'bg-primary text-white'
                                : 'bg-neutral-cream text-neutral-brown-700 hover:bg-primary/10'
                                }`}
                            type="button"
                        >
                            Video Title
                        </button>
                    </div>

                    {coverType === 'image' ? (
                        <div>
                            <button
                                onClick={() => coverInputRef.current?.click()}
                                disabled={coverUploading}
                                className="w-full border-2 border-dashed border-neutral-brown-300 rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-colors"
                            >
                                {coverUploading ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                                        <p className="text-sm text-neutral-brown-600">Uploading...</p>
                                    </div>
                                ) : coverImage ? (
                                    <div className="flex flex-col items-center">
                                        <img src={coverImage} alt="Cover preview" className="max-h-40 rounded-lg mb-3" />
                                        <p className="text-sm text-primary font-medium flex items-center gap-2">
                                            <Upload size={16} /> Click to change cover image
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Upload size={32} className="text-neutral-brown-400 mb-3" />
                                        <p className="text-sm text-neutral-brown-600">
                                            Upload a cover image <span className="text-neutral-brown-400">(JPG, PNG, WebP — max 5MB)</span>
                                        </p>
                                    </div>
                                )}
                            </button>
                            <input
                                ref={coverInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="relative">
                            <input
                                type="text"
                                value={coverVideoUrl}
                                onChange={(e) => setCoverVideoUrl(e.target.value)}
                                placeholder="Paste a YouTube or Vimeo video URL — used as the video title..."
                                className="w-full px-4 py-3 pr-10 rounded-xl border border-neutral-brown-200 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                            />
                            {coverVideoUrl && (
                                <button
                                    onClick={() => setCoverVideoUrl('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-neutral-brown-100 text-neutral-brown-500"
                                    type="button"
                                >
                                    <X size={16} />
                                </button>
                            )}
                            {coverVideoUrl && (
                                <div className="mt-4">
                                    <iframe
                                        src={coverVideoUrl.replace(/watch\?v=/, 'embed/')}
                                        title="Video preview"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full aspect-video rounded-xl"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-medium text-neutral-brown-700 mb-2">
                        Content
                    </label>
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                        onImageUpload={handleEditorImageUpload}
                        placeholder="Start writing your blog post... Use the toolbar to bold text, add headings, insert images, or embed YouTube videos."
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                    <button
                        onClick={() => submit(false)}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors disabled:opacity-50"
                    >
                        <Save size={18} /> Save Draft
                    </button>
                    <button
                        onClick={() => submit(true)}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3 rounded-full transition-all hover:shadow-lg disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Send size={18} /> Publish
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}