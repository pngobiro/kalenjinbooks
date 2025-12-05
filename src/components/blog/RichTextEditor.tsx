'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
    Youtube as YoutubeIcon
} from 'lucide-react';
import { useCallback, useEffect } from 'react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    onImageUpload?: (file: File) => Promise<string>;
    placeholder?: string;
}

export default function RichTextEditor({
    content,
    onChange,
    onImageUpload,
    placeholder = 'Start writing your blog post...'
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary hover:underline',
                },
            }),
            Youtube.configure({
                width: 640,
                height: 360,
                HTMLAttributes: {
                    class: 'rounded-lg mx-auto',
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] max-w-none p-4',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    const addImage = useCallback(async () => {
        if (!onImageUpload) {
            const url = window.prompt('Enter image URL:');
            if (url) {
                editor?.chain().focus().setImage({ src: url }).run();
            }
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                try {
                    const url = await onImageUpload(file);
                    editor?.chain().focus().setImage({ src: url }).run();
                } catch (error) {
                    console.error('Image upload failed:', error);
                    alert('Failed to upload image');
                }
            }
        };
        input.click();
    }, [editor, onImageUpload]);

    const addLink = useCallback(() => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    const addYouTube = useCallback(() => {
        const url = window.prompt('Enter YouTube URL:');
        if (url) {
            editor?.chain().focus().setYoutubeVideo({ src: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border-2 border-neutral-brown-500/20 rounded-lg overflow-hidden bg-white">
            {/* Toolbar */}
            <div className="border-b border-neutral-brown-500/20 p-2 flex flex-wrap gap-1 bg-neutral-cream">
                {/* Text Formatting */}
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('bold') ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Bold"
                >
                    <Bold size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('italic') ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Italic"
                >
                    <Italic size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('strike') ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Strikethrough"
                >
                    <Strikethrough size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('code') ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Code"
                >
                    <Code size={18} />
                </button>

                <div className="w-px h-6 bg-neutral-brown-500/20 mx-1" />

                {/* Headings */}
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Heading 1"
                >
                    <Heading1 size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Heading 2"
                >
                    <Heading2 size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Heading 3"
                >
                    <Heading3 size={18} />
                </button>

                <div className="w-px h-6 bg-neutral-brown-500/20 mx-1" />

                {/* Lists */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('bulletList') ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Bullet List"
                >
                    <List size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('orderedList') ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Numbered List"
                >
                    <ListOrdered size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('blockquote') ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Quote"
                >
                    <Quote size={18} />
                </button>

                <div className="w-px h-6 bg-neutral-brown-500/20 mx-1" />

                {/* Media */}
                <button
                    onClick={addImage}
                    className="p-2 rounded hover:bg-primary/10 transition-colors text-neutral-brown-700"
                    title="Add Image"
                >
                    <ImageIcon size={18} />
                </button>
                <button
                    onClick={addLink}
                    className={`p-2 rounded hover:bg-primary/10 transition-colors ${editor.isActive('link') ? 'bg-primary/20 text-primary' : 'text-neutral-brown-700'
                        }`}
                    title="Add Link"
                >
                    <LinkIcon size={18} />
                </button>
                <button
                    onClick={addYouTube}
                    className="p-2 rounded hover:bg-primary/10 transition-colors text-neutral-brown-700"
                    title="Embed YouTube"
                >
                    <YoutubeIcon size={18} />
                </button>

                <div className="w-px h-6 bg-neutral-brown-500/20 mx-1" />

                {/* Undo/Redo */}
                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    className="p-2 rounded hover:bg-primary/10 transition-colors text-neutral-brown-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Undo"
                >
                    <Undo size={18} />
                </button>
                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    className="p-2 rounded hover:bg-primary/10 transition-colors text-neutral-brown-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Redo"
                >
                    <Redo size={18} />
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />

            {/* Character Count */}
            <div className="border-t border-neutral-brown-500/20 px-4 py-2 text-sm text-neutral-brown-700 bg-neutral-cream">
                {editor.storage.characterCount?.characters() || 0} characters
            </div>
        </div>
    );
}
