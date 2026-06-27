import React, { useState } from 'react';
import { Save } from 'lucide-react';

interface SettingsManagerProps {
  initialSettings: Record<string, string>;
}

export default function SettingsManager({ initialSettings }: SettingsManagerProps) {
  // Settings State
  const [settings, setSettings] = useState<Record<string, string>>(initialSettings);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  // File Upload Helper
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
        setSettings(prev => ({ ...prev, [targetField]: data.url }));
        
        // Save avatar url to localStorage as fallback so it refreshes instantly in Layout
        if (targetField === 'admin_avatar') {
          localStorage.setItem('admin_avatar', data.url);
        }
      } else {
        alert(data.error || 'Încărcarea a eșuat.');
      }
    } catch (err) {
      alert('Eroare la încărcarea fișierului.');
    } finally {
      setUploading(false);
    }
  };

  // Handle Settings Save
  const handleSettingsSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsError('');
    setSettingsSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = (await res.json()) as any;
      if (res.ok && data.success) {
        setSettingsSuccess(true);
        
        // Save to localStorage so Sidebar layout is updated instantly without reloading
        if (settings.admin_name) {
          localStorage.setItem('admin_name', settings.admin_name);
        }
        if (settings.admin_avatar) {
          localStorage.setItem('admin_avatar', settings.admin_avatar);
        }
        
        // Dispatch custom event to notify Sidebar (AdminLayout)
        window.dispatchEvent(new Event('admin-profile-updated'));

        setTimeout(() => setSettingsSuccess(false), 3000);
      } else {
        setSettingsError(data.error || 'A apărut o eroare la salvarea setărilor.');
      }
    } catch (err) {
      setSettingsError('Eroare rețea la salvarea setărilor.');
    } finally {
      setSettingsSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* General Site & Enrollment Settings */}
      <section className="bg-white border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.02)] max-w-4xl">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h4 className="text-base font-extrabold text-slate-800 uppercase tracking-wider">Setări Generale &amp; Profil Administrator</h4>
          <p className="text-xs text-slate-450 font-normal mt-1">Configurare detalii site și profilul vizibil în meniul administrativ din stânga.</p>
        </div>

        <form onSubmit={handleSettingsSave} className="space-y-6">
          {settingsError && (
            <div className="bg-red-50 border border-red-100 text-red-650 text-xs font-semibold p-4 rounded-xl">
              {settingsError}
            </div>
          )}

          {settingsSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold p-4 rounded-xl">
              Setările au fost salvate cu succes!
            </div>
          )}

          {/* Form fields: Phone & Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Telefon Contact</label>
              <input
                type="text"
                value={settings.contact_phone || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                placeholder="Ex: 0744 420 905"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Program de Lucru</label>
              <input
                type="text"
                value={settings.contact_schedule || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, contact_schedule: e.target.value }))}
                required
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                placeholder="Ex: Luni - Vineri: 08:00 - 17:00"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Titlu Secțiune Finală CTA</label>
            <input
              type="text"
              value={settings.inscrieri_cta_title || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, inscrieri_cta_title: e.target.value }))}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
              placeholder="Ex: Ești pregătit să începi?"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Subtext Secțiune Finală CTA</label>
            <input
              type="text"
              value={settings.inscrieri_cta_text || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, inscrieri_cta_text: e.target.value }))}
              required
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
              placeholder="Ex: Înscrie-te astăzi și începe pregătirea pentru permisul tău."
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Text Card Suport („Te ajutăm cu tot procesul”)</label>
            <textarea
              value={settings.inscrieri_support_text || ''}
              onChange={(e) => setSettings(prev => ({ ...prev, inscrieri_support_text: e.target.value }))}
              required
              rows={3}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-755 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light leading-relaxed resize-none"
              placeholder="Scrie textul de suport pentru înscrieri..."
            ></textarea>
          </div>

          {/* Profil Administrator group */}
          <div className="border-t border-slate-100 pt-6 mt-6 space-y-6">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Profil Administrator (Meniu Sidebar)</h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Nume Administrator</label>
                <input
                  type="text"
                  value={settings.admin_name || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, admin_name: e.target.value }))}
                  required
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-450 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                  placeholder="Ex: Admin"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wider mb-2">Poză de Profil</label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={settings.admin_avatar || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, admin_avatar: e.target.value }))}
                    required
                    className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-750 placeholder-slate-400 focus:border-[#cc0000] transition-all outline-none text-sm font-light"
                    placeholder="URL Imagine..."
                  />
                  <label className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold py-3 px-4 rounded-xl text-xs uppercase cursor-pointer transition-all select-none shrink-0 border border-slate-200/60">
                    {uploading ? 'Încarcă...' : 'Încarcă'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'admin_avatar')}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
              </div>
            </div>
            
            {settings.admin_avatar && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                  <img src={settings.admin_avatar} className="w-full h-full object-cover" alt="Preview Admin Profile" />
                </div>
                <span className="text-xs text-slate-450">Previzualizare poză de profil</span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={settingsSaving}
              className="flex items-center gap-1.5 bg-[#cc0000] hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase shadow-md select-none cursor-pointer disabled:opacity-50"
            >
              {settingsSaving ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border border-white border-t-transparent animate-spin"></div>
                  Se salvează...
                </>
              ) : (
                <>
                  <Save size={13} />
                  Salvează Setări
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
