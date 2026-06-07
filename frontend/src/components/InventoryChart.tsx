import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { InventoryDistributionPoint } from '../types';
import { CATEGORY_UZ } from '../lib/uz';

interface InventoryChartProps {
  data: InventoryDistributionPoint[] | undefined;
  isLoading: boolean;
}

const PALETTE = ['#D4AF37', '#6366f1', '#10b981', '#3b82f6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2.5 text-xs"
      style={{ background: '#111927', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
    >
      <p className="font-semibold text-white mb-1">{payload[0].name}</p>
      <p style={{ color: payload[0].fill }}>
        {payload[0].value.toLocaleString()} dona
      </p>
    </div>
  );
};

const InventoryChart: React.FC<InventoryChartProps> = ({ data, isLoading }) => {
  const total = data?.reduce((s, d) => s + d.count, 0) ?? 0;
  const hasData = !!data?.length && total > 0;

  return (
    <div
      className="rounded-2xl p-6 flex flex-col h-full"
      style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
    >
      <div className="mb-4">
        <h3 className="text-base font-bold text-white">Ombor taqsimoti</h3>
        <p className="text-xs text-slate-500 mt-0.5">Kategoriya bo&apos;yicha zaxira</p>
      </div>

      {/* Donut chart */}
      <div className="relative flex items-center justify-center" style={{ height: 200 }}>
        {isLoading ? (
          <div
            className="w-10 h-10 rounded-full border-2 animate-spin"
            style={{ borderColor: 'rgba(212,175,55,0.15)', borderTopColor: '#D4AF37' }}
          />
        ) : !hasData ? (
          <div className="text-center">
            <p className="text-sm text-slate-500">Mahsulot yo&apos;q</p>
            <p className="text-xs text-slate-600 mt-1">Ombor bo&apos;limida qo&apos;shing</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={82}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="category"
                  strokeWidth={0}
                >
                  {data?.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Jami</span>
              <span className="text-2xl font-black text-white mt-0.5">{total.toLocaleString()}</span>
              <span className="text-[10px] text-slate-500">dona</span>
            </div>
          </>
        )}
      </div>

      {/* Legend bars */}
      {hasData && (
        <div className="mt-5 space-y-2.5">
          {data?.map((entry, i) => {
            const pct = total > 0 ? (entry.count / total) * 100 : 0;
            const color = PALETTE[i % PALETTE.length];
            return (
              <div key={entry.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-slate-300 font-medium">{CATEGORY_UZ[entry.category] || entry.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-slate-500">{entry.count.toLocaleString()}</span>
                    <span className="font-bold" style={{ color }}>{pct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: color, opacity: 0.8 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InventoryChart;
