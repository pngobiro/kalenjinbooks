'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/blog/RichTextEditor';
import { extractExcerpt } from '@/lib/blog-utils';

export default function NewBlogPostPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [isPublished, setIsPublished] = useState(false);
    const [saving, setSaving] = useState(false);

    // Mock author ID - in production, get from session
    const authorId = 'mock-author-id';

    const handleImageUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/blog/images', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        return data.url;
    };

    const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const url = await handleImageUpload(file);
            setCoverImage(url);
        } catch (error) {
            console.error('Error uploading cover image:', error);
            alert('Failed to upload cover image');
        }
    };

    const handleSave = async (publish: boolean) => {
        if (!title.trim()) {
            alert('Please enter a title');
            return;
        }

        if (!content.trim()) {
            alert('Please enter some content');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch('/api/blog/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    content,
                    excerpt: excerpt || extractExcerpt(content),
                    coverImage,
                    isPublished: publish,
                    authorId,
                }),
            });

            if (response.ok) {
                router.push('/dashboard/author/blogs');
            } else {
                throw new Error('Failed to create blog post');
            }
        } catch (error) {
            console.error('Error saving blog post:', error);
            alert('Failed to save blog post');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link
                    href="/dashboard/author/blogs"
                    className="inline-flex items-center gap-2 text-neutral-brown-700 hover:text-primary mb-4 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Blogs
                </Link>
                <h1 className="text-3xl font-bold text-neutral-brown-900">Create New Blog Post</h1>
                <p className="text-neutral-brown-700 mt-1">
                    Write and publish your blog post
                </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-semibold text-neutral-brown-900 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your blog post title"
                        className="w-full px-4 py-3 border-2 border-neutral-brown-500/20 rounded-lg focus:border-primary focus:outline-none text-lg"
                    />
                </div>

                {/* Cover Image */}
                <div>
                    <label className="block text-sm font-semibold text-neutral-brown-900 mb-2">
                        Cover Image
                    </label>
                    {coverImage ? (
                        <div className="relative">
                            <img
                                src={coverImage}
                                alt="Cover"
                                className="w-full h-64 object-cover rounded-lg"
                            />
                            <button
                                onClick={() => setCoverImage('')}
                                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-neutral-brown-500/20 rounded-lg p-8 text-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverImageUpload}
                                className="hidden"
                                id="cover-upload"
                            />
                            <label
                                htmlFor="cover-upload"
                                className="cursor-pointer text-primary hover:text-primary-dark font-medium"
                            >
                                Click to upload cover image
                            </label>
                            <p className="text-sm text-neutral-brown-700 mt-2">
                                Recommended: 1200x630px (16:9 ratio)
                            </p>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div>
                    <label className="block text-sm font-semibold text-neutral-brown-900 mb-2">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                        onImageUpload={handleImageUpload}
                    />
                </div>

                {/* Excerpt */}
                <div>
                    <label className="block text-sm font-semibold text-neutral-brown-900 mb-2">
                        Excerpt (Optional)
                    </label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Brief summary of your post (auto-generated if left empty)"
                        rows={3}
                        maxLength={200}
                        className="w-full px-4 py-3 border-2 border-neutral-brown-500/20 rounded-lg focus:border-primary focus:outline-none resize-none"
                    />
                    <p className="text-sm text-neutral-brown-700 mt-1">
                        {excerpt.length}/200 characters
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-neutral-brown-500/10">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="publish"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary"
                        />
                        <label htmlFor="publish" className="text-sm font-medium text-neutral-brown-900">
                            Publish immediately
                        </label>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/dashboard/author/blogs"
                            className="px-6 py-3 border-2 border-neutral-brown-500/20 text-neutral-brown-900 font-semibold rounded-lg hover:bg-neutral-cream transition-colors"
                        >
                            Cancel
                        </Link>
                        <button
                            onClick={() => handleSave(isPublished)}
                            disabled={saving}
                            className="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={20} />
                            {saving ? 'Saving...' : isPublished ? 'Publish' : 'Save as Draft'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
