
import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, Smartphone, Check, Lock, ShieldCheck, Copy } from 'lucide-react';

interface CheckoutViewProps {
  onSuccess: () => void;
  onCancel: () => void;
}

type PaymentMethod = 'pix' | 'card' | 'apple';

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onSuccess, onCancel }) => {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');
  
  // Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const handlePayment = () => {
    setIsLoading(true);
    setStep('processing');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 3000);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').trim().substring(0, 5);
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-200 animate-in zoom-in duration-500">
          <Check size={48} className="text-white" strokeWidth={4} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 text-center">BEM-VINDO À ELITE</h2>
        <p className="text-gray-500 font-bold text-center">Pagamento confirmado. Sua disciplina começa agora.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg mx-auto pb-32 animate-in slide-in-from-bottom-10">
      <div className="mb-8">
        <button onClick={onCancel} className="text-sm font-bold text-gray-400 hover:text-gray-900 mb-4">
          ← Voltar
        </button>
        <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-none mb-2">Checkout Seguro</h2>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Lock size={12} /> Criptografia de ponta a ponta
        </p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-gray-700">EasyDay PRO (Mensal)</span>
          <span className="font-black text-gray-900">R$ 14,90</span>
        </div>
        <div className="w-full h-px bg-gray-200 my-2"></div>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Total a pagar</span>
          <span className="font-bold text-xl text-royal">R$ 14,90</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <button 
          onClick={() => setMethod('pix')}
          className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${method === 'pix' ? 'border-royal bg-blue-50 text-royal' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'}`}
        >
          <QrCode size={24} />
          <span className="text-[10px] font-bold">PIX</span>
        </button>
        <button 
          onClick={() => setMethod('card')}
          className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${method === 'card' ? 'border-royal bg-blue-50 text-royal' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'}`}
        >
          <CreditCard size={24} />
          <span className="text-[10px] font-bold">Cartão</span>
        </button>
        <button 
          onClick={() => setMethod('apple')}
          className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${method === 'apple' ? 'border-royal bg-blue-50 text-royal' : 'border-gray-100 bg-white text-gray-400 hover:bg-gray-50'}`}
        >
          <Smartphone size={24} />
          <span className="text-[10px] font-bold">Apple Pay</span>
        </button>
      </div>

      {/* Method Content */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8 min-h-[300px]">
        {method === 'card' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">Número do Cartão</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="0000 0000 0000 0000" 
                  className="w-full p-3 bg-gray-50 rounded-xl font-mono font-bold text-gray-900 border-none focus:ring-2 focus:ring-royal transition-all"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  maxLength={19}
                />
                <CreditCard className="absolute right-4 top-3 text-gray-400" size={20} />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400">Nome no Cartão</label>
              <input 
                type="text" 
                placeholder="COMO NO CARTÃO" 
                className="w-full p-3 bg-gray-50 rounded-xl font-bold text-gray-900 border-none focus:ring-2 focus:ring-royal uppercase transition-all"
                value={cardName}
                onChange={(e) => setCardName(e.target.value.toUpperCase())}
              />
            </div>

            <div className="flex gap-4">
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">Validade</label>
                <input 
                  type="text" 
                  placeholder="MM/AA" 
                  className="w-full p-3 bg-gray-50 rounded-xl font-mono font-bold text-gray-900 border-none focus:ring-2 focus:ring-royal transition-all"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
              </div>
              <div className="space-y-1 flex-1">
                <label className="text-[10px] font-bold uppercase text-gray-400">CVV</label>
                <input 
                  type="text" 
                  placeholder="123" 
                  className="w-full p-3 bg-gray-50 rounded-xl font-mono font-bold text-gray-900 border-none focus:ring-2 focus:ring-royal transition-all"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )}

        {method === 'pix' && (
          <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in">
             <div className="w-48 h-48 bg-gray-900 rounded-xl flex items-center justify-center p-2 shadow-lg">
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=easyday-subscription-uuid-123`} alt="QR Code" className="w-full h-full rounded-lg bg-white" />
             </div>
             <div className="w-full">
               <label className="text-[10px] font-bold uppercase text-gray-400 mb-2 block text-center">Código Copia e Cola</label>
               <div className="flex gap-2">
                 <input readOnly value="00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000" className="flex-1 bg-gray-50 p-3 rounded-xl text-xs text-gray-500 truncate font-mono" />
                 <button className="p-3 bg-gray-200 rounded-xl hover:bg-gray-300">
                   <Copy size={16} />
                 </button>
               </div>
             </div>
             <div className="text-center space-y-1">
               <p className="text-xs font-bold text-green-600 flex items-center gap-1 justify-center"><ShieldCheck size={12}/> Aprovação Imediata</p>
               <p className="text-[10px] text-gray-400">Expira em 30 minutos</p>
             </div>
          </div>
        )}

        {method === 'apple' && (
          <div className="flex flex-col items-center justify-center h-full py-10 animate-in fade-in">
            <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
              <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-10 h-10 invert" alt="Apple" />
            </div>
            <p className="text-center text-gray-500 font-medium text-sm max-w-[200px] mb-6">
              Confirme com FaceID ou TouchID para assinar o plano EasyDay Pro.
            </p>
          </div>
        )}
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading || (method === 'card' && cardNumber.length < 10)}
        className={`
          w-full py-4 rounded-2xl font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl
          transition-all duration-300
          ${method === 'apple' ? 'bg-black text-white hover:bg-gray-900' : 'bg-royal text-white hover:bg-blue-600'}
          ${isLoading ? 'opacity-80 cursor-wait' : 'active:scale-[0.98]'}
        `}
      >
        {isLoading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            PROCESSANDO...
          </>
        ) : (
          <>
            {method === 'apple' ? 'Pagar com Apple Pay' : 'Pagar Agora'}
          </>
        )}
      </button>
    </div>
  );
};
