import React from 'react';
import { Order } from '../types';
import { ORDER_STATUS_UZ } from '../lib/uz';
import { Clock, Loader2, Truck, CheckCircle2, XCircle, PackageCheck } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[] | undefined;
  isLoading: boolean;
  onRowClick?: (order: Order) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  Pending:    { label: ORDER_STATUS_UZ['Pending']    ?? 'Kutilmoqda', color: '#6366f1', bg: 'rgba(99,102,241,0.10)',  border: 'rgba(99,102,241,0.20)',  icon: Clock },
  Processing: { label: ORDER_STATUS_UZ['Processing'] ?? 'Jarayonda',  color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.20)', icon: Loader2 },
  Shipped:    { label: ORDER_STATUS_UZ['Shipped']    ?? 'Yuborildi',  color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.20)', icon: Truck },
  Delivered:  { label: ORDER_STATUS_UZ['Delivered']  ?? 'Yetkazildi', color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.20)', icon: CheckCircle2 },
  Cancelled:  { label: ORDER_STATUS_UZ['Cancelled']  ?? 'Bekor',      color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.20)',  icon: XCircle },
};

const formatDate = (dateStr: string) => {
  try {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch { return dateStr; }
};

const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return <span className="text-slate-400 text-xs">{status}</span>;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
};

const SkeletonRow: React.FC = () => (
  <tr>
    {[140, 160, 120, 60, 90, 80].map((w, i) => (
      <td key={i} className="py-4 px-5">
        <div className="skeleton h-3.5 rounded" style={{ width: w }} />
      </td>
    ))}
  </tr>
);

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading, onRowClick }) => (
  <div
    className="overflow-x-auto rounded-2xl"
    style={{ background: 'rgba(14,20,32,0.85)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
  >
    <table className="w-full text-left text-sm border-collapse">
      <thead>
        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {['Buyurtma №', 'Mijoz', 'Sana', 'Mahsulotlar', 'Holat', 'Jami summa'].map((h, i) => (
            <th
              key={h}
              className="py-3.5 px-5 text-[10px] font-bold uppercase tracking-widest text-slate-600 whitespace-nowrap"
              style={{ textAlign: i >= 3 ? (i === 3 ? 'right' : i === 4 ? 'center' : 'right') : 'left' }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
        ) : !orders?.length ? (
          <tr>
            <td colSpan={6} className="py-16 px-5 text-center">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <PackageCheck size={22} className="text-slate-600" />
                </div>
                <p className="text-sm text-slate-500">Buyurtmalar topilmadi</p>
              </div>
            </td>
          </tr>
        ) : (
          orders.map((order, idx) => (
            <tr
              key={order.id}
              onClick={() => onRowClick?.(order)}
              className="table-row border-b border-white/[0.03] last:border-0"
              style={{ cursor: onRowClick ? 'pointer' : 'default', animationDelay: `${idx * 30}ms` }}
            >
              {/* Order number */}
              <td className="py-4 px-5">
                <span className="font-mono font-bold text-gold-400 text-xs">{order.order_number}</span>
              </td>

              {/* Client */}
              <td className="py-4 px-5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#D4AF37,#b48a20)' }}
                  >
                    {(order.client?.company_name ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-white text-xs truncate max-w-[130px]">
                    {order.client?.company_name ?? `Mijoz #${order.client_id}`}
                  </span>
                </div>
              </td>

              {/* Date */}
              <td className="py-4 px-5">
                <span className="text-xs text-slate-500">{formatDate(order.order_date)}</span>
              </td>

              {/* Item count */}
              <td className="py-4 px-5 text-right">
                <span className="font-mono text-xs text-slate-400 font-semibold">{order.items_count}</span>
              </td>

              {/* Status */}
              <td className="py-4 px-5 text-center">
                <StatusBadge status={order.status} />
              </td>

              {/* Total */}
              <td className="py-4 px-5 text-right">
                <span className="font-mono font-bold text-white text-sm">
                  ${order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default OrdersTable;
