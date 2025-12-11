'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Book, Image as ImageIcon, Bold, Italic, 
  List, ListOrdered, Link as LinkIcon, Quote, Code,
  Eye, Save, Send, X, Upload, Heading1, Heading2
} from 'lucide-react';

export default function NewBlogPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
  });

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    const newText = formData.content.substring(0, start) + before + selectedText + after + formData.content.substring(end);
    
    setFormData({ ...formData, content: newText });
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const toolbarButtons = [
    { icon: Heading1, label: 'Heading 1', action: () => insertFormatting('# ') },
    { icon: Heading2, label: 'Heading 2', action: () => insertFormatting('## ') },
    { icon: Bold, label: 'Bold', action: () => insertFormatting('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertFormatting('*', '*') },
    { icon: List, label: 'Bullet List', action: () => insertFormatting('- ') },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertFormatting('1. ') },
    { icon: Quote, label: 'Quote', action: () => insertFormatting('> ') },
    { icon: Code, label: 'Code', action: () => insertFormatting('`', '`') },
    { icon: LinkIcon, label: 'Link', action: () => insertFormatting('[', '](url)') },
  ];

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      // In production, save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Draft saved successfully!');
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in the title and content');
      return;
    }

    setIsSubmitting(true);
    try {
      // In production, publish to API
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/dashboard/author/blogs?published=true');
    } catch (error) {
      console.error('Failed to publish:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (text: string) => {
    return text
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 italic my-4">$1</blockquote>')
      .replace(/\`(.*)\`/gim, '<code class="bg-neutral-brown-100 px-1 rounded">$1</code>')
      .replace(/^\- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n/gim, '<br />');
  };

  return (
    <div className="min-h-screen bg-neutral-cream">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 border-b border-neutral-brown-500/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <Link href="/dashboard/author" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                <Book className="text-primary" size={24} />
              </div>
              <span className="text-2xl font-bold text-neutral-brown-900 font-heading">KaleeReads</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showPreview ? 'bg-primary text-white' : 'bg-white border border-neutral-brown-200 text-neutral-brown-700 hover:border-primary'
                }`}
              >
                <Eye size={18} />
                <span className="hidden sm:inline">Preview</span>
              </button>
              
              <button
                onClick={handleSaveDraft}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-white border border-neutral-brown-200 text-neutral-brown-700 px-4 py-2 rounded-lg hover:border-primary transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                <span className="hidden sm:inline">Save Draft</span>
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                <span className="hidden sm:inline">Publish</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Link */}
        <Link 
          href="/dashboard/author/blogs" 
          className="inline-flex items-center gap-2 text-neutral-brown-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Blogs
        </Link>

        {showPreview ? (
          /* Preview Mode */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {coverImage && (
              <div className="aspect-video w-full overflow-hidden">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-8">
              <h1 className="text-4xl font-bold text-neutral-brown-900 font-heading mb-4">
                {formData.title || 'Untitled Post'}
              </h1>
              {formData.excerpt && (
                <p className="text-xl text-neutral-brown-600 mb-8">{formData.excerpt}</p>
              )}
              <div 
                className="prose prose-lg max-w-none text-neutral-brown-700"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(formData.content) || '<p class="text-neutral-brown-400">No content yet...</p>' }}
              />
              {formData.tags && (
                <div className="mt-8 pt-6 border-t border-neutral-brown-100">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.split(',').map((tag, i) => (
                      <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-neutral-brown-900 mb-3">
                Cover Image
              </label>
              
              {coverImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-brown-100">
                  <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setCoverImage(null)}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-neutral-brown-200 hover:border-primary flex flex-col items-center justify-center gap-3 transition-colors bg-neutral-cream/50"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload size={28} className="text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-neutral-brown-900">Click to upload cover image</p>
                    <p className="text-sm text-neutral-brown-500">PNG, JPG up to 5MB</p>
                  </div>
                </button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
            </div>

            {/* Title */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-neutral-brown-900 mb-3">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter your blog post title..."
                className="w-full text-3xl font-bold text-neutral-brown-900 placeholder-neutral-brown-300 border-0 focus:ring-0 p-0"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-neutral-brown-900 mb-3">
                Excerpt (Short summary)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Write a brief summary of your post..."
                rows={2}
                className="w-full text-lg text-neutral-brown-700 placeholder-neutral-brown-300 border-0 focus:ring-0 p-0 resize-none"
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-1 p-3 border-b border-neutral-brown-100 bg-neutral-cream/50 flex-wrap">
                {toolbarButtons.map((btn, i) => (
                  <button
                    key={i}
                    onClick={btn.action}
                    title={btn.label}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-neutral-brown-600 hover:text-primary"
                  >
                    <btn.icon size={18} />
                  </button>
                ))}
                <div className="w-px h-6 bg-neutral-brown-200 mx-2" />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Insert Image"
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm transition-all text-neutral-brown-600 hover:text-primary"
                >
                  <ImageIcon size={18} />
                </button>
              </div>
              
              {/* Content Area */}
              <div className="p-6">
                <textarea
                  ref={contentRef}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog post content here...

You can use Markdown formatting:
# Heading 1
## Heading 2
**bold text**
*italic text*
- bullet points
> quotes"
                  rows={20}
                  className="w-full text-neutral-brown-700 placeholder-neutral-brown-400 border-0 focus:ring-0 p-0 resize-none font-mono text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <label className="block text-sm font-medium text-neutral-brown-900 mb-3">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., Kalenjin, Culture, History, Folklore"
                className="w-full px-4 py-3 border border-neutral-brown-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.split(',').filter(t => t.trim()).map((tag, i) => (
                    <span key={i} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="bg-accent-gold/10 rounded-xl p-4">
              <h3 className="font-bold text-neutral-brown-900 mb-2">💡 Writing Tips</h3>
              <ul className="text-sm text-neutral-brown-600 space-y-1">
                <li>• Use headings to structure your content</li>
                <li>• Add a compelling cover image to attract readers</li>
                <li>• Keep paragraphs short and easy to read</li>
                <li>• Include relevant tags to help readers find your post</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
