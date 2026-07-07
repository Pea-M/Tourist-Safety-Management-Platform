import React, { useState } from 'react';
import { ShieldCheck, User, Lock, CheckCircle, LoaderCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (touristId: string) => void;
}

// --- Component for the Onboarding Form ---
// By defining this outside the main LoginPage component, we fix the typing issue.
const OnboardingComponent: React.FC<{ onLogin: (touristId: string) => void }> = ({ onLogin }) => {
  const [formData, setFormData] = useState({ name: '', passport: '' });
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.passport) {
      alert('Please fill in all fields.');
      return;
    }
    setFormStatus('loading');
    setTimeout(() => {
      setFormStatus('success');
    }, 2000);
  };
  
  const handleProceed = () => {
      const mockId = `T-ID:${formData.passport.slice(-4)}-${Date.now().toString().slice(-4)}`;
      onLogin(mockId);
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm text-center w-full">
      <div className="flex justify-center items-center mb-4">
        <ShieldCheck size={48} className="text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Your Digital ID</h2>
      <p className="text-gray-600 mb-6">Enter your details to generate a unique, tamper-proof ID on the blockchain.</p>
      
      {formStatus !== 'success' && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
            <User className="text-gray-400" />
            <input name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-transparent focus:outline-none" />
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
            <Lock className="text-gray-400" />
            <input name="passport" type="text" value={formData.passport} onChange={handleInputChange} placeholder="Passport / Aadhaar Number" className="w-full bg-transparent focus:outline-none" />
          </div>
          <button
            type="submit"
            disabled={formStatus === 'loading'}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {formStatus === 'loading' ? (<><LoaderCircle className="animate-spin" /><span>Securing on Blockchain...</span></>) : ('Generate & Secure My ID')}
          </button>
        </form>
      )}
      
      {formStatus === 'success' && (
        <div className="space-y-4">
          <div className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white bg-green-500">
            <CheckCircle />
            <span>ID Secured!</span>
          </div>
          <p className="text-sm text-green-700 font-medium">Thanks to blockchain, your digital ID is secured.</p>
          {/* --- CHANGE: This button now lets you proceed manually --- */}
          <button
            onClick={handleProceed}
            className="w-full mt-4 py-3 px-4 rounded-lg font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700"
          >
            Proceed to App
          </button>
        </div>
      )}
    </div>
  );
};

// --- Component for the Privacy Policy ---
const PrivacyPolicyComponent: React.FC<{ onAgree: () => void }> = ({ onAgree }) => {
    const [hasAgreed, setHasAgreed] = useState(false);
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm w-full">
            <div className="flex items-center space-x-3 mb-4"><ShieldCheck className="w-8 h-8 text-blue-600" /><h2 className="text-xl font-bold text-gray-900">Data Privacy & Consent</h2></div>
            <p className="text-sm text-gray-600 mb-4">Our practices are in accordance with THE <strong>DIGITAL PERSONAL DATA PROTECTION ACT, 2023</strong>. Please review our policy before proceeding.</p>
            <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 text-xs text-gray-700 space-y-3 bg-gray-50"><h4 className="font-semibold">1. Information We Collect</h4><p><strong>Personal Information:</strong> Name, email, phone number, and emergency contacts provided during registration.</p><p><strong>Location Data:</strong> Real-time GPS location when the app is active, for SOS and safety monitoring.</p><p><strong>User-Generated Content:</strong> Photos and reviews you voluntarily post.</p><p><strong>Technical Data:</strong> Device info and usage logs to ensure service performance.</p><h4 className="font-semibold">2. Use of Information</h4><p>To provide safety services, send alerts to emergency contacts and authorities, and improve tourism safety trends.</p><h4 className="font-semibold">3. Sharing of Information</h4><p>Personal data will not be shared, except with your nominated emergency contacts or authorized public authorities during emergencies.</p><h4 className="font-semibold">4. Data Security & Storage</h4><p>Personal information is stored on secure servers with encryption. Blockchain is used to store hashes of IDs for tamper-proof logging without exposing personal data.</p><h4 className="font-semibold">5. Consent</h4><p>By proceeding, you consent to the collection, use, and storage of your information as described.</p></div>
            <div className="mt-4"><label className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={hasAgreed} onChange={(e) => setHasAgreed(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="text-sm text-gray-800">I have read and agree to the Terms and Conditions.</span></label></div>
            <button onClick={onAgree} disabled={!hasAgreed} className="w-full mt-4 py-3 px-4 rounded-lg font-semibold text-white transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">Continue</button>
        </div>
    );
};


const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full">
        {showPrivacyPolicy ? (
          <PrivacyPolicyComponent onAgree={() => setShowPrivacyPolicy(false)} />
        ) : (
          <OnboardingComponent onLogin={onLogin} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;

