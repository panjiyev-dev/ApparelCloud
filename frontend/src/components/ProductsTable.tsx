import React from 'react';
import { Edit2, Trash2, AlertTriangle, CheckCircle2, XCircle, Package } from 'lucide-react';
import { Product } from '../types';
import { CATEGORY_UZ } from '../lib/uz';

interface ProductsTableProps {
  products: Product[] | undefined;
  isLoading: boolean;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

const StockBadge: React.FC<{ qty: number; min: number }> = ({ qty, min }) => {
  if (qty === 0) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
        style={{ color: '#ef4444', background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)' }}
      >
        <XCircle size={11} />
        Tugagan
      </span>
    );
  }
  if (qty <= min) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
        style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.20)' }}
      >
        <AlertTriangle size={11} />
        Kam qoldi
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ color: '#10b981', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.20)' }}
    >
      <CheckCircle2 size={11} />
      Normal
    </span>
  );
};

const StockBar: React.FC<{ qty: number; min: number }> = ({ qty, min }) => {
  const max = Math.max(qty, min * 3, 10);
  const pct = Math.min((qty / max) * 100, 100);
  const color = qty === 0 ? '#ef4444' : qty <= min ? '#f59e0b' : '#10b981';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span
        className="font-mono font-bold text-xs tabular-nums"
        style={{ color: qty <= min ? color : '#f1f5f9' }}
      >
        {qty.toLocaleString()}
      </span>
    </div>
  );
};

const SkeletonRow: React.FC<{ cols: number }> = ({ cols }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="py-4 px-5">
        <div className="skeleton h-3.5 rounded" style={{ width: [80, 180, 90, 100, 90, 80, 70][i] ?? 80 }} />
      </td>
    ))}
  </tr>
);

const CATEGORY_COLOR: Record<string, string> = {
  "Men's":      '#6366f1',
  "Women's":    '#ec4899',
  'Kids':       '#f59e0b',
  'Accessories':'#10b981',
};

const ProductsTable: React.FC<ProductsTableProps> = ({ products, isLoading, onEdit, onDelete }) => {
  const hasActions = !!(onEdit || onDelete);
  const colCount = hasActions ? 7 : 6;

  return (
    <div
      className="overflow-x-auto rounded-2xl"
      style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
    >
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {['SKU', 'Mahsulot', 'Kategoriya', 'Zaxira', 'Holat', 'Narxi ($)', hasActions ? 'Amallar' : null]
              .filter(Boolean)
              .map((h, i) => (
                <th
                  key={h as string}
                  className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-600 whitespace-nowrap"
                  style={{ textAlign: i === 5 || i === 6 ? 'right' : i === 4 ? 'center' : 'left' }}
                >
                  {h}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={colCount} />)
          ) : !products?.length ? (
            <tr>
              <td colSpan={colCount} className="py-16 px-5 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <Package size={22} className="text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500">Mahsulotlar topilmadi</p>
                </div>
              </td>
            </tr>
          ) : (
            products.map((p, idx) => {
              const catColor = CATEGORY_COLOR[p.category] ?? '#94a3b8';
              return (
                <tr
                  key={p.id}
                  className="table-row border-b border-white/[0.03] last:border-0"
                  style={{ animationDelay: `${idx * 25}ms` }}
                >
                  {/* SKU */}
                  <td className="py-4 px-5">
                    <span className="font-mono text-xs font-bold text-gold-400">{p.sku}</span>
                  </td>

                  {/* Name */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${catColor}18`, border: `1px solid ${catColor}28` }}
                      >
                        <Package size={13} style={{ color: catColor }} />
                      </div>
                      <span className="font-semibold text-white text-xs truncate max-w-[180px]">{p.name}</span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-5">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{ color: catColor, background: `${catColor}14`, border: `1px solid ${catColor}22` }}
                    >
                      {CATEGORY_UZ[p.category] || p.category}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="py-4 px-5">
                    <StockBar qty={p.stock_quantity} min={p.min_stock_level} />
                  </td>

                  {/* Status */}
                  <td className="py-4 px-5 text-center">
                    <StockBadge qty={p.stock_quantity} min={p.min_stock_level} />
                  </td>

                  {/* Price */}
                  <td className="py-4 px-5 text-right">
                    <span className="font-mono font-bold text-white text-sm">
                      ${p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* Actions */}
                  {hasActions && (
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(p)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 transition-all"
                            style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.color = '#D4AF37';
                              (e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.10)';
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,175,55,0.25)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.color = '';
                              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                            }}
                            title="Tahrirlash"
                          >
                            <Edit2 size={13} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              if (window.confirm(`"${p.name}" mahsulotini o'chirishni tasdiqlaysizmi?`)) onDelete(p.id);
                            }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 transition-all"
                            style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.color = '#ef4444';
                              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.10)';
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.25)';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.color = '';
                              (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                              (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                            }}
                            title="O'chirish"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsTable;
