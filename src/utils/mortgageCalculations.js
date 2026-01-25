// Default starting bonuses, now fully editable by user
// isDefault: true means these cannot be deleted (standard in Spanish mortgages)
export const DEFAULT_BONUSES = [
  { id: 'payroll', name: 'Nómina', discount: 0.50, cost: 0, checked: false, isDefault: true }, 
  { id: 'lifeInsurance', name: 'Seguro de vida', discount: 0.30, cost: 300, checked: false, isDefault: true },
  { id: 'homeInsurance', name: 'Seguro de hogar', discount: 0.20, cost: 200, checked: false, isDefault: true },
];

/**
 * Calculates the monthly mortgage payment.
 * @param {number} principal - Amount to borrow (Price - Down Payment).
 * @param {number} annualRate - Annual interest rate (%).
 * @param {number} years - Loan term in years.
 * @returns {number} Monthly payment.
 */
export const calculateMonthlyPayment = (principal, annualRate, years) => {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate <= 0) return principal / (years * 12);

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  return (
    (principal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -numberOfPayments))
  );
};

/**
 * Calculates the amortization schedule.
 * @param {number} principal 
 * @param {number} annualRate 
 * @param {number} years 
 * @returns {Array} Array of year-by-year summary.
 */
/**
 * Calculates the amortization schedule.
 * Supports Fixed, Variable, and Mixed types.
 * @param {number} principal 
 * @param {Object} rateConfig - { initialRate, subsequentRate, fixedYears }
 * @param {number} years 
 * @returns {Array} Array of year-by-year summary.
 */
export const calculateAmortizationSchedule = (principal, rateConfig, years) => {
  let balance = principal;
  const schedule = [];
  
  // Extract config
  const { initialRate, subsequentRate, fixedYears = 0 } = rateConfig;

  // Initial phase (Fixed or standard)
  let currentAnnualRate = initialRate;
  let monthlyRate = currentAnnualRate / 100 / 12;
  let monthlyPayment = calculateMonthlyPayment(principal, currentAnnualRate, years);

  for (let year = 1; year <= years; year++) {
    // Check if we need to switch rates (Mixed Mortgage)
    if (fixedYears > 0 && year === fixedYears + 1) {
      currentAnnualRate = subsequentRate;
      monthlyRate = currentAnnualRate / 100 / 12;
      // Recalculate payment based on REMAINING balance and REMAINING years
      const remainingYears = years - fixedYears;
      monthlyPayment = calculateMonthlyPayment(balance, currentAnnualRate, remainingYears);
    }

    let interestYear = 0;
    let principalYear = 0;

    for (let month = 1; month <= 12; month++) {
      if (balance <= 0) break;
      const interestMonth = balance * monthlyRate;
      const principalMonth = monthlyPayment - interestMonth;
      
      interestYear += interestMonth;
      principalYear += principalMonth;
      balance -= principalMonth;
    }
    
    // Adjust final balance to 0 if close enough
    if (balance < 1) balance = 0;

    schedule.push({
      year,
      interest: interestYear,
      principal: principalYear,
      remainingBalance: balance,
      rate: currentAnnualRate // Useful for debugging or display
    });
  }
  return schedule;
};

/**
 * Calculates estimated expenses associated with the purchase.
 * Note: simplified estimation for Spain.
 * @param {number} propertyValue 
 * @returns {Object} detailed expenses
 */
export const calculateExpenses = (propertyValue) => {
  // Approximate standard rates
  const itpRate = 0.08; // Average ITP (varies 6-10%)
  const notaryRate = 0.003; // Approx 0.3%
  const registryRate = 0.002; // Approx 0.2%
  const managementFee = 400; // Gestoría
  const appraisalFee = 350; // Tasación

  const itp = propertyValue * itpRate;
  const notary = Math.max(500, propertyValue * notaryRate); // Min 500
  const registry = Math.max(300, propertyValue * registryRate); // Min 300

  return {
    itp,
    notary,
    registry,
    management: managementFee,
    appraisal: appraisalFee,
    total: itp + notary + registry + managementFee + appraisalFee,
  };
};

/**
 * Calculates the effective interest rate based on active bonuses.
 * @param {number} baseRate 
 * @param {Array} bonuses - Array of bonus objects { checked, discount }
 * @returns {number} Effective Rate
 */
export const calculateEffectiveRate = (baseRate, bonuses) => {
  let discount = 0;
  bonuses.forEach(b => {
    if (b.checked) discount += b.discount;
  });
  // Ensure rate doesn't go below 0 (unlikely but safe)
  return Math.max(0, baseRate - discount);
};

/**
 * Analyzes the profitability of a specific bonus.
 * @param {Object} params - { principal, years, baseRate, bonusDiscount, annualCost }
 * @returns {Object} { savings, cost, net, isProfitable }
 */
export const calculateBonusProfitability = ({ principal, years, baseRate, bonusDiscount, annualCost }) => {
  // Scenario A: Without this bonus
  const rateA = baseRate;
  // Scenario B: With this bonus ONLY (assuming marginal benefit) 
  // Note: accurately, we should compare "Current Rate" vs "Current Rate - Discount".
  // Let's assume baseRate passed in is the rate WITHOUT this specific bonus.
  const rateB = Math.max(0, baseRate - bonusDiscount);

  const monthlyPaymentA = calculateMonthlyPayment(principal, rateA, years);
  const monthlyPaymentB = calculateMonthlyPayment(principal, rateB, years);

  const totalPaidA = monthlyPaymentA * years * 12;
  const totalPaidB = monthlyPaymentB * years * 12;

  const grossSavings = totalPaidA - totalPaidB;
  const totalCost = annualCost * years;

  const net = grossSavings - totalCost;

  return {
    grossSavings,
    totalCost,
    net,
    isProfitable: net > 0
  };
};
