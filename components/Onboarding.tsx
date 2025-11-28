import React, { useState } from 'react';
import { ArrowRight, Mail, Smartphone } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "VOCÊ NÃO TEM PROBLEMA DE PRODUTIVIDADE.",
      subtitle: "Tem problema de decisão.",
      bg: "bg-white",
      text: "text-black"
    },
    {
      title: "HOJE VOCÊ DECIDE O QUE CONTROLA.",
      subtitle: "Ou o dia decide por você.",
      bg: "bg-royal",
      text: "text-white"
    },
    {
      title: "BEM-VINDO AO EASYDAY.",
      subtitle: "Faça login para começar sua evolução.",
      bg: "bg-black",
      text: "text-white",
      isLogin: true
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center p-8 transition-colors duration-700 ${steps[step].bg}`}>
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 key={step}">
        <div className="space-y-4">
          <h1 className={`text-4xl md:text-5xl font-black tracking-tighter leading-[0.9] ${steps[step].text}`}>
            {steps[step].title}
          </h1>
          <p className={`text-xl font-medium opacity-80 ${steps[step].text}`}>
            {steps[step].subtitle}
          </p>
        </div>

        <div className="pt-12 space-y-4">
          {steps[step].isLogin ? (
             <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 delay-300">
               <button onClick={onComplete} className="w-full bg-white text-black py-4 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors">
                 <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                 Continuar com Google
               </button>
               <button onClick={onComplete} className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg font-bold flex items-center justify-center gap-3 border border-gray-800 hover:border-gray-600 transition-colors">
                 <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 invert" alt="Apple" />
                 Continuar com Apple
               </button>
               <button onClick={onComplete} className="w-full bg-transparent text-white py-4 rounded-lg font-bold flex items-center justify-center gap-3 border border-gray-800 hover:bg-gray-900 transition-colors">
                 <Mail size={20} />
                 Continuar com Email
               </button>
             </div>
          ) : (
            <button 
              onClick={handleNext}
              className={`
                group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105
                ${steps[step].bg === 'bg-white' ? 'bg-black text-white' : 'bg-white text-black'}
              `}
            >
              CONTINUAR
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        <div className="flex gap-2 justify-center pt-8">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${i === step ? 'w-8 opacity-100' : 'w-2 opacity-30'} ${steps[step].text === 'text-white' ? 'bg-white' : 'bg-black'}`} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};