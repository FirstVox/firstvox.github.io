import React, { useEffect, useRef, useState } from 'react';
import { GOOGLE_CLIENT_ID } from '../constants';
import type { CredentialResponse } from '../globals';
import { useObjectUrl } from '../hooks/useObjectUrl';

interface LoginPageProps {
  onLogin: (response: CredentialResponse) => void;
  loginError?: string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, loginError }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { url: logoUrl } = useObjectUrl('/logo.png');
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // This will run on the client side and get the correct origin
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!window.google || !googleButtonRef.current) {
      return;
    }

    if (GOOGLE_CLIENT_ID.startsWith('YOUR_GOOGLE_CLIENT_ID')) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: onLogin,
    });
    
    window.google.accounts.id.renderButton(
      googleButtonRef.current,
      { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with', width: '300' }
    );
  }, [onLogin]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-200 overflow-hidden p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="0.5"/>
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#smallGrid)"/>
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(71, 85, 105, 0.7)" strokeWidth="1"/>
                </pattern>
                <radialGradient id="grad-bg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(34, 211, 238, 0.3)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <rect width="200%" height="200%" x="-50%" y="-50%" fill="url(#grad-bg)" className="animate-neural" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 space-y-8 bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl text-center border border-slate-700">
        <div>
           {logoUrl && <img 
            src={logoUrl} 
            alt="FirstVox Logo" 
            className="w-24 h-24 mx-auto mb-4 rounded-lg shadow-lg"
          />}
          <h1 className="text-4xl font-bold text-white">FirstVox // Comms Hub</h1>
          <p className="mt-2 text-slate-400">Authenticate to access the command center.</p>
        </div>
        <div className="mt-8 flex flex-col items-center">
            {loginError && (
                <div className="mb-4 text-center p-3 bg-red-900/50 border border-red-400/30 rounded-md">
                    <p className="text-sm font-medium text-red-300">
                        {loginError}
                    </p>
                </div>
            )}
            {GOOGLE_CLIENT_ID.startsWith('YOUR_GOOGLE_CLIENT_ID') ? (
                <div className="text-center p-4 bg-yellow-900/50 border border-yellow-400/30 rounded-md">
                    <p className="text-sm font-medium text-yellow-300">
                        <strong>Configuration needed:</strong> Please replace the placeholder Google Client ID in the <code>constants.ts</code> file to enable sign-in.
                    </p>
                </div>
            ) : (
                <div ref={googleButtonRef}></div>
            )}
             <p className="mt-4 text-xs text-slate-500 max-w-xs">
                Note: Access to the Comms Hub is restricted. Please sign in with your invited Google account.
            </p>
        </div>
        
        <p className="text-xs text-slate-500 pt-4">
          By signing in, you agree to our terms of service.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;