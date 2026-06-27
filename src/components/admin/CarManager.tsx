import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, Car } from 'lucide-react';
import DataTable from './DataTable';

interface Vehicle {
  id: number;
  model: string;
  tag: string;
  image_url: string;
  sort_order: number;
}

interface CarManagerProps {
  initialCars: Vehicle[];
}

export default function CarManager({ initialCars }: CarManagerProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialCars);
  
  // Editor form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    model: '',
    tag: 'Manual',
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

  const handleOpenNew = () => {
    setForm({
      model: '',
      tag: 'Manual',
      image_url: '',
      sort_order: 0
    });
    setEditingId(null);
    setIsEditing(true);
    setError('');
  };

  const handleOpenEdit = (v: Vehicle) => {
    setForm({
      model: v.model || '',
      tag: v.tag || 'Manual',
      image_url: v.image_url || '',
      sort_order: v.sort_order || 0
    });
    setEditingId(v.id);
    setIsEditing(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.model || !form.tag) {
      setError('Modelul și tag-ul (transmisia) sunt obligatorii.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      model: form.model,
      tag: form.tag,
      image_url: form.image_url,
      sort_order: form.sort_order
    };

    try {
      const url = editingId ? `/api/cars/${editingId}` : '/api/cars';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = (await res.json()) as any;

      if (res.ok && data.success) {
        // Refresh local list
        const refreshedRes = await fetch('/api/cars');
        const refreshedData = (await refreshedRes.json()) as any;
        if (refreshedData.success) {
          setVehicles(refreshedData.cars);
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
    if (!confirm('Ești sigur că vrei să ștergi această mașină din flotă?')) return;
    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVehicles(prev => prev.filter(v => v.id !== id));
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err);
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
            Adaugă Mașină
          </button>
        </div>
      )}

      {/* Editor / Table */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] max-w-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-base font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Car size={18} className="text-[#cc0000]" /> {editingId ? 'Editează Mașină' : 'Mașină Nouă'}
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
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Model Mașină</label>
                <input
                  type="text"
                  value={form.model}
                  onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: Dacia Logan"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Transmisie / Tag</label>
                <input
                  type="text"
                  value={form.tag}
                  onChange={(e) => setForm(prev => ({ ...prev, tag: e.target.value }))}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: Manual, Automat, Camion"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Ordine de afișare</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-450 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: 0"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Imagine Mașină</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm(prev => ({ ...prev, image_url: e.target.value }))}
                    className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                    placeholder="URL Imagine sau încarcă..."
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold py-3 px-4 rounded-xl text-xs uppercase cursor-pointer transition-all select-none shrink-0 border border-slate-200/60">
                    {uploading ? 'Încarcă...' : 'Alege Fișier'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'image_url')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>

            {form.image_url && (
              <div className="relative w-40 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                <img src={form.image_url} className="w-full h-full object-cover" />
              </div>
            )}
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
              className="flex items-center gap-1.5 bg-[#cc0000] hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase shadow-md select-none cursor-pointer"
            >
              <Save size={13} />
              Salvează Mașină
            </button>
          </div>
        </form>
      ) : (
        <DataTable
          headers={['Imagine', 'Model', 'Transmisie', 'Ordine', 'Acțiuni']}
          emptyMessage="Nu s-au găsit mașini în baza de date."
        >
          {vehicles.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-6 py-4">
                <div className="w-20 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img src={v.image_url || '/images/cat-b.png'} className="w-full h-full object-cover" />
                </div>
              </td>
              <td className="px-6 py-4 font-bold text-slate-800">{v.model}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  {v.tag}
                </span>
              </td>
              <td className="px-6 py-4 text-xs text-slate-500 font-bold">{v.sort_order}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(v)}
                    title="Editează"
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-xl transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
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
