import React from 'react';
import MortageCalculator from './components/Calculator';
import { Calculator, Github } from 'lucide-react';
import clsx from 'clsx';
import { useLanguage } from './i18n/LanguageContext';

function App() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Calculator size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              Cuo<span className="text-indigo-600">ta</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
          <div role="group" aria-label={t('lang.switch')} className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {['es', 'en'].map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={clsx(
                  "px-2.5 py-1 rounded-md uppercase transition-colors",
                  lang === code ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-indigo-500"
                )}
              >
                {code}
              </button>
            ))}
          </div>
          <a
            href="https://github.com/Keralin/cuota"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <Github size={20} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <div className="bg-indigo-900 text-white py-12 md:py-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/10"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              {t('hero.title')} <br className="hidden md:block" />
              <span className="text-indigo-300">{t('hero.titleAccent')}</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>

        <div className="-mt-12 relative z-20">
          <MortageCalculator />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Cuota.
          </p>
          <p className="text-slate-400 text-sm mt-2">
            {t('footer.love')}
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
