import React, { useState } from 'react';
import { Plus, Trash2, Save, X, Image as ImageIcon, Edit2 } from 'lucide-react';

interface GalleryImage {
  id: number;
  image_url: string;
  album: string;
  caption: string;
  sort_order: number;
  created_at: string;
  media_type: string;
  video_url: string | null;
  layout_size: string;
  object_position?: string;
}

interface GalleryManagerProps {
  initialImages: GalleryImage[];
}

export default function GalleryManager({ initialImages }: GalleryManagerProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);

  // Add / Edit image state
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    image_url: '',
    album: 'cursanti',
    caption: '',
    sort_order: 0,
    media_type: 'image',
    video_url: '',
    layout_size: 'normal',
    object_position: 'center'
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

  const handleOpenNew = () => {
    setForm({
      image_url: '',
      album: 'cursanti',
      caption: '',
      sort_order: 0,
      media_type: 'image',
      video_url: '',
      layout_size: 'normal',
      object_position: 'center'
    });
    setEditingId(null);
    setShowAdd(true);
    setError('');
  };

  const handleOpenEdit = (img: GalleryImage) => {
    setForm({
      image_url: img.image_url || '',
      album: img.album || 'cursanti',
      caption: img.caption || '',
      sort_order: img.sort_order || 0,
      media_type: img.media_type || 'image',
      video_url: img.video_url || '',
      layout_size: img.layout_size || 'normal',
      object_position: img.object_position || 'center'
    });
    setEditingId(img.id);
    setShowAdd(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) {
      setError('URL-ul imaginii este obligatoriu.');
      return;
    }
    if (form.media_type === 'video' && !form.video_url) {
      setError('URL-ul videoclipului este obligatoriu dacă tipul este Video.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = editingId ? `/api/gallery/${editingId}` : '/api/gallery';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = (await res.json()) as any;

      if (res.ok && data.success) {
        // Refresh local list
        const refreshedRes = await fetch('/api/gallery');
        const refreshedData = (await refreshedRes.json()) as any;
        if (refreshedData.success) {
          setImages(refreshedData.images);
        }
        setShowAdd(false);
        setEditingId(null);
        setForm({
          image_url: '',
          album: 'cursanti',
          caption: '',
          sort_order: 0,
          media_type: 'image',
          video_url: '',
          layout_size: 'normal',
          object_position: 'center'
        });
      } else {
        setError(data.error || 'Eroare la salvarea imaginii.');
      }
    } catch (err) {
      setError('Eroare rețea la salvare.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ești sigur că vrei să ștergi această imagine/video din galerie?')) return;
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
      }
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  return (
    <div className="space-y-6">

      {/* Top action */}
      {!showAdd && (
        <div className="flex items-center justify-end">
          <button
            onClick={handleOpenNew}
            className="flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-xs cursor-pointer select-none"
          >
            <Plus size={14} />
            Adaugă în Galerie
          </button>
        </div>
      )}

      {/* Add / Edit Form */}
      {showAdd && (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] max-w-xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={18} className="text-[#cc0000]" /> {editingId ? 'Editează Media din Galerie' : 'Adaugă Media în Galerie'}
            </h4>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setEditingId(null); }}
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

          <div className="space-y-4">
            {/* Tip Media Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Tip Media</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="media_type"
                    value="image"
                    checked={form.media_type === 'image'}
                    onChange={() => setForm(prev => ({ ...prev, media_type: 'image', video_url: '' }))}
                    className="text-[#cc0000] focus:ring-[#cc0000]"
                  />
                  Imagine
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="media_type"
                    value="video"
                    checked={form.media_type === 'video'}
                    onChange={() => setForm(prev => ({ ...prev, media_type: 'video' }))}
                    className="text-[#cc0000] focus:ring-[#cc0000]"
                  />
                  Video
                </label>
              </div>
            </div>

            {/* Thumbnail / Image selection */}
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">
                {form.media_type === 'video' ? 'Copertă / Thumbnail Video' : 'Selectează Imagine'}
              </label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    required
                    className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                    placeholder="URL Imagine sau încarcă..."
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs uppercase cursor-pointer transition-all select-none shrink-0 border border-slate-200/60">
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
                    <img 
                      src={form.image_url} 
                      className="w-full h-full object-cover" 
                      style={{ objectPosition: form.object_position || 'center' }}
                      alt="Preview" 
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Video URL (Only if Video selected) */}
            {form.media_type === 'video' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">URL Clipurilor Video (YouTube / Link direct MP4)</label>
                <input
                  type="text"
                  value={form.video_url}
                  onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                />
              </div>
            )}

            {/* Dropdowns for Album, Position and Sizing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-2">Categorie (Album)</label>
                <select
                  value={form.album}
                  onChange={(e) => setForm(prev => ({ ...prev, album: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-[#cc0000] transition-all outline-none text-sm cursor-pointer"
                >
                  <option value="cursanti">Cursanți</option>
                  <option value="instructori">Instructori</option>
                  <option value="masini">Mașini</option>
                  <option value="evenimente">Evenimente</option>
                  <option value="examene">Examene</option>
                  <option value="altele">Altele</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-2">Aliniere (Focus)</label>
                <select
                  value={form.object_position}
                  onChange={(e) => setForm(prev => ({ ...prev, object_position: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-[#cc0000] transition-all outline-none text-sm cursor-pointer"
                >
                  <option value="center">Centru (Normal)</option>
                  <option value="top">Sus (Pentru oameni)</option>
                  <option value="bottom">Jos</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-2">Layout Grid</label>
                <select
                  value={form.layout_size}
                  onChange={(e) => setForm(prev => ({ ...prev, layout_size: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-[#cc0000] transition-all outline-none text-sm cursor-pointer"
                >
                  <option value="normal">Normal (1x1)</option>
                  <option value="wide">Lat (2x1)</option>
                  <option value="tall">Înalt (1x2)</option>
                  <option value="large">Mare (2x2)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Descriere Scurtă (Caption)</label>
                <input
                  type="text"
                  value={form.caption}
                  onChange={(e) => setForm(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: Absolvent Start Drive"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Ordine de afișare</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-450 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => { setShowAdd(false); setEditingId(null); }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 font-bold rounded-xl text-xs uppercase transition-all border border-slate-200"
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
                  {editingId ? 'Salvează modificările' : 'Adaugă în Galerie'}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Grid of gallery previews */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div key={img.id} className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden relative group shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="aspect-square w-full overflow-hidden relative bg-slate-100">
              <img 
                src={img.image_url} 
                alt={img.caption} 
                className="w-full h-full object-cover" 
                style={{ objectPosition: img.object_position || 'center' }} 
              />
              {/* Play badge for videos */}
              {img.media_type === 'video' && (
                <div className="absolute top-2 left-2 bg-emerald-500 text-white p-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Video
                </div>
              )}
              {/* Size and alignment badge */}
              <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                <div className="bg-slate-800/85 backdrop-blur-md text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                  {img.layout_size === 'normal' && '1x1'}
                  {img.layout_size === 'wide' && '2x1'}
                  {img.layout_size === 'tall' && '1x2'}
                  {img.layout_size === 'large' && '2x2'}
                </div>
                {img.object_position && img.object_position !== 'center' && (
                  <div className="bg-red-800/85 backdrop-blur-md text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider">
                    Focus: {img.object_position === 'top' ? 'Sus' : 'Jos'}
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                <button
                  onClick={() => handleOpenEdit(img)}
                  title="Editează media"
                  className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-[#cc0000] hover:text-white rounded-full transition-all"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  title="Șterge media"
                  className="p-2.5 bg-red-50 border border-red-200 text-[#cc0000] hover:bg-[#cc0000] hover:text-white rounded-full transition-all"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-slate-700 font-bold truncate max-w-[100px]" title={img.caption}>{img.caption || '(Fără text)'}</span>
                <span className="text-[9px] text-slate-450 font-bold">Ord: {img.sort_order}</span>
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400 uppercase tracking-wider font-semibold">
                <span>Cat: {img.album}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
