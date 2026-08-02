# Cuota 🏠

A modern, free, and open-source mortgage calculator built with React. No signup required, no personal data collected.

**Live at [cuota.pages.dev](https://cuota.pages.dev)**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **Mortgage Types**: Supports Fixed, Variable, and Mixed-rate mortgages
- **Real-time Calculation**: Instant updates as you adjust parameters
- **Offer Comparison**: Save and compare multiple mortgage offers side-by-side
- **Smart Badges**: Automatically highlights "Best Option" (lowest total cost) and "Lowest Payment"
- **Interactive Charts**: Visualize debt evolution and interest vs principal breakdown
- **Expense Breakdown**: Detailed breakdown of purchase costs (taxes, notary, registry, etc.)
- **Spanish Market Focus**: Tailored for Spanish mortgage products with Euribor integration
- **Privacy First**: 100% client-side, no backend, no cookies, no tracking

## 🖥️ Screenshots

*Coming soon*

## 🚀 Getting Started

### Prerequisites

- Node.js 22+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Keralin/Cuota.git
cd Cuota

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🚢 Deployment

Hosted on [Cloudflare Pages](https://cuota.pages.dev). Every push to `main` builds and deploys automatically via GitHub Actions (`.github/workflows/deploy.yml`). Manual deploy: `npm run deploy`.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── Calculator.jsx      # Main calculator orchestrator
│   ├── InputSection.jsx    # User input controls (sliders, toggles)
│   ├── ResultsSection.jsx  # Results display with charts
│   └── ComparatorSection.jsx # Offer comparison table
├── utils/
│   └── mortgageCalculations.js # Core calculation logic
├── App.jsx                 # Root component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## 📊 Calculation Logic

### Monthly Payment Formula
Uses the standard amortization formula:
```
M = P * [r(1+r)^n] / [(1+r)^n - 1]
```
Where:
- M = Monthly payment
- P = Principal (loan amount)
- r = Monthly interest rate
- n = Total number of payments

### Mixed Mortgage Support
For mixed-rate mortgages, the calculator:
1. Applies the fixed rate for the initial period
2. Recalculates the monthly payment when switching to the variable rate
3. Uses the remaining balance and remaining term for the new calculation

### Total Cost Comparison
The "Best Option" badge is awarded based on the true total cost:
- Sum of all payments from the amortization schedule
- Plus initial expenses (taxes, notary, registry, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the need for transparent mortgage calculators in Spain
- Built with modern web technologies for the best user experience

---

Made with ❤️ for homebuyers everywhere
