import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, Users } from 'lucide-react';
import DataTable from './DataTable';

interface Instructor {
  id: number;
  name: string;
  role: string;
  categories: string;
  experience: string;
  hours: string;
  students: string;
  tags: string; // JSON string
  image_url: string;
  sort_order: number;
}

interface InstructorManagerProps {
  initialInstructors: Instructor[];
}

export default function InstructorManager({ initialInstructors }: InstructorManagerProps) {
  const [instructors, setInstructors] = useState<Instructor[]>(initialInstructors);
  
  // Editor form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    role: 'Instructor Auto',
    categories: 'B',
    experience: '5+ ani',
    hours: '500+',
    students: '100+',
    tags: '', // newline separated in editor
    image_url: '',
    sort_order: 0
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

  const parseTagsToText = (jsonStr: string) => {
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

  const serializeTextToTags = (text: string) => {
    return text
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);
  };

  const handleOpenNew = () => {
    setForm({
      name: '',
      role: 'Instructor Auto & Profesor Legislație',
      categories: 'B',
      experience: '5+ ani',
      hours: '500+',
      students: '100+',
      tags: 'Expert legislatie\nProgram flexibil',
      image_url: '',
      sort_order: 0
    });
    setEditingId(null);
    setIsEditing(true);
    setError('');
  };

  const handleOpenEdit = (inst: Instructor) => {
    setForm({
      name: inst.name || '',
      role: inst.role || '',
      categories: inst.categories || '',
      experience: inst.experience || '',
      hours: inst.hours || '',
      students: inst.students || '',
      tags: parseTagsToText(inst.tags),
      image_url: inst.image_url || '',
      sort_order: inst.sort_order || 0
    });
    setEditingId(inst.id);
    setIsEditing(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      setError('Numele este obligatoriu.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: form.name,
      role: form.role,
      categories: form.categories,
      experience: form.experience,
      hours: form.hours,
      students: form.students,
      tags: serializeTextToTags(form.tags),
      image_url: form.image_url,
      sort_order: form.sort_order
    };

    try {
      const url = editingId ? `/api/instructors/${editingId}` : '/api/instructors';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as any;

      if (res.ok && data.success) {
        // Refresh local list
        const refreshedRes = await fetch('/api/instructors');
        const refreshedData = (await refreshedRes.json()) as any;
        if (refreshedData.success) {
          setInstructors(refreshedData.instructors);
        }
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

  const handleDelete = async (id: number) => {
    if (!confirm('Ești sigur că vrei să ștergi acest instructor?')) return;
    try {
      const res = await fetch(`/api/instructors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setInstructors(prev => prev.filter(inst => inst.id !== id));
      }
    } catch (err) {
      console.error('Error deleting instructor:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Action button */}
      {!isEditing && (
        <div className="flex items-center justify-end">
          <button
            onClick={handleOpenNew}
            className="flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-xs cursor-pointer select-none"
          >
            <Plus size={14} />
            Adaugă Instructor
          </button>
        </div>
      )}

      {/* Editor / Table */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] max-w-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Users size={18} className="text-[#cc0000]" /> {editingId ? 'Editează Instructor' : 'Instructor Nou'}
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

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Nume Complet</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: Popescu Ion"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Rol / Ocupație</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: Instructor Auto & Profesor Legislație"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Categorii Acreditate (Separate prin virgulă)</label>
                <input
                  type="text"
                  value={form.categories}
                  onChange={(e) => setForm(prev => ({ ...prev, categories: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: B, BE, C, CE"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Vechime / Experiență</label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) => setForm(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: 10+ ani"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Ore Instruire (Stat)</label>
                <input
                  type="text"
                  value={form.hours}
                  onChange={(e) => setForm(prev => ({ ...prev, hours: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-xs font-light"
                  placeholder="Ex: 1200+"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Absolvenți (Stat)</label>
                <input
                  type="text"
                  value={form.students}
                  onChange={(e) => setForm(prev => ({ ...prev, students: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-xs font-light"
                  placeholder="Ex: 300+"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Ordine sortare</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-450 focus:border-[#cc0000] transition-all outline-none text-xs font-light"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Fotografie Portret</label>
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
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Etichete/Puncte Forte (Rând nou per etichetă)</label>
                <textarea
                  value={form.tags}
                  onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-slate-750 placeholder-slate-450 focus:border-[#cc0000] transition-all outline-none text-xs font-light resize-none leading-relaxed"
                  placeholder="Răbdare infinită&#10;Program flexibil"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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
                  Salvează Profile
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <DataTable 
          headers={['Fotografie', 'Nume', 'Rol', 'Categorii', 'Vechime', 'Acțiuni']}
        >
          {instructors.map((inst) => (
            <tr key={inst.id} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-6 py-4.5">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={inst.image_url} alt={inst.name} className="w-full h-full object-cover object-top" />
                </div>
              </td>
              <td className="px-6 py-4.5 font-bold text-slate-800">
                {inst.name}
              </td>
              <td className="px-6 py-4.5 text-slate-500 text-xs font-normal">
                {inst.role}
              </td>
              <td className="px-6 py-4.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  {inst.categories}
                </span>
              </td>
              <td className="px-6 py-4.5 text-xs text-slate-450 font-medium">
                {inst.experience}
              </td>
              <td className="px-6 py-4.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(inst)}
                    title="Editează"
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-xl transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(inst.id)}
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
