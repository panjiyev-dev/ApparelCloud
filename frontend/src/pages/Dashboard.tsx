import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Boxes, ClipboardList, ArrowUpRight } from 'lucide-react';
import KPICards from '../components/KPICards';
import SalesChart from '../components/SalesChart';
import InventoryChart from '../components/InventoryChart';
import OrdersTable from '../components/OrdersTable';
import { useDashboardStats, useSalesChart, useInventoryDistribution, useOrders } from '../hooks/useApi';
import { Order } from '../types';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 6)  return 'Yaxshi tun';
  if (h < 12) return 'Xayrli tong';
  if (h < 17) return 'Xayrli kun test';
  if (h < 21) return 'Xayrli kech';
  return 'Yaxshi oqshom';
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const greeting = useMemo(getGreeting, []);

  const { data: stats,      isLoading: statsLoading   } = useDashboardStats();
  const { data: salesChart, isLoading: salesLoading   } = useSalesChart(30);
  const { data: invChart,   isLoading: invLoading     } = useInventoryDistribution();
  const { data: ordersData, isLoading: ordersLoading  } = useOrders({ page: 1, limit: 5 });

  const handleOrderClick = (order: Order) => navigate(`/orders?id=${order.id}`);

  const now = new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 animate-fade-up">

      {/* ── Hero row ──────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{now}</span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight">
            {greeting} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Bugungi biznes holatiga ulgurji ko&apos;rinish
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/inventory"
            className="btn-ghost text-xs px-4 py-2"
          >
            <Boxes size={14} className="text-gold-400 flex-shrink-0" />
            Omborni boshqarish
          </Link>
          <Link
            to="/orders"
            className="btn-primary text-xs px-4 py-2"
          >
            <ClipboardList size={14} />
            Buyurtmalar
          </Link>
        </div>
      </div>

      {/* ── KPI cards ─────────────────────────────────── */}
      <KPICards stats={stats} isLoading={statsLoading} />

      {/* ── Charts row ────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2">
          <SalesChart data={salesChart} isLoading={salesLoading} />
        </div>
        <div>
          <InventoryChart data={invChart} isLoading={invLoading} />
        </div>
      </div>

      {/* ── Recent orders ─────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white">So&apos;nggi buyurtmalar</h2>
            <p className="text-xs text-slate-500 mt-0.5">Oxirgi 5 ta B2B buyurtma</p>
          </div>
          <Link
            to="/orders"
            className="flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors group"
          >
            Barchasi
            <ArrowRight size={13} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {!ordersLoading && (!ordersData?.items?.length) ? (
          <div
            className="flex flex-col items-center justify-center py-16 rounded-2xl text-center"
            style={{ background: 'rgba(14,20,32,0.6)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.12)' }}
            >
              <ClipboardList size={24} className="text-gold-400" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">Buyurtmalar yo&apos;q</p>
            <p className="text-xs text-slate-500 mb-4">Birinchi buyurtmani yarating</p>
            <Link
              to="/orders"
              className="btn-primary text-xs px-4 py-2 gap-1.5"
            >
              Buyurtma yaratish
              <ArrowUpRight size={13} />
            </Link>
          </div>
        ) : (
          <OrdersTable
            orders={ordersData?.items}
            isLoading={ordersLoading}
            onRowClick={handleOrderClick}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
