import React, { useState } from 'react';
import { Edit3, X, Save, Sparkles } from 'lucide-react';
import DataTable from './DataTable';

interface Category {
  id: string;
  name: string;
  slug: string;
  hero_title: string;
  hero_subtitle: string;
  description: string;
  what_you_can_drive: string;
  conditions: string;
  documents: string;
  duration_info: string;
  info_note: string;
  image_url: string;
  seo_title: string;
  seo_description: string;
  graduate_images?: string;
}

interface CategoryManagerProps {
  initialCategories: Category[];
}

export default function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Editor form
  const [form, setForm] = useState({
    hero_title: '',
    hero_subtitle: '',
    description: '',
    what_you_can_drive: '',
    conditions: '',
    documents: '',
    duration_info: '',
    info_note: '',
    image_url: '',
    seo_title: '',
    seo_description: '',
    graduate_images: [] as string[]
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

  const handleGraduateFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/uploads', {
          method: 'POST',
          body: formData
        });
        const data = (await res.json()) as any;
        if (res.ok && data.success) {
          uploadedUrls.push(data.url);
        } else {
          alert(data.error || `Încărcarea fișierului ${file.name} a eșuat.`);
        }
      }
      if (uploadedUrls.length > 0) {
        setForm(prev => ({
          ...prev,
          graduate_images: [...prev.graduate_images, ...uploadedUrls]
        }));
      }
    } catch (err) {
      alert('Eroare la încărcarea fișierelor.');
    } finally {
      setUploading(false);
    }
  };

  const parseJsonArrayToText = (jsonStr: string) => {
    if (!jsonStr) return '';
    try {
      const arr = JSON.parse(jsonStr);
      if (Array.isArray(arr)) {
        return arr.join('\n');
      }
      return jsonStr;
    } catch {
      return jsonStr;
    }
  };

  const serializeTextToJsonArray = (text: string) => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const handleOpenEdit = (cat: Category) => {
    let grads: string[] = [];
    if (cat.graduate_images) {
      try {
        grads = JSON.parse(cat.graduate_images);
        if (!Array.isArray(grads)) grads = [];
      } catch {
        grads = [];
      }
    }

    setForm({
      hero_title: cat.hero_title || '',
      hero_subtitle: cat.hero_subtitle || '',
      description: parseJsonArrayToText(cat.description),
      what_you_can_drive: parseJsonArrayToText(cat.what_you_can_drive),
      conditions: parseJsonArrayToText(cat.conditions),
      documents: parseJsonArrayToText(cat.documents),
      duration_info: cat.duration_info || '',
      info_note: cat.info_note || '',
      image_url: cat.image_url || '',
      seo_title: cat.seo_title || '',
      seo_description: cat.seo_description || '',
      graduate_images: grads
    });
    setEditingId(cat.id);
    setIsEditing(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      hero_title: form.hero_title,
      hero_subtitle: form.hero_subtitle,
      description: serializeTextToJsonArray(form.description),
      what_you_can_drive: serializeTextToJsonArray(form.what_you_can_drive),
      conditions: serializeTextToJsonArray(form.conditions),
      documents: serializeTextToJsonArray(form.documents),
      duration_info: form.duration_info,
      info_note: form.info_note,
      graduate_images: form.graduate_images,
      image_url: form.image_url,
      seo_title: form.seo_title,
      seo_description: form.seo_description
    };

    try {
      const res = await fetch(`/api/categories/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as any;

      if (res.ok && data.success) {
        // Refresh local categories list
        setCategories(prev => 
          prev.map(cat => 
            cat.id === editingId 
              ? { 
                  ...cat, 
                  hero_title: form.hero_title,
                  hero_subtitle: form.hero_subtitle,
                  description: JSON.stringify(payload.description),
                  what_you_can_drive: JSON.stringify(payload.what_you_can_drive),
                  conditions: JSON.stringify(payload.conditions),
                  documents: JSON.stringify(payload.documents),
                  duration_info: form.duration_info,
                  info_note: form.info_note,
                  graduate_images: JSON.stringify(form.graduate_images),
                  image_url: form.image_url,
                  seo_title: form.seo_title,
                  seo_description: form.seo_description
                }
              : cat
          )
        );
        setIsEditing(false);
      } else {
        setError(data.error || 'Eroare la salvare.');
      }
    } catch (err) {
      setError('Eroare rețea la salvare.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] max-w-4xl">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              Editează Conținut: <span className="text-[#cc0000]">{categories.find(c => c.id === editingId)?.name}</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-2 text-slate-450 hover:text-slate-700 rounded-xl bg-slate-50 border border-slate-200"
            >
              <X size={16} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-650 text-xs font-semibold p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Hero Section settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Titlu Hero (H1)</label>
              <input
                type="text"
                value={form.hero_title}
                onChange={(e) => setForm(prev => ({ ...prev, hero_title: e.target.value }))}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                placeholder="Ex: Permis Categoria B Suceava"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Subtitlu Hero</label>
              <input
                type="text"
                value={form.hero_subtitle}
                onChange={(e) => setForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                placeholder="Ex: Autoturisme — cel mai popular curs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Imagine Reprezentativă</label>
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
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Durată Curs / Info Ore Conducere</label>
              <input
                type="text"
                value={form.duration_info}
                onChange={(e) => setForm(prev => ({ ...prev, duration_info: e.target.value }))}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-755 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                placeholder="Cursul durează cel puțin 4 săptămâni..."
              />
            </div>
          </div>

          {/* Description Paragraphs (Newline Separated) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider">Paragrafe Descriere (Scrie fiecare paragraf pe un rând nou)</label>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light leading-relaxed resize-none"
              placeholder="Paragraf 1...&#10;Paragraf 2..."
            ></textarea>
          </div>

          {/* Arrays fields: Can drive, Conditions, Documents (Newline Separated) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-2">Ce poți conduce (Rând nou per vehicul)</label>
              <textarea
                value={form.what_you_can_drive}
                onChange={(e) => setForm(prev => ({ ...prev, what_you_can_drive: e.target.value }))}
                rows={5}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-xs font-light resize-none leading-relaxed"
                placeholder="Autoturisme cu masa max 3500kg&#10;Remorcă max 750kg"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-2">Condiții înscriere (Rând nou per condiție)</label>
              <textarea
                value={form.conditions}
                onChange={(e) => setForm(prev => ({ ...prev, conditions: e.target.value }))}
                rows={5}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-xs font-light resize-none leading-relaxed"
                placeholder="Vârsta minimă: 18 ani fără trei luni&#10;Aviz medical"
              ></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-455 uppercase tracking-wider mb-2">Acte dosar (Rând nou per act)</label>
              <textarea
                value={form.documents}
                onChange={(e) => setForm(prev => ({ ...prev, documents: e.target.value }))}
                rows={5}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-xs font-light resize-none leading-relaxed"
                placeholder="Copie carte de identitate&#10;Cazier judiciar"
              ></textarea>
            </div>
          </div>

          {/* Info note */}
          <div>
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Notă suplimentară de informare (Caseta roșie/important)</label>
            <input
              type="text"
              value={form.info_note}
              onChange={(e) => setForm(prev => ({ ...prev, info_note: e.target.value }))}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-755 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
              placeholder="Ex: Cursul durează minim 4 săptămâni, cuprinde 24 ore legislație..."
            />
          </div>

          {/* SEO Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <h5 className="text-xs font-bold text-slate-750 uppercase tracking-wider flex items-center gap-1.5">
              Configurări SEO / AEO / GEO Categorie Auto
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-2">Titlu SEO (Meta Title)</label>
                <input
                  type="text"
                  value={form.seo_title}
                  onChange={(e) => setForm(prev => ({ ...prev, seo_title: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-750 placeholder-slate-400 text-xs focus:border-[#cc0000] transition-all outline-none font-light"
                  placeholder="Ex: Categoria B Suceava — Școala Start Drive"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-450 uppercase tracking-wider mb-2">Descriere SEO (Meta Description)</label>
                <input
                  type="text"
                  value={form.seo_description}
                  onChange={(e) => setForm(prev => ({ ...prev, seo_description: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-750 placeholder-slate-400 text-xs focus:border-[#cc0000] transition-all outline-none font-light"
                  placeholder="Scurtă descriere a categoriei auto cu cuvinte cheie locale"
                />
              </div>
            </div>
          </div>

          {/* Poze Absolvenți */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-xs font-bold text-slate-750 uppercase tracking-wider">
                  Poze Absolvenți Reușiți
                </h5>
                <p className="text-[10px] text-slate-450 font-normal mt-0.5">
                  Adaugă fotografii cu elevii care au absolvit cu succes această categorie. Se pot selecta și încărca mai multe poze simultan.
                </p>
              </div>
              <label className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold py-2 px-4 rounded-xl text-xs uppercase cursor-pointer transition-all select-none shrink-0 flex items-center gap-1.5 border border-slate-200/60">
                {uploading ? 'Se încarcă...' : 'Încarcă Poze'}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleGraduateFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {form.graduate_images.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-450 text-xs font-light bg-white">
                Nicio poză adăugată încă. Încarcă imagini folosind butonul de mai sus.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {form.graduate_images.map((imgUrl, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={imgUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setForm(prev => ({
                            ...prev,
                            graduate_images: prev.graduate_images.filter((_, i) => i !== index)
                          }));
                        }}
                        className="p-2 bg-red-650 hover:bg-red-750 text-white rounded-lg transition-colors cursor-pointer"
                        title="Șterge imaginea"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="absolute bottom-1 left-1 bg-black/75 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-200">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
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
                  Salvează Categorie
                </>
              )}
            </button>
          </div>

        </form>
      ) : (
        <DataTable 
          headers={['Cod', 'Nume Categorie', 'Hero H1', 'Preț', 'Acțiuni']}
        >
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-6 py-4.5">
                <span className="inline-flex items-center px-3 py-1 rounded text-xs font-black bg-red-50 text-[#cc0000] border border-red-100 uppercase tracking-wider">
                  {cat.id}
                </span>
              </td>
              <td className="px-6 py-4.5 font-bold text-slate-800">
                {cat.name}
              </td>
              <td className="px-6 py-4.5 text-slate-500 font-light max-w-xs truncate">
                {cat.hero_title || 'N/A'}
              </td>
              <td className="px-6 py-4.5">
                <span className="text-xs font-semibold text-slate-400 italic">"Contactează-ne" (Regulă site)</span>
              </td>
              <td className="px-6 py-4.5">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  title="Editează conținut"
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all"
                >
                  <Edit3 size={12} />
                  Editează
                </button>
              </td>
            </tr>
          ))}
        </DataTable>
      )}

    </div>
  );
}
