import React from 'react';
import { Award, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from '../i18n/LanguageContext';

const ComparatorSection = ({ savedOffers, removeOffer }) => {
  const { t, formatCurrency } = useLanguage();

  if (savedOffers.length === 0) return null;

  // Helpers to find best values
  const calculateLoanTotal = (offer) => {
    // Sum of all payments (Principal + Interest) from the schedule
    if (offer.results.schedule) {
      return offer.results.schedule.reduce((acc, year) => acc + year.interest + year.principal, 0);
    }
    // Fallback if no schedule (shouldn't happen)
    return offer.results.monthlyPayment * offer.data.years * 12;
  };

  const calculateGlobalTotal = (offer) => {
    return calculateLoanTotal(offer) + (offer.results.expenses.total || 0);
  };

  // Find minimums
  const minPayment = Math.min(...savedOffers.map(o => o.results.monthlyPayment));
  const minGlobalTotal = Math.min(...savedOffers.map(o => calculateGlobalTotal(o)));
  const minRate = Math.min(...savedOffers.map(o => o.results.effectiveRate));

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-6 border border-slate-100 overflow-hidden">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Award className="text-indigo-500" />
        {t('compare.title')}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-xs">
              <th className="py-4 px-4 font-semibold">{t('compare.offer')}</th>
              <th className="py-4 px-4 font-semibold">{t('compare.type')}</th>
              <th className="py-4 px-4 font-semibold text-right">{t('compare.monthly')}</th>
              <th className="py-4 px-4 font-semibold text-right">{t('compare.rate')}</th>
              <th className="py-4 px-4 font-semibold text-right">{t('compare.loanTotal')}</th>
              <th className="py-4 px-4 font-semibold text-right hidden md:table-cell">{t('compare.upfront')}</th>
              <th className="py-4 px-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {savedOffers.map((offer) => {
               const payment = offer.results.monthlyPayment;
               // Average rate if mixed? No, initial effective rate is standard to show, maybe show both?
               // For simplicity, let's keep showing effectiveRate (initial) but user knows it varies.
               const rate = offer.results.effectiveRate;
               
               const loanTotal = calculateLoanTotal(offer);
               const globalTotal = calculateGlobalTotal(offer);
               
               const isBestPayment = payment === minPayment;
               const isBestOption = globalTotal === minGlobalTotal; // Based on Global Cost (Loan + Expenses)
               
               // const isBestRate = rate === minRate; // Not as relevant if we have Best Option

               return (
                 <tr key={offer.id} className={clsx("hover:bg-slate-50/80 transition-colors border-l-4", isBestOption ? "border-emerald-500 bg-emerald-50/30" : "border-transparent")}>
                   <td className="py-4 px-4">
                      <div className="font-bold text-slate-700">{offer.name}</div>
                      {isBestOption && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {t('compare.best')}
                        </span>
                      )}
                   </td>
                   <td className="py-4 px-4 capitalize text-slate-500">{t(`type.${offer.data.mortgageType}`)}</td>
                   
                   <td className="py-4 px-4 text-right">
                     <div className={clsx("inline-flex flex-col items-end", isBestPayment && "text-indigo-600 font-bold")}>
                        {formatCurrency(payment)}
                        {isBestPayment && <span className="text-[10px] bg-indigo-100 px-1.5 rounded text-indigo-700 mt-0.5">{t('compare.lowestPayment')}</span>}
                     </div>
                   </td>

                   <td className="py-4 px-4 text-right font-medium text-slate-600">
                        {rate.toFixed(2)}%
                   </td>

                   <td className="py-4 px-4 text-right">
                      <div className={clsx("font-medium", isBestOption ? "text-emerald-700" : "text-slate-600")}>
                        {formatCurrency(loanTotal)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {t('compare.withExpenses', { amount: formatCurrency(globalTotal) })}
                      </div>
                   </td>

                   <td className="py-4 px-4 text-right hidden md:table-cell text-slate-500">
                      {formatCurrency(offer.results.expenses.total)}
                   </td>

                   <td className="py-4 px-4 text-right">
                     <button 
                       onClick={() => removeOffer(offer.id)}
                       className="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-colors"
                     >
                       <Trash2 size={16} />
                     </button>
                   </td>
                 </tr>
               )
            })}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default ComparatorSection;
