import React, { useState } from 'react';
import axios from 'axios';
import { Lock, Mail, Eye, EyeOff, CheckCircle2, Zap, ShieldCheck, BarChart3 } from 'lucide-react';
import { formatApiError } from '../lib/errors';

interface LoginProps {
  onLoginSuccess: (token: string, user: unknown) => void;
}

const features = [
  { icon: Zap,           text: "Real vaqtda ombor boshqaruvi (WMS)" },
  { icon: CheckCircle2,  text: "B2B buyurtmalar va CRM tizimi" },
  { icon: ShieldCheck,   text: "Ta'minotchilar boshqaruvi (SRM)" },
  { icon: BarChart3,     text: "Tahlil va savdo hisobotlari" },
];

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@apparelcloud.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      const response = await axios.post(`${baseUrl}/api/auth/login`, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      const { access_token, user } = response.data;
      onLoginSuccess(access_token, user);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 401) {
        setError("Email yoki parol noto'g'ri.");
      } else {
        setError(formatApiError(err, "Autentifikatsiya serveriga ulanib bo'lmadi."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-navy-900">

      {/* ── Left brand panel ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[42%] relative flex-col justify-between p-12 overflow-hidden">

        {/* Ambient orbs */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 -left-24 w-[480px] h-[480px] rounded-full opacity-20 animate-orb"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)', animationDelay: '0s' }}
          />
          <div
            className="absolute top-1/2 -right-32 w-[360px] h-[360px] rounded-full opacity-15 animate-orb"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.5) 0%, transparent 70%)', animationDelay: '3s' }}
          />
          <div
            className="absolute -bottom-32 left-1/4 w-[320px] h-[320px] rounded-full opacity-10 animate-orb"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.5) 0%, transparent 70%)', animationDelay: '6s' }}
          />
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black text-black"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #b48a20)' }}
            >
              👑
            </div>
            <span className="text-lg font-bold tracking-wide text-white">cladue</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl xl:text-5xl font-black leading-tight mb-5">
            <span className="text-white">Ulgurji kiyim</span>
            <br />
            <span className="text-gold-gradient">biznesini boshqar.</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm">
            ERP, CRM, WMS va SRM — barchasini bitta platformada, real vaqtda.
          </p>

          {/* Features */}
          <ul className="mt-10 space-y-4">
            {features.map(({ icon: Icon, text }, i) => (
              <li
                key={i}
                className="flex items-center gap-3.5 animate-fade-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <Icon size={15} className="text-gold-400" />
                </div>
                <span className="text-slate-300 text-sm font-medium">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <div
            className="rounded-2xl p-5"
            style={{ background: 'rgba(14,20,32,0.6)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(16px)' }}
          >
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "sardor bizning ulgurji operatsiyalarimizni butunlay o'zgartirdi — buyurtmalarni kuzatish endi bir lahzalik ish."
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#b48a20)' }}
              >
                A
              </div>
              <div>
                <p className="text-white text-xs font-semibold">Admin Foydalanuvchi</p>
                <p className="text-slate-500 text-[10px]">ApparelCloud Demo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Subtle vertical separator (desktop only) */}
        <div
          className="hidden lg:block absolute left-0 top-12 bottom-12 w-px"
          style={{ background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.06) 30%, rgba(255,255,255,0.06) 70%, transparent)' }}
        />

        <div className="w-full max-w-[400px] animate-fade-up">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-black"
              style={{ background: 'linear-gradient(135deg,#D4AF37,#b48a20)' }}
            >
              👑
            </div>
            <span className="text-lg font-bold text-white">ApparelCloud</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1.5">Tizimga kirish</h2>
            <p className="text-slate-400 text-sm">Hisobingizga kirish uchun ma'lumotlarni kiriting</p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-6 flex items-start gap-3 rounded-xl p-4 text-sm"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-[10px] font-bold">!</span>
              </div>
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Email manzil
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="siz@kompaniya.uz"
                  className="form-input pl-11"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                Parol
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="form-input pl-11 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full h-12 mt-2 text-base font-bold"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                'Tizimga kirish'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div
            className="mt-8 rounded-xl p-4"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <p className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-3">Demo hisoblar</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Administrator</span>
                <div className="flex items-center gap-2 font-mono">
                  <span
                    className="px-2 py-0.5 rounded text-slate-300"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    admin@apparelcloud.com
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-slate-300"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    admin123
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Xodim</span>
                <div className="flex items-center gap-2 font-mono">
                  <span
                    className="px-2 py-0.5 rounded text-slate-300"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    staff@apparelcloud.com
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-slate-300"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    staffpassword
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-slate-600 text-[11px] mt-8">
            © 2025 ApparelCloud · Kiyim sohasining aqlli ERP tizimi
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
