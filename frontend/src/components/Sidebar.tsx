import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Boxes, FileSpreadsheet, Users, Truck,
  LineChart, Settings, LogOut, X,
} from 'lucide-react';
import { ROLE_UZ } from '../lib/uz';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: { full_name: string; email: string; role: string } | null;
  onLogout: () => void;
}

const navSections = [
  {
    label: 'Asosiy',
    items: [
      { name: 'Boshqaruv paneli', to: '/', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Boshqaruv',
    items: [
      { name: 'Ombor (WMS)',         to: '/inventory', icon: Boxes },
      { name: 'Buyurtmalar (CRM)',   to: '/orders',    icon: FileSpreadsheet },
      { name: 'Mijozlar',            to: '/clients',   icon: Users },
      { name: "Ta'minotchilar",      to: '/suppliers', icon: Truck },
    ],
  },
  {
    label: 'Tahlil',
    items: [
      { name: 'Statistika',  to: '/analytics', icon: LineChart },
    ],
  },
  {
    label: 'Tizim',
    items: [
      { name: 'Sozlamalar', to: '/settings', icon: Settings },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const initials = user
    ? user.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col w-64 h-full
          glass-panel
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {/* ── Brand header ──────────────────────────────── */}
        <div
          className="flex items-center justify-between h-[60px] px-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black text-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#b48a20)', boxShadow: '0 2px 12px rgba(212,175,55,0.3)' }}
            >
              👑
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">ApparelCloud - 1 - 1</p>
              <p className="text-[9px] text-slate-500 font-medium tracking-wider uppercase mt-0.5">ERP · CRM · WMS</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Navigation ────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {navSections.map(section => (
            <div key={section.label}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-600 select-none">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map(item => {
                  const Icon = item.icon;
                  return (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) =>
                          `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group
                          ${isActive
                            ? 'text-white nav-active-bar'
                            : 'text-slate-400 hover:text-white'
                          }`
                        }
                        style={({ isActive }) => isActive
                          ? { background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.12)' }
                          : { border: '1px solid transparent' }
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <Icon
                              size={16}
                              className={`flex-shrink-0 transition-colors ${
                                isActive ? 'text-gold-400' : 'text-slate-500 group-hover:text-slate-300'
                              }`}
                            />
                            <span className="truncate">{item.name}</span>
                            {isActive && (
                              <span
                                className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: '#D4AF37', boxShadow: '0 0 6px rgba(212,175,55,0.7)' }}
                              />
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* ── User footer ───────────────────────────────── */}
        {user && (
          <div
            className="p-3"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div
              className="rounded-xl p-3 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-black"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#b48a20)' }}
                >
                  {initials}
                </div>
                <div className="dot-online absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5" style={{ boxShadow: 'none', border: '2px solid var(--bg-base)' }} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.full_name}</p>
                <p className="text-[10px] text-slate-500 truncate">{ROLE_UZ[user.role] || user.role}</p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Chiqish"
                className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
