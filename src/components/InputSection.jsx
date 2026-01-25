import React, { useMemo } from 'react';
import { Home, PiggyBank, Calendar, Percent, CheckCircle, Circle, Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { calculateBonusProfitability } from '../utils/mortgageCalculations';
import clsx from 'clsx';

const InputSection = ({ data, updateData, updateBonus, toggleBonus, addBonus, removeBonus, currentEffectiveRate, principal }) => {
  const formatCurrency = (val) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 space-y-8 border border-slate-100">
      
      {/* Mortgage Type Tabs */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex relative">
        {['fixed', 'variable', 'mixed'].map((type) => (
          <button
            key={type}
            onClick={() => updateData('mortgageType', type)}
            className={clsx(
              "flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-300 capitalize z-10",
              data.mortgageType === type 
                ? "bg-white text-indigo-600 shadow-md transform scale-[1.02]" 
                : "text-slate-500 hover:text-indigo-500"
            )}
          >
            {type === 'fixed' ? 'Fija' : type === 'variable' ? 'Variable' : 'Mixta'}
          </button>
        ))}
      </div>

      {/* Property Price */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-600 block">Precio vivienda</label>
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
           <Home size={20} className="text-indigo-500" />
           <input 
              type="number" 
              value={data.propertyPrice}
              onChange={(e) => updateData('propertyPrice', Number(e.target.value))}
              className="bg-transparent font-bold text-lg w-full focus:outline-none text-slate-800"
           />
           <span className="text-slate-400 font-medium">€</span>
        </div>
        <input 
          type="range" 
          min="50000" 
          max="1000000" 
          step="1000"
          value={data.propertyPrice}
          onChange={(e) => updateData('propertyPrice', Number(e.target.value))}
          className="input-slider"
        />
      </div>

      {/* Savings / Down Payment */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-600 block">Ahorros aportados</label>
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
           <PiggyBank size={20} className="text-emerald-500" />
           <input 
              type="number" 
              value={data.savings}
              onChange={(e) => updateData('savings', Number(e.target.value))}
              className="bg-transparent font-bold text-lg w-full focus:outline-none text-slate-800"
           />
           <span className="text-slate-400 font-medium">€</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max={data.propertyPrice * 0.8}
          step="1000"
          value={data.savings}
          onChange={(e) => updateData('savings', Number(e.target.value))}
          className="input-slider accent-emerald-500"
        />
      </div>

      {/* Years */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-slate-600 block">Plazo (años)</label>
        <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
           <Calendar size={20} className="text-violet-500" />
           <input 
              type="number" 
              value={data.years}
              onChange={(e) => updateData('years', Number(e.target.value))}
              className="bg-transparent font-bold text-lg w-full focus:outline-none text-slate-800"
           />
           <span className="text-slate-400 font-medium">años</span>
        </div>
        <input 
          type="range" 
          min="5" 
          max="40" 
          step="1"
          value={data.years}
          onChange={(e) => updateData('years', Number(e.target.value))}
          className="input-slider accent-violet-500"
        />
      </div>

      {/* Fixed Period (Mixed Only) */}
      {data.mortgageType === 'mixed' && (
        <div className="space-y-4 animate-fade-in">
          <label className="text-sm font-medium text-slate-600 block">Periodo Fijo (años)</label>
          <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
             <Calendar size={20} className="text-indigo-500" />
             <input 
                type="number" 
                value={data.fixedYears}
                onChange={(e) => updateData('fixedYears', Number(e.target.value))}
                className="bg-transparent font-bold text-lg w-full focus:outline-none text-slate-800"
             />
             <span className="text-slate-400 font-medium">años fijos</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max={data.years - 1} // Can't be more than total years
            step="1"
            value={data.fixedYears}
            onChange={(e) => updateData('fixedYears', Number(e.target.value))}
            className="input-slider accent-indigo-500"
          />
        </div>
      )}

      {/* Interest Rate Inputs */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Percent size={18} className="text-amber-500" />
          <span className="font-semibold text-slate-700">Intereses</span>
        </div>
        
        {/* Fixed Part Input */}
        {(data.mortgageType === 'fixed' || data.mortgageType === 'mixed') && (
           <div className="flex justify-between items-center">
             <label className="text-sm text-slate-500">
                {data.mortgageType === 'mixed' ? 'Tipo Fijo (Inicial)' : 'Tipo Fijo'}
             </label>
             <input 
               type="number" step="0.05" value={data.baseRateFixed}
               onChange={(e) => updateData('baseRateFixed', Number(e.target.value))}
               className="w-24 text-right bg-white border border-slate-200 rounded-lg px-3 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
             />
           </div>
        )}

        {/* Separator for Mixed */}
        {data.mortgageType === 'mixed' && <hr className="border-slate-200" />}

        {/* Variable Part Input */}
        {(data.mortgageType === 'variable' || data.mortgageType === 'mixed') && (
           <div className="space-y-2">
             {data.mortgageType === 'mixed' && (
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">Resto Variable</label>
             )}
             <div className="flex justify-between items-center">
               <label className="text-sm text-slate-500">Euribor actual</label>
               <input 
                 type="number" step="0.05" value={data.euribor}
                 onChange={(e) => updateData('euribor', Number(e.target.value))}
                 className="w-24 text-right bg-white border border-slate-200 rounded-lg px-3 py-1"
               />
             </div>
             <div className="flex justify-between items-center">
               <label className="text-sm text-slate-500">Diferencial</label>
               <input 
                 type="number" step="0.05" value={data.baseRateVarSpread}
                 onChange={(e) => updateData('baseRateVarSpread', Number(e.target.value))}
                 className="w-24 text-right bg-white border border-slate-200 rounded-lg px-3 py-1"
               />
             </div>
             <div className="text-right text-xs text-slate-400">
               Total Variable: <span className="font-bold">{(data.euribor + data.baseRateVarSpread).toFixed(2)}%</span>
             </div>
           </div>
        )}
      </div>

      {/* Editable Bonuses */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Bonificaciones</h3>
          <button 
            onClick={addBonus}
            className="text-xs flex items-center gap-1 text-indigo-600 font-medium hover:bg-indigo-50 px-2 py-1 rounded-lg transition-colors"
          >
            <Plus size={14} /> Añadir
          </button>
        </div>
        
        <div className="space-y-3">
          {data.bonuses.map((bonus, index) => {
            // Profitability Check
            // Base rate for comparison is Current Effeective Rate + This Bonus Discount (to see what happens if we remove it) 
            // OR Base Rate - (Other Bonuses). 
            // Simpson's paradox avoidance: Let's calculate profitability based on the "marginal gain" of adding this bonus.
            // Effective Rate WITHOUT this bonus = currentEffectiveRate + (bonus.checked ? bonus.discount : 0)
            const rateWithoutThis = currentEffectiveRate + (bonus.checked ? bonus.discount : 0);
            
            const analysis = calculateBonusProfitability({
              principal,
              years: data.years,
              baseRate: rateWithoutThis, 
              bonusDiscount: bonus.discount,
              annualCost: bonus.cost
            });

            return (
              <div 
                key={bonus.id}
                className={clsx(
                  "p-3 rounded-xl border transition-all space-y-3 relative group",
                  bonus.checked ? "bg-indigo-50/50 border-indigo-200" : "bg-white border-slate-100"
                )}
              >
                {/* Header: Checkbox + Name + Delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <button onClick={() => toggleBonus(index)} className={clsx("transition-colors", bonus.checked ? "text-indigo-600" : "text-slate-300")}>
                      {bonus.checked ? <CheckCircle size={20} className="fill-indigo-100" /> : <Circle size={20} />}
                    </button>
                    <input 
                      type="text" 
                      value={bonus.name}
                      onChange={(e) => updateBonus(index, 'name', e.target.value)}
                      className="bg-transparent text-sm font-medium text-slate-700 w-full focus:outline-none"
                    />
                  </div>
                  {!bonus.isDefault && (
                    <button onClick={() => removeBonus(index)} className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                {/* Inputs: Discount & Cost */}
                {bonus.checked && (
                  <div className={clsx("grid gap-3 pl-8", bonus.id === 'payroll' ? "grid-cols-1" : "grid-cols-2")}>
                     <div>
                       <label className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold block mb-1">Descuento (%)</label>
                       <input 
                          type="number" step="0.05"
                          value={bonus.discount}
                          onChange={(e) => updateBonus(index, 'discount', Number(e.target.value))}
                          className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 text-emerald-600 font-bold"
                       />
                     </div>
                     {bonus.id !== 'payroll' && (
                       <div>
                         <label className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold block mb-1">Coste Anual (€)</label>
                         <input 
                            type="number" step="10"
                            value={bonus.cost}
                            onChange={(e) => updateBonus(index, 'cost', Number(e.target.value))}
                            className="w-full text-sm bg-white border border-slate-200 rounded px-2 py-1 text-slate-600"
                         />
                       </div>
                     )}
                  </div>
                )}

                {/* Profitability Badge */}
                {bonus.checked && bonus.id !== 'payroll' && (
                  <div className={clsx(
                    "ml-8 text-xs p-2 rounded-lg flex items-center gap-2",
                    analysis.isProfitable ? "bg-emerald-100 text-emerald-800" : "bg-red-50 text-red-700"
                  )}>
                    {analysis.isProfitable ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span className="font-medium">
                      {analysis.isProfitable ? "Rentable" : "No rentable"}
                    </span>
                    <span className="opacity-75">
                      (Neto: {analysis.net > 0 ? '+' : ''}{formatCurrency(analysis.net)})
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default InputSection;
