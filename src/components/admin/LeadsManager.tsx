import React, { useState } from 'react';
import { Download, Search, Trash2, CheckCircle2, UserCheck, MessageSquare } from 'lucide-react';
import DataTable from './DataTable';

interface Lead {
  id: number;
  name: string;
  phone: string;
  category: string;
  message: string;
  status: 'nou' | 'contactat' | 'inscris';
  source: string;
  created_at: string;
  updated_at: string;
}

interface LeadsManagerProps {
  initialLeads: Lead[];
}

export default function LeadsManager({ initialLeads }: LeadsManagerProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('toate');
  const [categoryFilter, setCategoryFilter] = useState('toate');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleStatusChange = async (id: number, newStatus: 'nou' | 'contactat' | 'inscris') => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Ești sigur că vrei să ștergi această înregistrare?')) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== id));
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  // Filtering logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      (lead.message && lead.message.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'toate' || lead.status === statusFilter;
    const matchesCategory = categoryFilter === 'toate' || lead.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const cleanStr = dateStr.includes(' ') && !dateStr.includes('T') ? dateStr.replace(' ', 'T') : dateStr;
      const date = new Date(cleanStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('ro-RO', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Search & Select Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-60">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Caută în cereri..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-slate-700 placeholder-slate-400 text-xs focus:border-[#cc0000] focus:ring-4 focus:ring-red-500/5 transition-all outline-none"
            />
          </div>

          {/* Status selector */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600 text-xs focus:border-[#cc0000] focus:ring-4 focus:ring-red-500/5 transition-all outline-none cursor-pointer"
          >
            <option value="toate">Toate Statusurile</option>
            <option value="nou">Nou</option>
            <option value="contactat">Contactat</option>
            <option value="inscris">Înscris</option>
          </select>

          {/* Category selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600 text-xs focus:border-[#cc0000] focus:ring-4 focus:ring-red-500/5 transition-all outline-none cursor-pointer"
          >
            <option value="toate">Toate Categoriile</option>
            <option value="b1">Categoria B1</option>
            <option value="b">Categoria B</option>
            <option value="be">Categoria BE</option>
            <option value="c">Categoria C</option>
            <option value="ce">Categoria CE</option>
            <option value="d">Categoria D</option>
          </select>
        </div>

        {/* CSV export */}
        <a
          href="/api/leads/export"
          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-5 rounded-xl transition-all duration-200 text-xs w-full sm:w-auto border border-slate-200/60"
        >
          <Download size={14} />
          Exportă CSV
        </a>

      </div>

      {/* Main Leads Table */}
      <DataTable
        headers={['Nume Cursant', 'Telefon', 'Categorie', 'Mesaj & Sursă', 'Data Înscrierii', 'Status', 'Acțiuni']}
        emptyMessage="Nu s-au găsit cereri de înscriere conform filtrelor alese."
      >
        {filteredLeads.map((lead) => (
          <tr key={lead.id} className="hover:bg-slate-50/30 transition-colors">

            {/* Name */}
            <td className="px-6 py-4.5 font-bold text-slate-800">
              {lead.name}
            </td>

            {/* Phone */}
            <td className="px-6 py-4.5 font-medium text-slate-700">
              <a href={`tel:${lead.phone}`} className="text-slate-500 hover:text-[#cc0000] transition-colors">
                {lead.phone}
              </a>
            </td>

            {/* Category */}
            <td className="px-6 py-4.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                Categoria {lead.category || 'N/A'}
              </span>
            </td>

            {/* Message & Source */}
            <td className="px-6 py-4.5 max-w-xs font-normal text-slate-600">
              {lead.message ? (
                <div className="text-slate-650 text-xs flex items-start gap-1.5 leading-relaxed">
                  <MessageSquare size={13} className="text-[#cc0000] shrink-0 mt-0.5" />
                  <span className="line-clamp-2" title={lead.message}>{lead.message}</span>
                </div>
              ) : (
                <span className="text-slate-400 text-xs italic">Fără mesaj</span>
              )}
              <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                Sursă: {lead.source || 'website'}
              </span>
            </td>

            {/* Created At */}
            <td className="px-6 py-4.5 text-xs text-slate-400 font-light">
              {formatDate(lead.created_at)}
            </td>

            {/* Status Select dropdown */}
            <td className="px-6 py-4.5">
              <div className="relative">
                <select
                  value={lead.status}
                  disabled={loadingId === lead.id}
                  onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                  className={`appearance-none cursor-pointer rounded-full px-4.5 py-1.5 text-[10px] font-bold uppercase tracking-wider border outline-none transition-all ${lead.status === 'nou'
                      ? 'bg-blue-50 text-blue-600 border-blue-100/50 focus:ring-blue-500/10'
                      : lead.status === 'contactat'
                        ? 'bg-amber-50 text-amber-600 border-amber-100/50 focus:ring-amber-500/10'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100/50 focus:ring-emerald-500/10'
                    }`}
                >
                  <option value="nou">Nouă</option>
                  <option value="contactat">În așteptare</option>
                  <option value="inscris">Confirmată</option>
                </select>
              </div>
            </td>

            {/* Actions (Delete) */}
            <td className="px-6 py-4.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(lead.id)}
                  title="Șterge cererea"
                  className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-[#cc0000] border border-slate-200 hover:border-red-100 rounded-xl transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>

          </tr>
        ))}
      </DataTable>

    </div>
  );
}
