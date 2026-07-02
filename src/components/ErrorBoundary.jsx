import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] px-4">
          <div className="max-w-md w-full bg-[#1a1a1a] rounded-3xl border-[3px] border-black shadow-[6px_6px_0px_#F97316] p-8 text-center relative">
            <div className="w-20 h-20 bg-orange-500/10 border-[3px] border-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0px_#000]">
              <AlertTriangle className="w-10 h-10 text-orange-500" />
            </div>
            
            <h2 className="text-2xl font-black text-white mb-3 uppercase">Something went wrong</h2>
            <p className="text-neutral-400 mb-8 font-medium">
              We encountered a glitch while loading this section. Tap reload to try again.
            </p>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 text-black font-black py-4 px-6 rounded-2xl border-[3px] border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <RefreshCcw className="w-5 h-5" strokeWidth={3} />
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
