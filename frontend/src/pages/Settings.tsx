import React, { useState, useEffect } from 'react';
import { User, Server, Sparkles, Keyboard, CheckCircle2, XCircle, Loader2, Activity } from 'lucide-react';
import api from '../lib/api';
import { loadPreferences, savePreferences, triggerGlobalSearch } from '../lib/preferences';
import { ROLE_UZ } from '../lib/uz';

interface SettingsProps {
  user: { full_name: string; email: string; role: string } | null;
}

const Section: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
  <div className="rounded-2xl p-5 space-y-4"
    style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
    <div className="flex items-center gap-2.5 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}>
        <Icon size={14} className="text-gold-400" />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoRow: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">{label}</p>
    <p className={`text-sm font-semibold text-white ${mono ? 'font-mono' : ''}`}>{value}</p>
  </div>
);

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [apiHealth, setApiHealth] = useState<'checking' | 'healthy' | 'offline'>('checking');
  const [dbStatus, setDbStatus] = useState('Tekshirilmoqda...');
  const [apiVersion, setApiVersion] = useState('—');
  const [microAnimations, setMicroAnimations] = useState(() => loadPreferences().microAnimations);
  const [keybindTested, setKeybindTested] = useState(false);

  useEffect(() => {
    api.get('/health').then(res => {
      if (res.data.status === 'healthy') {
        setApiHealth('healthy');
        setApiVersion(res.data.version || '1.0.0');
        setDbStatus('Ishlayapti');
      } else {
        setApiHealth('offline');
        setDbStatus("Noma'lum");
      }
    }).catch(() => {
      setApiHealth('offline');
      setDbStatus('Ulanmagan');
    });
  }, []);

  const toggleAnimations = () => {
    const next = !microAnimations;
    setMicroAnimations(next);
    savePreferences({ microAnimations: next });
  };

  const testKeybind = () => {
    triggerGlobalSearch();
    setKeybindTested(true);
    setTimeout(() => setKeybindTested(false), 2500);
  };

  const HealthIcon = apiHealth === 'healthy' ? CheckCircle2 : apiHealth === 'offline' ? XCircle : Loader2;
  const healthColor = apiHealth === 'healthy' ? '#10b981' : apiHealth === 'offline' ? '#ef4444' : '#94a3b8';
  const healthLabel = apiHealth === 'healthy' ? 'Ulangan' : apiHealth === 'offline' ? 'Oflayn' : 'Tekshirilmoqda...';

  const initials = user?.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-black text-white">Tizim sozlamalari</h1>
        <p className="text-xs text-slate-500 mt-0.5">Profil, server holati va interfeys sozlamalari</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Profile */}
          <Section icon={User} title="Operator profili">
            {user ? (
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black text-black flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#D4AF37,#b48a20)' }}>
                  {initials}
                </div>
                <div>
                  <p className="text-lg font-black text-white">{user.full_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
                  <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{ color: '#D4AF37', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.20)' }}>
                    {ROLE_UZ[user.role] || user.role}
                  </span>
                </div>
              </div>
            ) : null}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <InfoRow label="To'liq ism" value={user?.full_name ?? '—'} />
              <InfoRow label="Rol" value={
                <span style={{ color: '#D4AF37' }}>{ROLE_UZ[user?.role ?? ''] || user?.role || '—'}</span>
              } />
              <InfoRow label="Email" value={user?.email ?? '—'} mono />
            </div>
          </Section>

          {/* Server */}
          <Section icon={Server} title="Server va ma'lumotlar bazasi">
            <div className="grid grid-cols-2 gap-3">
              <InfoRow label="API manzili" mono
                value={import.meta.env.VITE_API_URL || 'http://localhost:8000'} />
              <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1.5">Server holati</p>
                <div className="flex items-center gap-2">
                  <HealthIcon size={14} style={{ color: healthColor }} className={apiHealth === 'checking' ? 'animate-spin' : ''} />
                  <span className="text-sm font-semibold" style={{ color: healthColor }}>{healthLabel}</span>
                </div>
              </div>
              <InfoRow label="PostgreSQL" value={
                <span className={dbStatus === 'Ishlayapti' ? 'text-emerald-400' : 'text-slate-300'}>{dbStatus}</span>
              } />
              <InfoRow label="API versiyasi" value={apiVersion} mono />
            </div>

            {/* Activity indicator */}
            <div className="flex items-center gap-2.5 mt-2 p-3 rounded-xl"
              style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <Activity size={14} className="text-emerald-400 flex-shrink-0" />
              <p className="text-xs text-emerald-400/80">
                ApparelCloud backend FastAPI + PostgreSQL ustida ishlaydi
              </p>
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Section icon={Sparkles} title="Interfeys sozlamalari">
            <div className="space-y-4">
              {/* Theme */}
              <div className="p-3.5 rounded-xl space-y-3"
                style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.12)' }}>
                <p className="text-xs font-bold text-gold-400">Faol mavzu: Obsidian Dark</p>
                <div className="flex items-center gap-2">
                  {['#080c14','#D4AF37','#6366f1','#10b981','#f1f5f9'].map((c, i) => (
                    <div key={i} className="w-6 h-6 rounded-full ring-2 ring-white/5" style={{ background: c }} title={c} />
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Ko'zni kam charchatadigan qorong'u interfeys + oltin rang aksent.
                </p>
              </div>

              {/* Animations toggle */}
              <div className="p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs font-semibold text-slate-300">Mikro-animatsiyalar</p>
                  <button type="button" onClick={toggleAnimations} aria-pressed={microAnimations}
                    className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
                    style={{ background: microAnimations ? '#D4AF37' : 'rgba(255,255,255,0.08)' }}>
                    <span className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-black/60 transition-transform duration-200"
                      style={{ transform: microAnimations ? 'translateX(20px)' : 'translateX(0)' }} />
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  Holat: <span className="font-bold" style={{ color: microAnimations ? '#10b981' : '#475569' }}>
                    {microAnimations ? 'Yoqilgan' : "O'chirilgan"}
                  </span>
                </p>
              </div>
            </div>
          </Section>

          <Section icon={Keyboard} title="Klaviatura qisqartmalari">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl text-xs"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-slate-400">Global qidiruv</span>
                <div className="flex items-center gap-1.5">
                  {['⌘', 'K'].map(k => (
                    <kbd key={k} className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-300"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>{k}</kbd>
                  ))}
                </div>
              </div>

              <button type="button" onClick={testKeybind}
                className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: keybindTested ? 'rgba(16,185,129,0.10)' : 'rgba(212,175,55,0.08)',
                  border: keybindTested ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(212,175,55,0.20)',
                  color: keybindTested ? '#10b981' : '#D4AF37',
                }}>
                {keybindTested ? '✓ Qidiruv maydoni faollashtirildi' : 'Qidiruvni sinab ko\'rish'}
              </button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
