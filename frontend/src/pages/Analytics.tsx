import React from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart as RechartsLineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useSalesChart, useInventoryDistribution, useTopClients, useTopProducts } from '../hooks/useApi';
import { CATEGORY_UZ } from '../lib/uz';

const fmtMoney = (v: number) => `$${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

const CATEGORY_COLORS: Record<string, string> = {
  "Men's": '#D4AF37', "Women's": '#ec4899', Kids: '#f59e0b', Accessories: '#10b981',
};

const tooltipStyle = {
  background: '#111927',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 14,
  fontSize: 12,
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
};

const ChartCard: React.FC<{ title: string; sub: string; children: React.ReactNode }> = ({ title, sub, children }) => (
  <div
    className="rounded-2xl p-5 flex flex-col"
    style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
  >
    <div className="mb-5">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const Loader: React.FC = () => (
  <div className="flex items-center justify-center min-h-[220px] gap-3">
    <div className="w-7 h-7 rounded-full border-2 animate-spin"
      style={{ borderColor: 'rgba(212,175,55,0.15)', borderTopColor: '#D4AF37' }} />
    <span className="text-xs text-slate-500">Yuklanmoqda...</span>
  </div>
);

const Empty: React.FC<{ text: string; to?: string; label?: string }> = ({ text, to, label }) => (
  <div className="flex flex-col items-center justify-center min-h-[220px] gap-3 text-center">
    <p className="text-sm text-slate-500">{text}</p>
    {to && label && (
      <Link to={to} className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors">{label} →</Link>
    )}
  </div>
);

const Analytics: React.FC = () => {
  const { data: salesChart,  isLoading: salesLoading    } = useSalesChart(30);
  const { data: invChart,    isLoading: invLoading      } = useInventoryDistribution();
  const { data: topClients,  isLoading: clientsLoading  } = useTopClients(5);
  const { data: topProducts, isLoading: productsLoading } = useTopProducts(5);

  const hasSales      = salesChart?.some(p => p.sales > 0 || p.orders > 0);
  const hasInventory  = !!(invChart?.length);
  const hasClients    = !!(topClients?.length);
  const hasProducts   = !!(topProducts?.length);
  const totalInv      = invChart?.reduce((s, c) => s + c.count, 0) ?? 1;

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl font-black text-white">Statistika va hisobotlar</h1>
        <p className="text-xs text-slate-500 mt-0.5">Barcha ko'rsatkichlar haqiqiy ma'lumotlardan olinadi</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Sales trend */}
        <ChartCard title="Kunlik savdo (30 kun)" sub="Bekor qilinmagan buyurtmalar summasi">
          {salesLoading ? <Loader /> : !hasSales
            ? <Empty text="Hali buyurtma yo'q" to="/orders" label="Buyurtma yaratish" />
            : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={salesChart} margin={{ left: -15, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={d => d.slice(5)} stroke="transparent"
                      tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} />
                    <YAxis stroke="transparent" tickFormatter={v => `$${v/1000}k`} tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} />
                    <Tooltip formatter={(v: number) => [fmtMoney(v), 'Savdo']}
                      labelFormatter={l => `Sana: ${l}`} contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="sales" stroke="#D4AF37" strokeWidth={2.5} dot={false}
                      activeDot={{ r: 4, fill: '#D4AF37', stroke: '#080c14', strokeWidth: 2 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            )}
        </ChartCard>

        {/* Top clients */}
        <ChartCard title="Eng yaxshi mijozlar" sub="Jami xarid summasi bo'yicha (Top 5)">
          {clientsLoading ? <Loader /> : !hasClients
            ? <Empty text="Mijoz buyurtmalari hali yo'q" to="/clients" label="Mijoz qo'shish" />
            : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topClients} margin={{ left: -15, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="name" stroke="transparent" tick={{ fill: '#475569', fontSize: 8 }}
                      angle={-20} textAnchor="end" height={50} tickLine={false} />
                    <YAxis stroke="transparent" tickFormatter={v => `$${v/1000}k`} tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} />
                    <Tooltip formatter={(v: number) => [fmtMoney(v), 'Daromad']} contentStyle={tooltipStyle} />
                    <Bar dataKey="revenue" fill="#D4AF37" radius={[6,6,0,0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
        </ChartCard>

        {/* Top products */}
        <ChartCard title="Eng ko'p sotilgan mahsulotlar" sub="Daromad bo'yicha (Top 5)">
          {productsLoading ? <Loader /> : !hasProducts
            ? <Empty text="Sotuv ma'lumoti yo'q" to="/inventory" label="Mahsulot qo'shish" />
            : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProducts} layout="vertical" margin={{ left: 8, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                    <XAxis type="number" stroke="transparent" tickFormatter={v => `$${v/1000}k`} tick={{ fill: '#475569', fontSize: 9 }} tickLine={false} />
                    <YAxis dataKey="name" type="category" width={110} stroke="transparent" tick={{ fill: '#64748b', fontSize: 9 }} tickLine={false} />
                    <Tooltip formatter={(v: number) => [fmtMoney(v), 'Daromad']} contentStyle={tooltipStyle} />
                    <Bar dataKey="revenue" fill="#6366f1" radius={[0,6,6,0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
        </ChartCard>

        {/* Inventory by category */}
        <ChartCard title="Ombor — kategoriya bo'yicha" sub="Joriy zaxira miqdori">
          {invLoading ? <Loader /> : !hasInventory
            ? <Empty text="Omborda mahsulot yo'q" to="/inventory" label="Mahsulot qo'shish" />
            : (
              <div className="space-y-4 py-1">
                {invChart?.map(cat => {
                  const pct = (cat.count / totalInv) * 100;
                  const color = CATEGORY_COLORS[cat.category] ?? '#94a3b8';
                  return (
                    <div key={cat.category}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                          <span className="text-slate-300 font-medium">{CATEGORY_UZ[cat.category] || cat.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{cat.count.toLocaleString()} dona</span>
                          <span className="font-bold w-10 text-right" style={{ color }}>{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </ChartCard>

      </div>
    </div>
  );
};

export default Analytics;
