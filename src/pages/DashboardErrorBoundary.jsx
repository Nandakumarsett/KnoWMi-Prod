import React from 'react';
import { AlertTriangle, RefreshCcw, ChevronDown } from 'lucide-react';

export class DashboardErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("Dashboard Error:", error, info);
    this.setState({ info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-neutral-50 px-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100 p-8 text-center relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-red-500"></div>
            
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-orange-500" />
            </div>
            
            <h2 className="text-2xl font-black text-neutral-900 mb-3">Oops! Something went wrong</h2>
            <p className="text-neutral-500 mb-8 leading-relaxed">
              We encountered an unexpected glitch while loading this page. Don't worry, your data is safe.
            </p>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-neutral-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-neutral-900/20 mb-6"
            >
              <RefreshCcw className="w-5 h-5" />
              Reload Dashboard
            </button>
            
            <details className="text-left bg-neutral-50 rounded-2xl p-4 border border-neutral-100 group cursor-pointer">
              <summary className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center justify-between outline-none">
                <span>View Error Details</span>
                <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-xs text-red-500 font-bold mb-2 break-words">
                  {this.state.error?.toString()}
                </p>
                <div className="bg-neutral-900 text-green-400 p-3 rounded-xl overflow-x-auto">
                  <pre className="text-[10px] font-monospace leading-relaxed opacity-90">
                    {this.state.error?.stack}
                  </pre>
                  <pre className="text-[10px] font-monospace leading-relaxed opacity-70 mt-2 border-t border-neutral-800 pt-2">
                    {this.state.info?.componentStack}
                  </pre>
                </div>
              </div>
            </details>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
