import React from 'react';
import { Shield, Lock, EyeOff, Server } from 'lucide-react';

const securityFeatures = [
  {
    id: 'encryption',
    icon: <Lock className="w-6 h-6 text-black" strokeWidth={3} />,
    title: 'Bank-Grade Encryption',
    description: 'Your data is secured with AES-256 encryption at rest and TLS 1.3 in transit. We treat your digital identity with financial-level security.',
    accentBg: 'bg-orange-500',
    borderColor: 'border-orange-500',
    shadowColor: 'shadow-[4px_4px_0px_#F97316]',
  },
  {
    id: 'ghost-mode',
    icon: <EyeOff className="w-6 h-6 text-black" strokeWidth={3} />,
    title: 'Ghost Mode Privacy',
    description: 'You are always in control. Granular privacy toggles let you instantly hide your DMs, WhatsApp, and social profiles from public view.',
    accentBg: 'bg-lime-500',
    borderColor: 'border-lime-500',
    shadowColor: 'shadow-[4px_4px_0px_#84CC16]',
  },
  {
    id: 'zero-selling',
    icon: <Shield className="w-6 h-6 text-black" strokeWidth={3} />,
    title: 'Zero Data Selling',
    description: 'You are our customer, not our product. We have a strict zero-tolerance policy against selling or sharing your personal data to third parties.',
    accentBg: 'bg-cyan-400',
    borderColor: 'border-cyan-400',
    shadowColor: 'shadow-[4px_4px_0px_#22D3EE]',
  },
  {
    id: 'infrastructure',
    icon: <Server className="w-6 h-6 text-black" strokeWidth={3} />,
    title: 'Enterprise Infrastructure',
    description: 'Built on strictly typed Row-Level Security (RLS) databases and PCI-DSS compliant payment gateways to prevent unauthorized access.',
    accentBg: 'bg-pink-500',
    borderColor: 'border-pink-500',
    shadowColor: 'shadow-[4px_4px_0px_#EC4899]',
  }
];

export default function SecurityPrivacy() {
  return (
    <section className="py-24 bg-[#0a0a0a] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-orange-500 border-[3px] border-black text-black text-sm font-black uppercase tracking-widest mb-6 shadow-[3px_3px_0px_#000]">
            <Shield size={14} strokeWidth={3} />
            <span>Trust & Security</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
            Your Identity, <span className="text-orange-500">On Lock.</span>
          </h2>
          <p className="text-lg text-neutral-400 font-bold">
            Because a physical link to your digital life demands uncompromising security. Here is how we protect you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {securityFeatures.map((feature) => (
            <div 
              key={feature.id}
              className={`group bg-[#1a1a1a] border-[3px] ${feature.borderColor} rounded-xl p-8 ${feature.shadowColor} hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-150`}
            >
              <div className="flex flex-col gap-4">
                <div className={`w-14 h-14 rounded-xl ${feature.accentBg} border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_#000]`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-wide">{feature.title}</h3>
                <p className="text-neutral-300 leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
