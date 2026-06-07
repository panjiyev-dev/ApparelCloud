import React from 'react';
import { DollarSign, ClipboardList, AlertTriangle, Users, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DashboardStats } from '../types';

interface KPICardsProps {
  stats: DashboardStats | undefined;
  isLoading: boolean;
}

const KPICards: React.FC<KPICardsProps> = ({ stats, isLoading }) => {
  const fmt = (v: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);

  const cards = [
    {
      title:    'Umumiy daromad',
      value:    stats ? fmt(stats.total_revenue) : '$0',
      sub:      'Bekor qilinmagan savdo',
      trend:    stats?.revenue_trend ?? 0,
      trendFmt: stats ? `${stats.revenue_trend >= 0 ? '+' : ''}${stats.revenue_trend}%` : null,
      icon:     DollarSign,
      accent:   '#D4AF37',
      accentDim:'rgba(212,175,55,0.12)',
      accentBdr:'rgba(212,175,55,0.20)',
      delay:    '0ms',
    },
    {
      title:    'Kutilayotgan buyurtmalar',
      value:    stats ? stats.pending_orders.toString() : '0',
      sub:      'Yetkazib berish kutilmoqda',
      trend:    0,
      trendFmt: 'Faol',
      icon:     ClipboardList,
      accent:   '#6366f1',
      accentDim:'rgba(99,102,241,0.12)',
      accentBdr:'rgba(99,102,241,0.20)',
      delay:    '60ms',
    },
    {
      title:    'Kam zaxira signallari',
      value:    stats ? stats.low_stock_alerts.toString() : '0',
      sub:      'Minimal darajadan past',
      trend:    stats && stats.low_stock_alerts > 0 ? -1 : 0,
      trendFmt: stats && stats.low_stock_alerts > 0 ? 'Chora kerak' : 'Normal',
      icon:     AlertTriangle,
      accent:   stats && stats.low_stock_alerts > 0 ? '#ef4444' : '#10b981',
      accentDim:stats && stats.low_stock_alerts > 0 ? 'rgba(239,68,68,0.10)' : 'rgba(16,185,129,0.10)',
      accentBdr:stats && stats.low_stock_alerts > 0 ? 'rgba(239,68,68,0.20)' : 'rgba(16,185,129,0.20)',
      glow:     stats && stats.low_stock_alerts > 0,
      delay:    '120ms',
    },
    {
      title:    'Faol B2B mijozlar',
      value:    stats ? stats.active_clients.toString() : '0',
      sub:      "Ma'lumotlar bazasidagi xaridorlar",
      trend:    0,
      trendFmt: 'B2B',
      icon:     Users,
      accent:   '#10b981',
      accentDim:'rgba(16,185,129,0.10)',
      accentBdr:'rgba(16,185,129,0.20)',
      delay:    '180ms',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 h-36"
            style={{ background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="space-y-3 animate-pulse">
              <div className="skeleton h-3 w-2/3" />
              <div className="skeleton h-8 w-1/2 mt-4" />
              <div className="skeleton h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        const isUp   = c.trend > 0;
        const isDown = c.trend < 0;

        return (
          <div
            key={idx}
            className="group relative rounded-2xl p-5 card-hover animate-fade-up overflow-hidden"
            style={{
              background: 'rgba(14,20,32,0.85)',
              border: `1px solid rgba(255,255,255,0.06)`,
              animationDelay: c.delay,
            }}
          >
            {/* Subtle accent glow at top */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${c.accent}50, transparent)` }}
            />

            {/* Pulsing glow if alert */}
            {c.glow && (
              <div
                className="absolute inset-0 rounded-2xl animate-pulse-glow pointer-events-none"
                style={{ boxShadow: `0 0 0 1px ${c.accent}20` }}
              />
            )}

            {/* Header row */}
            <div className="flex items-start justify-between mb-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 leading-tight pr-2">
                {c.title}
              </p>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ background: c.accentDim, border: `1px solid ${c.accentBdr}` }}
              >
                <Icon size={16} style={{ color: c.accent }} />
              </div>
            </div>

            {/* Main value */}
            <p
              className="text-3xl font-black tracking-tight leading-none mb-2 transition-colors duration-200"
              style={{ color: '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}
            >
              {c.value}
            </p>

            {/* Bottom row: description + trend */}
            <div className="flex items-center justify-between mt-3">
              <p className="text-[11px] text-slate-500 truncate flex-1">{c.sub}</p>

              {c.trendFmt && (
                <span
                  className="flex items-center gap-0.5 text-[11px] font-semibold ml-2 flex-shrink-0"
                  style={{
                    color: isUp ? '#10b981' : isDown ? '#ef4444' : '#94a3b8',
                  }}
                >
                  {isUp   && <TrendingUp  size={11} />}
                  {isDown && <TrendingDown size={11} />}
                  {!isUp && !isDown && <Minus size={11} />}
                  {c.trendFmt}
                </span>
              )}
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(90deg, transparent, ${c.accent}60, transparent)` }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;
