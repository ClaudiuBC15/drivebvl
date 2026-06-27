import React, { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Unlink,
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Table as TableIcon,
  Grid3X3,
  Trash2,
  Plus,
  ArrowDown,
  ArrowRight,
  Eye,
  Edit2
} from 'lucide-react';

interface WysiwygEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function WysiwygEditor({ content, onChange }: WysiwygEditorProps) {
  const [isPreview, setIsPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4]
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-[#cc0000] underline font-medium hover:text-red-700 transition-colors'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-xl border border-slate-800 my-6 shadow-md'
        }
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-xl border border-slate-800 my-6 shadow-md'
        }
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse border border-slate-800 w-full my-6 text-sm text-left'
        }
      }),
      TableRow,
      TableCell,
      TableHeader
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-slate bg-white border border-slate-200 rounded-b-xl px-4 py-3 min-h-[350px] outline-none text-slate-800 focus:border-[#cc0000] focus:ring-1 focus:ring-red-500/10 transition-all text-sm font-light leading-relaxed'
      }
    }
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return <div className="text-slate-500 text-xs">Se încarcă editorul...</div>;
  }

  // Handle local image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/uploads', {
        method: 'POST',
        body: formData
      });
      const data = (await res.json()) as any;
      if (res.ok && data.success) {
        editor.chain().focus().setImage({ src: data.url }).run();
      } else {
        alert(data.error || 'Încărcarea a eșuat.');
      }
    } catch (err) {
      alert('Eroare la încărcarea fișierului.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Introduceți adresa URL:', previousUrl);
    
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Introduceți URL-ul videoclipului de YouTube:');
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Editor Stylesheet Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .tiptap {
          outline: none;
        }
        .tiptap p {
          margin-bottom: 1.25rem;
          font-weight: 300;
          color: #334155;
        }
        .tiptap h1, .tiptap h2, .tiptap h3, .tiptap h4 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #0f172a;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .tiptap h1 { font-size: 1.8rem; }
        .tiptap h2 { font-size: 1.5rem; border-b: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        .tiptap h3 { font-size: 1.25rem; }
        .tiptap h4 { font-size: 1.1rem; }
        .tiptap ul, .tiptap ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .tiptap ul { list-style-type: disc; }
        .tiptap ol { list-style-type: decimal; }
        .tiptap li { margin-bottom: 0.5rem; font-weight: 300; color: #334155; }
        .tiptap blockquote {
          border-left: 3px solid #cc0000;
          padding-left: 1rem;
          font-style: italic;
          color: #475569;
          margin: 1.5rem 0;
        }
        .tiptap pre {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 1rem;
          border-radius: 0.75rem;
          color: #0f172a;
          font-family: monospace;
          margin-bottom: 1.5rem;
          overflow-x: auto;
        }
        .tiptap table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5rem 0;
        }
        .tiptap th, .tiptap td {
          border: 1px solid #e2e8f0;
          padding: 0.6rem 0.8rem;
          text-align: left;
        }
        .tiptap th {
          background-color: #f1f5f9;
          font-weight: 700;
          color: #0f172a;
        }
        .tiptap img {
          max-width: 100%;
          height: auto;
          border-radius: 0.75rem;
          margin: 2rem 0;
          border: 1px solid #e2e8f0;
        }
        .tiptap a {
          color: #cc0000;
          text-decoration: underline;
          font-weight: 500;
        }
        .tiptap iframe {
          max-width: 100%;
          border-radius: 0.75rem;
        }
      `}} />

      {/* Mode Switches */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer select-none ${
              !isPreview ? 'bg-[#cc0000] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Edit2 size={13} /> Editare
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer select-none ${
              isPreview ? 'bg-[#cc0000] text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Eye size={13} /> Previzualizare
          </button>
        </div>

        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Editor WYSIWYG
        </span>
      </div>

      {isPreview ? (
        /* Preview container styling */
        <div className="bg-white text-slate-850 p-6 md:p-10 min-h-[350px] overflow-y-auto max-h-[500px]">
          <div className="prose max-w-none text-slate-700 font-light font-sans">
            <style dangerouslySetInnerHTML={{ __html: `
              .preview-prose p { margin-bottom: 1rem; line-height: 1.7; font-weight: 300; font-size: 1.05rem; }
              .preview-prose h1, .preview-prose h2, .preview-prose h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; color: #0a0a0b; margin-top: 2rem; margin-bottom: 1rem; }
              .preview-prose h1 { font-size: 2.25rem; }
              .preview-prose h2 { font-size: 1.75rem; border-b: 1px solid #f1f5f9; padding-bottom: 0.5rem; }
              .preview-prose h3 { font-size: 1.4rem; }
              .preview-prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
              .preview-prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; }
              .preview-prose li { margin-bottom: 0.5rem; font-weight: 300; }
              .preview-prose blockquote { border-left: 4px solid #cc0000; padding-left: 1.25rem; font-style: italic; color: #64748b; margin: 1.5rem 0; }
              .preview-prose table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; }
              .preview-prose th, .preview-prose td { border: 1px solid #e2e8f0; padding: 0.75rem; text-align: left; }
              .preview-prose th { background-color: #f8fafc; font-weight: 700; color: #0a0a0b; }
              .preview-prose img { max-width: 100%; height: auto; rounded: 12px; margin: 2rem 0; border: 1px solid #f1f5f9; }
              .preview-prose a { color: #cc0000; text-decoration: underline; font-weight: 500; }
            `}} />
            <div className="preview-prose" dangerouslySetInnerHTML={{ __html: editor.getHTML() }} />
          </div>
        </div>
      ) : (
        <div>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-50 border-b border-slate-200 p-2 text-slate-600">
            {/* Formatting */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('bold') ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Bold"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('italic') ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Italic"
            >
              <Italic size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('underline') ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Underline"
            >
              <UnderlineIcon size={14} />
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1"></div>

            {/* Headings */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Heading 1"
            >
              <Heading1 size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Heading 2"
            >
              <Heading2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Heading 3"
            >
              <Heading3 size={14} />
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1"></div>

            {/* Lists */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('bulletList') ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Listă Simplă"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('orderedList') ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Listă Numerotată"
            >
              <ListOrdered size={14} />
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1"></div>

            {/* Quote and Code */}
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('blockquote') ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Citat"
            >
              <Quote size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('codeBlock') ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Bloc de Cod"
            >
              <Code size={14} />
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1"></div>

            {/* Links */}
            <button
              type="button"
              onClick={addLink}
              className={`p-2 rounded-lg hover:bg-slate-200 hover:text-slate-800 transition-all ${editor.isActive('link') ? 'bg-slate-200 text-slate-850 font-bold' : ''}`}
              title="Inserează Link"
            >
              <Link2 size={14} />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive('link')}
              className="p-2 rounded-lg hover:bg-slate-200 hover:text-slate-850 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
              title="Elimină Link"
            >
              <Unlink size={14} />
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1"></div>

            {/* Media embeds */}
            <button
              type="button"
              onClick={triggerUpload}
              disabled={uploading}
              className="p-2 rounded-lg hover:bg-slate-200 hover:text-slate-850 transition-all flex items-center gap-1 text-[11px] font-bold"
              title="Încarcă Imagine Locală"
            >
              <ImageIcon size={14} />
              <span>{uploading ? 'Se încarcă...' : 'Foto'}</span>
            </button>

            <button
              type="button"
              onClick={addYoutubeVideo}
              className="p-2 rounded-lg hover:bg-slate-200 hover:text-slate-850 transition-all flex items-center gap-1 text-[11px] font-bold"
              title="Inserează Video YouTube"
            >
              <YoutubeIcon size={14} className="text-[#cc0000]" />
              <span>YouTube</span>
            </button>

            <div className="w-px h-5 bg-slate-200 mx-1"></div>

            {/* Table controls */}
            <button
              type="button"
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              className="p-2 rounded-lg hover:bg-slate-200 hover:text-slate-850 transition-all flex items-center gap-1 text-[11px] font-bold"
              title="Inserează Tabel"
            >
              <Grid3X3 size={14} />
              <span>Tabel</span>
            </button>

            {editor.isActive('table') && (
              <div className="flex items-center gap-0.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="p-1 text-[10px] hover:bg-slate-200 text-slate-700 font-bold flex items-center rounded"
                  title="Adaugă Coloană la Dreapta"
                >
                  <Plus size={10} /><ArrowRight size={10} />Col
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="p-1 text-[10px] hover:bg-slate-200 text-slate-700 font-bold flex items-center rounded"
                  title="Adaugă Rând Jos"
                >
                  <Plus size={10} /><ArrowDown size={10} />Rând
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="p-1 text-[10px] hover:bg-slate-200 text-red-500 font-bold flex items-center rounded"
                  title="Șterge Coloana"
                >
                  <Trash2 size={10} />Col
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="p-1 text-[10px] hover:bg-slate-200 text-red-500 font-bold flex items-center rounded"
                  title="Șterge Rândul"
                >
                  <Trash2 size={10} />Rând
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="p-1 text-[10px] hover:bg-slate-200 text-red-600 font-bold flex items-center rounded"
                  title="Șterge Tabelul"
                >
                  <Trash2 size={10} />Tabel
                </button>
              </div>
            )}
          </div>

          <EditorContent editor={editor} />
        </div>
      )}
    </div>
  );
}
