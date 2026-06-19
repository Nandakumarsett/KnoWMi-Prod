import React from 'react';
import { Shield, Lock, EyeOff, Server } from 'lucide-react';

const securityFeatures = [
  {
    id: 'encryption',
    icon: <Lock className="w-6 h-6 text-orange-500" />,
    title: 'Bank-Grade Encryption',
    description: 'Your data is secured with AES-256 encryption at rest and TLS 1.3 in transit. We treat your digital identity with financial-level security.'
  },
  {
    id: 'ghost-mode',
    icon: <EyeOff className="w-6 h-6 text-orange-500" />,
    title: 'Ghost Mode Privacy',
    description: 'You are always in control. Granular privacy toggles let you instantly hide your DMs, WhatsApp, and social profiles from public view.'
  },
  {
    id: 'zero-selling',
    icon: <Shield className="w-6 h-6 text-orange-500" />,
    title: 'Zero Data Selling',
    description: 'You are our customer, not our product. We have a strict zero-tolerance policy against selling or sharing your personal data to third parties.'
  },
  {
    id: 'infrastructure',
    icon: <Server className="w-6 h-6 text-orange-500" />,
    title: 'Enterprise Infrastructure',
    description: 'Built on strictly typed Row-Level Security (RLS) databases and PCI-DSS compliant payment gateways to prevent unauthorized access.'
  }
];

export default function SecurityPrivacy() {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm font-medium mb-6">
            <Shield size={14} />
            <span>Trust & Security</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Your Identity, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">On Lock.</span>
          </h2>
          <p className="text-lg text-neutral-400">
            Because a physical link to your digital life demands uncompromising security. Here is how we protect you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {securityFeatures.map((feature) => (
            <div 
              key={feature.id}
              className="group relative bg-[#111] border border-white/10 rounded-3xl p-8 hover:border-orange-500/30 transition-colors duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">
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
