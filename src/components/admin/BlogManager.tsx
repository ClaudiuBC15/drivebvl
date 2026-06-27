import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Search, X, Check, Save } from 'lucide-react';
import DataTable from './DataTable';
import WysiwygEditor from './WysiwygEditor';

interface Article {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  image_url: string;
  seo_title: string;
  seo_description: string;
  status: 'draft' | 'published';
  author: string;
  created_at: string;
  updated_at: string;
}

interface BlogManagerProps {
  initialArticles: Article[];
}

export default function BlogManager({ initialArticles }: BlogManagerProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('toate');

  // Editor states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // null means new article
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'SFATURI',
    excerpt: '',
    content: '',
    image_url: '',
    seo_title: '',
    seo_description: '',
    status: 'draft' as 'draft' | 'published'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: string) => {
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
        setForm(prev => ({ ...prev, [targetField]: data.url }));
      } else {
        alert(data.error || 'Încărcarea a eșuat.');
      }
    } catch (err) {
      alert('Eroare la încărcarea fișierului.');
    } finally {
      setUploading(false);
    }
  };

  // Extract unique categories
  const categories = ['toate', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean)))];

  const handleOpenNew = () => {
    setForm({
      title: '',
      slug: '',
      category: 'SFATURI',
      excerpt: '',
      content: '',
      image_url: '',
      seo_title: '',
      seo_description: '',
      status: 'draft'
    });
    setEditingId(null);
    setIsEditing(true);
    setError('');
  };

  const mdToHtml = (md: string) => {
    if (!md) return '';
    if (md.trim().startsWith('<')) return md;

    return md
      .split(/\n\n+/)
      .map(para => {
        const trimmed = para.trim();
        if (!trimmed) return '';

        if (trimmed.startsWith('### ')) {
          return `<h3>${trimmed.substring(4)}</h3>`;
        }
        if (trimmed.startsWith('## ')) {
          return `<h2>${trimmed.substring(3)}</h2>`;
        }
        if (trimmed.startsWith('# ')) {
          return `<h1>${trimmed.substring(2)}</h1>`;
        }

        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').map(item => {
            const itemText = item.replace(/^[-*]\s+/, '');
            return `<li>${itemText}</li>`;
          }).join('');
          return `<ul>${items}</ul>`;
        }

        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split('\n').map(item => {
            const itemText = item.replace(/^\d+\.\s+/, '');
            return `<li>${itemText}</li>`;
          }).join('');
          return `<ol>${items}</ol>`;
        }

        let html = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

        return `<p>${html}</p>`;
      })
      .filter(Boolean)
      .join('\n');
  };

  const handleOpenEdit = (article: Article) => {
    setForm({
      title: article.title || '',
      slug: article.slug || '',
      category: article.category || 'SFATURI',
      excerpt: article.excerpt || '',
      content: mdToHtml(article.content || ''),
      image_url: article.image_url || '',
      seo_title: article.seo_title || '',
      seo_description: article.seo_description || '',
      status: article.status || 'draft'
    });
    setEditingId(article.id);
    setIsEditing(true);
    setError('');
  };

  const handleTitleChange = (title: string) => {
    // Generate slug from title automatically if it's a new article
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setForm(prev => ({
      ...prev,
      title,
      slug: prev.slug && editingId !== null ? prev.slug : generatedSlug
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.slug || !form.content) {
      setError('Titlul, slug-ul și conținutul sunt obligatorii.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = editingId ? `/api/blog/${editingId}` : '/api/blog';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = (await res.json()) as any;

      if (res.ok && data.success) {
        // Refresh articles list
        const refreshedRes = await fetch('/api/blog');
        const refreshedData = (await refreshedRes.json()) as any;
        if (refreshedData.success) {
          setArticles(refreshedData.articles);
        }
        setIsEditing(false);
      } else {
        setError(data.error || 'A apărut o eroare la salvare.');
      }
    } catch (err) {
      setError('A apărut o eroare la salvare. Verifică rețeaua.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ești sigur că vrei să ștergi acest articol? Această acțiune este ireversibilă.')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Error deleting article:', err);
    }
  };

  // Filter list
  const filteredArticles = articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) ||
      (art.excerpt && art.excerpt.toLowerCase().includes(search.toLowerCase())) ||
      (art.content && art.content.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'toate' || art.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const cleanStr = dateStr.includes(' ') && !dateStr.includes('T') ? dateStr.replace(' ', 'T') : dateStr;
      const date = new Date(cleanStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Show filter when not in editor */}
      {!isEditing && (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search bar */}
            <div className="relative w-full sm:w-60">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="Caută articole..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 placeholder-slate-400 text-xs focus:border-[#cc0000] focus:ring-4 focus:ring-red-500/5 transition-all outline-none"
              />
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600 text-xs focus:border-[#cc0000] focus:ring-4 focus:ring-red-500/5 transition-all outline-none cursor-pointer uppercase font-bold"
            >
              <option value="toate">Toate Categoriile</option>
              {categories.filter(c => c !== 'toate').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenNew}
            className="flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-xs w-full sm:w-auto cursor-pointer select-none"
          >
            <Plus size={14} />
            Adaugă Articol
          </button>
        </div>
      )}

      {/* Grid of Articles List / Editor Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] max-w-4xl">

          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
              {editingId ? 'Editează Articol' : 'Articol Nou'}
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-50 border border-slate-200"
            >
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-650 text-xs font-semibold p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Title, Slug & Category */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Titlu Articol</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: Cum să te pregătești pentru examenul practic"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Categorie</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 focus:border-[#cc0000] transition-all outline-none text-sm cursor-pointer"
                >
                  <option value="SFATURI">SFATURI</option>
                  <option value="LEGISLAȚIE">LEGISLAȚIE</option>
                  <option value="NOUTĂȚI AUTO">NOUTĂȚI AUTO</option>
                  <option value="EXAMENE">EXAMENE</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">URL Slug (pentru SEO / Link-uri)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-755 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="cum-sa-te-pregatesti-pentru-examen"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Imagine Copertă</label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={form.image_url}
                      onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                      className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                      placeholder="URL Imagine sau încarcă..."
                    />
                    <label className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold py-3 px-4 rounded-xl text-xs uppercase cursor-pointer transition-all select-none shrink-0 border border-slate-200/60">
                      {uploading ? 'Incarcă...' : 'Alege Fișier'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'image_url')}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {form.image_url && (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={form.image_url} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Rezumat scurt (Excerpt)</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-755 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light resize-none"
                placeholder="O scurtă descriere a articolului care va apărea în paginile de listare..."
              ></textarea>
            </div>

            {/* Content (WYSIWYG editor) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Conținut Articol</label>
                <span className="text-[10px] text-slate-400 font-light">Editează articolul în mod vizual, adaugă subtitluri, liste, tabele și imagini.</span>
              </div>
              <WysiwygEditor
                content={form.content}
                onChange={(html) => setForm(prev => ({ ...prev, content: html }))}
              />
            </div>

            {/* SEO Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h5 className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5">
                Optimizări Avansate SEO / AEO
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-2">Titlu SEO (Meta Title)</label>
                  <input
                    type="text"
                    value={form.seo_title}
                    onChange={(e) => setForm(prev => ({ ...prev, seo_title: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-755 placeholder-slate-400 text-xs focus:border-[#cc0000] transition-all outline-none font-light"
                    placeholder="Implicit folosește titlul articolului"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-2">Descriere SEO (Meta Description)</label>
                  <input
                    type="text"
                    value={form.seo_description}
                    onChange={(e) => setForm(prev => ({ ...prev, seo_description: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-755 placeholder-slate-400 text-xs focus:border-[#cc0000] transition-all outline-none font-light"
                    placeholder="Scurt rezumat pentru motoarele de căutare"
                  />
                </div>
              </div>
            </div>

            {/* Status & Submit buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6">
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Status articol:</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-700 text-xs focus:border-[#cc0000] transition-all outline-none cursor-pointer uppercase font-bold"
                >
                  <option value="draft">DRAFT (Ascuns)</option>
                  <option value="published">PUBLISHED (Publicat)</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-655 font-bold rounded-xl text-xs uppercase transition-all border border-slate-200"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 bg-[#cc0000] hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase shadow-md select-none cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border border-white border-t-transparent animate-spin"></div>
                      Se salvează...
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      Salvează Articol
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </form>
      ) : (
        <DataTable
          headers={['Titlu Articol', 'Categorie', 'Data Creării', 'Status', 'Acțiuni']}
          emptyMessage="Nu s-au găsit articole în baza de date conform filtrelor alese."
        >
          {filteredArticles.map((art) => (
            <tr key={art.id} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-6 py-4.5">
                <div className="font-bold text-slate-800 leading-snug">{art.title}</div>
                <div className="text-[11px] text-slate-450 font-light mt-1">/{art.slug}</div>
              </td>
              <td className="px-6 py-4.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  {art.category || 'SFATURI'}
                </span>
              </td>
              <td className="px-6 py-4.5 text-xs text-slate-450 font-normal">
                {formatDate(art.created_at)}
              </td>
              <td className="px-6 py-4.5">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${art.status === 'published'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                  {art.status === 'published' ? 'published' : 'draft'}
                </span>
              </td>
              <td className="px-6 py-4.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(art)}
                    title="Editează"
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-xl transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id)}
                    title="Șterge"
                    className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-[#cc0000] border border-slate-200 hover:border-red-100 rounded-xl transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

    </div>
  );
}
