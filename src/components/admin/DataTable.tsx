import React from 'react';

interface DataTableProps {
  headers: string[];
  loading?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

export default function DataTable({ headers, loading, emptyMessage = 'Nu s-au găsit înregistrări.', children }: DataTableProps) {
  return (
    <div className="w-full bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-750">
          <thead className="bg-slate-50/50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            <tr>
              {headers.map((header, index) => (
                <th key={index} scope="col" className="px-6 py-4.5 font-bold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-400 font-light">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-[#cc0000] border-t-transparent animate-spin"></div>
                    Se încarcă datele...
                  </div>
                </td>
              </tr>
            ) : React.Children.count(children) === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-400 font-light">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              children
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
