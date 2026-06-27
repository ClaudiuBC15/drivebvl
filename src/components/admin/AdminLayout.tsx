import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  FolderTree,
  Image as ImageIcon,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Car,
  Settings
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: 'dashboard' | 'blog' | 'faq' | 'categories' | 'gallery' | 'instructors' | 'leads' | 'cars' | 'settings';
}

export default function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const [adminName, setAdminName] = React.useState('Admin');
  const [adminAvatar, setAdminAvatar] = React.useState('/images/instructori/radu-matei.png');

  const loadProfile = () => {
    // 1. Check localStorage first
    const cachedName = localStorage.getItem('admin_name');
    const cachedAvatar = localStorage.getItem('admin_avatar');
    if (cachedName) setAdminName(cachedName);
    if (cachedAvatar) setAdminAvatar(cachedAvatar);

    // 2. Fetch from DB
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data: any) => {
        if (data.success && data.settings) {
          const name = data.settings.admin_name || 'Admin';
          const avatar = data.settings.admin_avatar || '/images/instructori/radu-matei.png';
          
          setAdminName(name);
          setAdminAvatar(avatar);
          
          localStorage.setItem('admin_name', name);
          localStorage.setItem('admin_avatar', avatar);
        }
      })
      .catch((err) => console.error('Error loading admin settings:', err));
  };

  React.useEffect(() => {
    loadProfile();

    // Listen to profile updates from settings page
    window.addEventListener('admin-profile-updated', loadProfile);
    return () => {
      window.removeEventListener('admin-profile-updated', loadProfile);
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'leads', label: 'Înscrieri (Leads)', icon: Users, href: '/admin/leads' },
    { id: 'blog', label: 'Articole Blog', icon: BookOpen, href: '/admin/blog' },
    { id: 'faq', label: 'Întrebări Frecvente', icon: HelpCircle, href: '/admin/faq' },
    { id: 'categories', label: 'Categorii Auto', icon: FolderTree, href: '/admin/categorii' },
    { id: 'gallery', label: 'Galerie Foto', icon: ImageIcon, href: '/admin/galerie' },
    { id: 'instructors', label: 'Instructori', icon: Users, href: '/admin/instructori' },
    { id: 'cars', label: 'Flotă Mașini', icon: Car, href: '/admin/flota' },
    { id: 'settings', label: 'Setări Site', icon: Settings, href: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-800 flex flex-col md:flex-row antialiased font-sans">

      {/* Mobile Top Bar */}
      <header className="flex md:hidden items-center justify-between bg-white px-6 py-4 border-b border-slate-200 relative z-50">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="Start Drive BVL Logo" className="h-8 object-contain" />
          <span className="font-extrabold text-slate-800 text-sm tracking-wider uppercase">Start Drive <span className="text-[#cc0000]">CMS</span></span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar (Desktop & Mobile) */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between transform transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:block'
          }`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="hidden md:flex items-center justify-center py-2">
            <img src="/images/logo.png" alt="Start Drive BVL Logo" className="h-16 object-contain" />
          </div>

          <div className="h-px bg-slate-100 hidden md:block"></div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 relative ${isActive
                      ? 'bg-red-50 text-[#cc0000]'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                >
                  {/* Red active indicator line on the left */}
                  {isActive && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#cc0000] rounded-r-full"></span>
                  )}
                  <Icon size={18} className={isActive ? 'text-[#cc0000]' : 'text-slate-400 group-hover:text-slate-700'} />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div className="pt-4 border-t border-slate-100 mt-6 space-y-4">
          {/* Profile Card widget */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/50">
            <img 
              src={adminAvatar} 
              alt="Admin Profile Photo" 
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-slate-800 text-xs">{adminName}</span>
              <span className="text-[10px] text-slate-400 truncate">administrator@bvl.ro</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-[#cc0000] border border-slate-200 hover:border-red-100 transition-all duration-200"
          >
            <LogOut size={16} />
            Deconectare
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col min-w-0">

        {/* Top Header (Desktop only) */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-slate-200/80 bg-white sticky top-0 z-30 shadow-[0_1px_4px_rgba(0,0,0,0.01)]">
          <h2 className="text-xl font-bold text-slate-850">
            {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
          </h2>

          <div className="flex items-center gap-5">
            {/* Notification bell with badge */}
            <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500 cursor-pointer focus:outline-none">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#cc0000] text-[9px] font-black text-white rounded-full flex items-center justify-center border border-white">
                3
              </span>
            </button>
            
            <div className="h-6 w-px bg-slate-200"></div>
            
            {/* User Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 py-1.5 px-3 rounded-xl transition-all cursor-pointer focus:outline-none"
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{adminName}</span>
                  <span className="text-[9px] text-slate-400">Administrator</span>
                </div>
                <ChevronDown size={16} className="text-slate-450" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-1 animate-fade-in-up">
                  <a href="/admin/settings" className="block px-4 py-2 text-xs font-medium text-slate-650 hover:bg-slate-50">
                    Setări cont
                  </a>
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left block px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Deconectare
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Inner Page View Wrapper */}
        <main className="flex-grow p-6 md:p-8 bg-[#fafafa]">
          {children}
        </main>
      </div>

    </div>
  );
}
