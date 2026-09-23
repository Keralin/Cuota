import React, { useState, useEffect } from 'react';
import InputSection from './InputSection';
import ResultsSection from './ResultsSection';
import ComparatorSection from './ComparatorSection';
import { calculateMonthlyPayment, calculateEffectiveRate, calculateExpenses, calculateAmortizationSchedule, DEFAULT_BONUSES } from '../utils/mortgageCalculations';
import { useLanguage } from '../i18n/LanguageContext';

const MortageCalculator = () => {
  const { t } = useLanguage();
  // Default values
  const [data, setData] = useState({
    mortgageType: 'fixed', // fixed, variable, mixed
    propertyPrice: 300000,
    savings: 60000, 
    years: 30,
    fixedYears: 10, // Mixed only: years at the fixed rate before switching to variable
    baseRateFixed: 2.80,
    baseRateVarSpread: 0.60,
    euribor: 2.50,
    bonuses: DEFAULT_BONUSES, // Now using the array of object structure
  });

  const [results, setResults] = useState(null);
  const [savedOffers, setSavedOffers] = useState([]);

  useEffect(() => {
    const principal = data.propertyPrice - data.savings;
    const rateType = data.mortgageType;
    // Calculate Rates
    let initialBaseRate = 0;
    let subsequentBaseRate = 0;

    if (rateType === 'fixed') {
      initialBaseRate = data.baseRateFixed;
      subsequentBaseRate = data.baseRateFixed; // No change
    } else if (rateType === 'variable') {
      initialBaseRate = data.euribor + data.baseRateVarSpread;
      subsequentBaseRate = initialBaseRate; // No change
    } else {
      // Mixed
      initialBaseRate = data.baseRateFixed;
      subsequentBaseRate = data.euribor + data.baseRateVarSpread;
    }

    // Apply bonuses to both rates
    const effectiveInitialRate = calculateEffectiveRate(initialBaseRate, data.bonuses);
    const effectiveSubsequentRate = calculateEffectiveRate(subsequentBaseRate, data.bonuses);

    const monthlyPayment = calculateMonthlyPayment(principal, effectiveInitialRate, data.years);
    const expenses = calculateExpenses(data.propertyPrice);
    
    const schedule = calculateAmortizationSchedule(principal, {
      initialRate: effectiveInitialRate,
      subsequentRate: effectiveSubsequentRate,
      // Clamp so shortening the term never leaves the fixed period covering the whole loan
      fixedYears: rateType === 'mixed' ? Math.min(data.fixedYears, data.years - 1) : 0
    }, data.years);

    setResults({
      monthlyPayment,
      effectiveRate: effectiveInitialRate,
      effectiveSubsequentRate,
      expenses,
      schedule,
      principal
    });
  }, [data]);

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Bonus Management
  const updateBonus = (index, field, value) => {
    setData(prev => {
      const newBonuses = [...prev.bonuses];
      newBonuses[index] = { ...newBonuses[index], [field]: value };
      return { ...prev, bonuses: newBonuses };
    });
  };

  const toggleBonus = (index) => {
    setData(prev => {
      const newBonuses = [...prev.bonuses];
      newBonuses[index] = { ...newBonuses[index], checked: !newBonuses[index].checked };
      return { ...prev, bonuses: newBonuses };
    });
  };

  const addBonus = () => {
    setData(prev => ({
      ...prev,
      bonuses: [...prev.bonuses, { id: Date.now(), name: t('bonus.new'), discount: 0.10, cost: 0, checked: true }]
    }));
  };

  const removeBonus = (index) => {
    setData(prev => {
      const newBonuses = prev.bonuses.filter((_, i) => i !== index);
      return { ...prev, bonuses: newBonuses };
    });
  };

  // Offer Saving
  const saveOffer = () => {
    const name = prompt(t('offer.prompt'), t('offer.default', { n: savedOffers.length + 1 }));
    if (name) {
      setSavedOffers([...savedOffers, { id: Date.now(), name, data: { ...data }, results: { ...results } }]);
    }
  };

  const removeOffer = (id) => {
    setSavedOffers(savedOffers.filter(o => o.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-8">
      
      {/* Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 xl:col-span-4 space-y-6">
          <InputSection 
            data={data} 
            updateData={updateData} 
            updateBonus={updateBonus}
            toggleBonus={toggleBonus}
            addBonus={addBonus}
            removeBonus={removeBonus}
            currentEffectiveRate={results ? results.effectiveRate : 0}
            principal={results ? results.principal : 0}
          />
        </div>
        <div className="lg:col-span-8 xl:col-span-8 space-y-6">
           {results && (
             <ResultsSection 
               results={results} 
               data={data} 
               saveOffer={saveOffer}
               savedOffers={savedOffers}
               removeOffer={removeOffer}
             />
           )}
        </div>
      </div>
    </div>
  );
};

export default MortageCalculator;
