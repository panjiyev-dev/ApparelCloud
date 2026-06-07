import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { SalesChartPoint } from '../types';

interface SalesChartProps {
  data: SalesChartPoint[] | undefined;
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const fmt = (d: string) => {
    try { return new Date(d).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', timeZone: 'UTC' }); }
    catch { return d; }
  };
  return (
    <div
      className="rounded-2xl px-4 py-3 text-xs"
      style={{ background: '#111927', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
    >
      <p className="font-semibold text-white mb-2">{fmt(label)}</p>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#D4AF37' }} />
          <span className="text-slate-400">Daromad</span>
          <span className="font-bold text-white ml-auto">${payload[0].value.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#6366f1' }} />
          <span className="text-slate-400">Buyurtmalar</span>
          <span className="font-bold text-white ml-auto">{payload[1]?.value ?? 0}</span>
        </div>
      </div>
    </div>
  );
};

const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading }) => {
  const hasData = data?.some(p => p.sales > 0 || p.orders > 0);

  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', timeZone: 'UTC' }); }
    catch { return d; }
  };
  const fmtVal = (v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`;

  const totalRevenue = data?.reduce((s, p) => s + p.sales, 0) ?? 0;
  const totalOrders  = data?.reduce((s, p) => s + p.orders, 0) ?? 0;

  return (
    <div
      className="rounded-2xl p-6 flex flex-col"
      style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-base font-bold text-white">Daromad va buyurtmalar</h3>
          <p className="text-xs text-slate-500 mt-0.5">So&apos;nggi 30 kun dinamikasi</p>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-5">
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#D4AF37' }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Daromad</span>
            </div>
            <p className="text-sm font-bold text-white">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end mb-0.5">
              <span className="w-2 h-2 rounded-full" style={{ background: '#6366f1' }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Buyurtmalar</span>
            </div>
            <p className="text-sm font-bold text-white">{totalOrders}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 h-72">
        {isLoading ? (
          <div className="flex items-center justify-center h-full gap-3">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'rgba(212,175,55,0.15)', borderTopColor: '#D4AF37' }}
            />
            <span className="text-xs text-slate-500">Ma'lumotlar yuklanmoqda...</span>
          </div>
        ) : !hasData ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-sm text-slate-500">Hali buyurtma mavjud emas</p>
              <p className="text-xs text-slate-600 mt-1">Birinchi buyurtmadan keyin grafik paydo bo&apos;ladi</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#D4AF37" stopOpacity={0.30} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0.00} />
                </linearGradient>
                <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.20} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.00} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={fmtDate}
                stroke="rgba(255,255,255,0)"
                tick={{ fill: '#475569', fontSize: 10 }}
                dy={8}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={fmtVal}
                stroke="rgba(255,255,255,0)"
                tick={{ fill: '#475569', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="rgba(255,255,255,0)"
                tick={{ fill: '#334155', fontSize: 10 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />

              <Area
                yAxisId="left"
                type="monotone"
                dataKey="sales"
                stroke="#D4AF37"
                strokeWidth={2}
                fill="url(#gradSales)"
                dot={false}
                activeDot={{ r: 4, fill: '#D4AF37', stroke: '#080c14', strokeWidth: 2 }}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#6366f1"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                fill="url(#gradOrders)"
                dot={false}
                activeDot={{ r: 4, fill: '#6366f1', stroke: '#080c14', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SalesChart;
