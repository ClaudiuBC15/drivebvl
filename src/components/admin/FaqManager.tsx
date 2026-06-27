import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Search, X, Save } from 'lucide-react';
import DataTable from './DataTable';

interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  created_at: string;
}

interface FaqManagerProps {
  initialFaqs: Faq[];
}

export default function FaqManager({ initialFaqs }: FaqManagerProps) {
  const [faqs, setFaqs] = useState<Faq[]>(initialFaqs);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('toate');

  // Form Editor States
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null); // null means new faq
  const [form, setForm] = useState({
    question: '',
    answer: '',
    category: 'Înscriere',
    sort_order: 0
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Înscriere',
    'Costuri',
    'Acte necesare',
    'Examen teoretic',
    'Examen practic',
    'Categoria B',
    'Categoria C/CE',
    'Categoria D',
    'Program cursuri',
    'Ședințe suplimentare',
    'Pași Înscriere'
  ];

  const handleOpenNew = () => {
    setForm({
      question: '',
      answer: '',
      category: 'Înscriere',
      sort_order: 0
    });
    setEditingId(null);
    setIsEditing(true);
    setError('');
  };

  const handleOpenEdit = (faq: Faq) => {
    setForm({
      question: faq.question || '',
      answer: faq.answer || '',
      category: faq.category || 'Înscriere',
      sort_order: faq.sort_order || 0
    });
    setEditingId(faq.id);
    setIsEditing(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question || !form.answer || !form.category) {
      setError('Toate câmpurile sunt obligatorii.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = editingId ? `/api/faq/${editingId}` : '/api/faq';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = (await res.json()) as any;

      if (res.ok && data.success) {
        // Refresh faqs list
        const refreshedRes = await fetch('/api/faq');
        const refreshedData = (await refreshedRes.json()) as any;
        if (refreshedData.success) {
          setFaqs(refreshedData.faqs);
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
    if (!confirm('Ești sigur că vrei să ștergi această întrebare din FAQ?')) return;
    try {
      const res = await fetch(`/api/faq/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFaqs(prev => prev.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
  };

  // Filter list
  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(search.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === 'toate' || faq.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Search & Action bar */}
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
                placeholder="Caută în FAQ..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 placeholder-slate-400 text-xs focus:border-[#cc0000] focus:ring-4 focus:ring-red-500/5 transition-all outline-none"
              />
            </div>

            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600 text-xs focus:border-[#cc0000] focus:ring-4 focus:ring-red-500/5 transition-all outline-none cursor-pointer font-bold"
            >
              <option value="toate">Toate Categoriile</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenNew}
            className="flex items-center justify-center gap-2 bg-[#cc0000] hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-xs w-full sm:w-auto cursor-pointer select-none"
          >
            <Plus size={14} />
            Adaugă Întrebare
          </button>
        </div>
      )}

      {/* Editor Form / Table List */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] max-w-2xl">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h4 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">
              {editingId ? 'Editează Întrebare' : 'Întrebare Nouă'}
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

          {/* Question & Category */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Întrebare</label>
              <input
                type="text"
                value={form.question}
                onChange={(e) => setForm(prev => ({ ...prev, question: e.target.value }))}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-450 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                placeholder="Ex: Cât costă școala de șoferi Categoria B?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Categorie FAQ</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-[#cc0000] transition-all outline-none text-sm cursor-pointer font-semibold"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Ordine Afișare (Sort Order)</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm(prev => ({ ...prev, sort_order: parseInt(e.target.value, 10) || 0 }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Răspuns</label>
              <textarea
                value={form.answer}
                onChange={(e) => setForm(prev => ({ ...prev, answer: e.target.value }))}
                required
                rows={5}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-450 focus:border-[#cc0000] transition-all outline-none text-sm font-light leading-relaxed resize-none"
                placeholder="Introdu răspunsul complet și detaliat..."
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs uppercase transition-all border border-slate-200"
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
                  Salvează Întrebare
                </>
              )}
            </button>
          </div>

        </form>
      ) : (
        <DataTable 
          headers={['Categorie', 'Întrebare & Răspuns', 'Ordine', 'Acțiuni']}
          emptyMessage="Nu s-au găsit întrebări FAQ conform criteriilor alese."
        >
          {filteredFaqs.map((faq) => (
            <tr key={faq.id} className="hover:bg-slate-50/30 transition-colors">
              <td className="px-6 py-4.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                  {faq.category}
                </span>
              </td>
              <td className="px-6 py-4.5 max-w-lg">
                <div className="font-bold text-slate-800 leading-snug">{faq.question}</div>
                <p className="text-xs text-slate-450 line-clamp-2 mt-1 leading-relaxed font-normal">{faq.answer}</p>
              </td>
              <td className="px-6 py-4.5 text-xs text-slate-500 font-bold">
                {faq.sort_order}
              </td>
              <td className="px-6 py-4.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(faq)}
                    title="Editează"
                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 rounded-xl transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(faq.id)}
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
