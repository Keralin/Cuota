import { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import clsx from 'clsx';
import { ArrowDownCircle, Banknote, Building2, Landmark, FileText, Briefcase, Save } from 'lucide-react';
import ComparatorSection from './ComparatorSection';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

const ResultsSection = ({ results, data, saveOffer, savedOffers, removeOffer }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);


  // Prepare chart data
  const chartData = useMemo(() => {
    const labels = results.schedule.map(y => `Año ${y.year}`);
    const remainingBalance = results.schedule.map(y => y.remainingBalance);
    
    return {
      labels,
      datasets: [
        {
          label: 'Pendiente',
          data: remainingBalance,
          borderColor: 'rgb(99, 102, 241)', // Indigo 500
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [results.schedule, data]);

  // Stacked Bar Data (Amortization Breakdown)
  const breakdownData = useMemo(() => {
    // Aggregate by year is already done in schedule
    const labels = results.schedule.map(y => `Año ${y.year}`);
    const interest = results.schedule.map(y => y.interest);
    const principal = results.schedule.map(y => y.principal);

    return {
      labels,
      datasets: [
        {
          label: 'Intereses',
          data: interest,
          backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red 500
          stack: 'Stack 0',
        },
        {
          label: 'Capital Amortizado',
          data: principal,
          backgroundColor: 'rgba(16, 185, 129, 0.7)', // Emerald 500
          stack: 'Stack 0',
        },
      ]
    };
  }, [results.schedule]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { 
        mode: 'index', 
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
        }
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { maxTicksLimit: 6 } },
      y: { grid: { color: '#f1f5f9' }, ticks: { callback: (val) => `${val / 1000}k` } }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
        }
      }
    },
    scales: {
      x: { 
        stacked: true, 
        grid: { display: false },
        ticks: { maxTicksLimit: 10 }
      },
      y: { 
        stacked: true,
        grid: { color: '#f1f5f9' },
        ticks: { maxTicksLimit: 6, callback: (val) => `${val / 1000}k` }
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Result Card */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <div className="flex items-center justify-between mb-1">
               <p className="text-indigo-200 font-medium uppercase tracking-wide text-sm">Tu cuota mensual</p>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              {formatCurrency(results.monthlyPayment).replace('€', '')}
              <span className="text-2xl md:text-3xl font-normal opacity-80">€</span>
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <span className="bg-indigo-500/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-indigo-400/30">
                TAE estimado: {(results.effectiveRate + 0.2).toFixed(2)}%
              </span>
              <span className="bg-indigo-500/50 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-indigo-400/30">
                TIN: {results.effectiveRate.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end gap-4">
             <button 
                onClick={saveOffer}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm transition-all border border-white/10"
             >
               <Save size={16} />
               Guardar
             </button>
             <div>
               <div className="text-indigo-200 text-sm mb-1">Total a devolver</div>
               <div className="text-2xl font-semibold">
                 {formatCurrency(results.monthlyPayment * data.years * 12)}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Comparator (Placed here for high visibility) */}
      {savedOffers && savedOffers.length > 0 && (
        <div className="animate-fade-in-up">
          <ComparatorSection savedOffers={savedOffers} removeOffer={removeOffer} />
        </div>
      )}

      {/* Expenses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Breakdown Panel */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
           <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Banknote size={20} className="text-slate-400" />
             Desglose de gastos
           </h3>
           <div className="space-y-4">
             <ExpenseRow 
                icon={<Building2 size={16} />} 
                label="Impuestos (ITP)" 
                value={results.expenses.itp} 
                color="bg-blue-100 text-blue-600"
             />
             <ExpenseRow 
                icon={<Landmark size={16} />} 
                label="Notaría" 
                value={results.expenses.notary} 
                color="bg-amber-100 text-amber-600"
             />
             <ExpenseRow 
                icon={<FileText size={16} />} 
                label="Registro" 
                value={results.expenses.registry} 
                color="bg-purple-100 text-purple-600"
             />
              <ExpenseRow 
                icon={<Briefcase size={16} />} 
                label="Gestoría" 
                value={results.expenses.management} 
                color="bg-slate-100 text-slate-600"
             />
             <div className="border-t border-slate-100 pt-3 flex justify-between items-center mt-2">
               <span className="font-semibold text-slate-600">Total gastos</span>
               <span className="font-bold text-slate-800">{formatCurrency(results.expenses.total)}</span>
             </div>
           </div>
        </div>

        {/* Funds Summary */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Necesitas en total</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center text-slate-500">
                <span>Entrada (Ahorros)</span>
                <span>{formatCurrency(data.savings)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Gastos e Impuestos</span>
                <span>{formatCurrency(results.expenses.total)}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                 <span className="font-bold text-slate-700">Ahorro necesario</span>
                 <span className="font-bold text-xl text-indigo-600">
                    {formatCurrency(data.savings + results.expenses.total)}
                 </span>
              </div>
              <p className="text-xs text-slate-400 text-center">
                *Cálculos aproximados según normativa estándar.
              </p>
            </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8">
        {/* Balance Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Evolución Deuda</h3>
          <div className="h-[400px] w-full">
             <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Interest vs Principal Chart (New) */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Intereses vs Capital</h3>
          <div className="h-[400px] w-full">
             <Bar data={breakdownData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpenseRow = ({ icon, label, value, color }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className={clsx("p-1.5 rounded-lg", color)}>
          {icon}
        </div>
        <span className="text-sm font-medium text-slate-600">{label}</span>
      </div>
      <span className="font-semibold text-slate-700">{formatCurrency(value)}</span>
    </div>
  )
}

export default ResultsSection;
