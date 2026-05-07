import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Shield, FileText, RefreshCw, Scale } from 'lucide-react'

export default function Legal() {
  const [activeTab, setActiveTab] = useState('privacy')

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && sections[hash]) {
      setActiveTab(hash)
    }
    window.scrollTo(0, 0)
  }, [])

  const sections = {
    privacy: {
      title: 'Privacy Policy',
      icon: <Shield size={20}/>,
      content: `
        <h3>1. Information We Collect</h3>
        <p>We collect information you provide directly to us when you create an account, purchase a KnoWMi, or update your public profile. This includes your name, email, social media handles, and any other data you choose to share.</p>
        
        <h3>2. How We Use Data</h3>
        <p>Your data is used to generate your public profile, track analytics (scans), and facilitate the "Social Handshake." We do not sell your personal information to third parties.</p>
        
        <h3>3. Scan Tracking</h3>
        <p>When someone scans your KnoWMi, we collect non-identifiable data such as device type, browser, and general location (city level) to provide you with insights. This data is only accessible to you.</p>
      `
    },
    terms: {
      title: 'Terms of Service',
      icon: <Scale size={20}/>,
      content: `
        <h3>1. Acceptable Use</h3>
        <p>By using KnoWMi, you agree not to use the platform for any illegal activities, harassment, or the distribution of malicious content through your public profile.</p>
        
        <h3>2. Phygital Hardware</h3>
        <p>Each KnoWMi is unique to its owner. Attempting to replicate or reverse-engineer the "Social Handshake" technology is strictly prohibited.</p>
        
        <h3>3. Account Security</h3>
        <p>You are responsible for maintaining the security of your account and your unique WM-CODE. Any activity under your account is your responsibility.</p>
      `
    },
    refund: {
      title: 'Returns & Exchanges',
      icon: <RefreshCw size={20}/>,
      content: `
        <h3>1. Our Core Policy</h3>
        <p>At KnoWMi, we strive for perfection. As each Phygital Tee is a custom-printed technology product, we only accept returns for items that arrive with manufacturing defects, print issues, or significant wear and tear from transit.</p>
        
        <h3>2. Mandatory Unboxing Video</h3>
        <p>To prevent fraudulent claims and keep our costs low for our community, <strong>a valid unboxing video is mandatory</strong> for any return or exchange request. The video must be continuous (no cuts/edits) and clearly show the original packaging being opened and the defect in detail. <em>No video = No Return/Exchange.</em></p>
        
        <h3>3. Exclusions (No Returns)</h3>
        <p>We do not accept returns or refunds for the following reasons:</p>
        <ul>
          <li>Change of mind ("I don't like it anymore").</li>
          <li>No specific reason provided.</li>
          <li>Product used or washed.</li>
        </ul>
        
        <h3>4. Size & Fit (Exchange Only)</h3>
        <p>Selected the wrong size? We understand. While we don't offer refunds for size issues, we do offer a <strong>one-time size exchange</strong>. The customer is responsible for the reverse shipping fee for size-related exchanges. Please consult our Size Guide before ordering.</p>
        
        <h3>5. How to Initiate</h3>
        <p>Contact us on WhatsApp within 48 hours of delivery with your Order ID and the Unboxing Video. Once verified, we will process your replacement or exchange within 3-5 business days.</p>
      `
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="flex flex-col md:flex-row gap-12">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 space-y-2">
              <div className="mb-8 px-4">
                <h1 className="text-2xl font-display font-black text-black">Legal Center</h1>
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-2">KnoWMi Compliance</p>
              </div>
              {Object.entries(sections).map(([id, sec]) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-neutral-500 hover:bg-neutral-50'}`}
                >
                  {sec.icon} {sec.title}
                </button>
              ))}
            </aside>

            {/* Content Modeling */}
            <div className="flex-1">
              <div className="p-10 bg-white border border-neutral-100 rounded-3xl min-h-[600px] shadow-xl shadow-neutral-100/50 animate-reveal">
                <h2 className="text-4xl font-display font-black mb-10 text-orange-500">{sections[activeTab].title}</h2>
                <div 
                  className="prose max-w-none 
                    prose-h3:text-lg prose-h3:font-black prose-h3:mt-8 prose-h3:mb-4 prose-h3:text-black
                    prose-p:text-neutral-600 prose-p:leading-relaxed prose-p:mb-6"
                  dangerouslySetInnerHTML={{ __html: sections[activeTab].content }}
                />
                
                <div className="mt-20 pt-10 border-t border-neutral-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Last Updated: April 2025</p>
                    <p className="text-xs text-neutral-500">For legal inquiries: <a href="mailto:support.knowmi@gmail.com" className="text-orange-500 font-bold hover:underline">support.knowmi@gmail.com</a></p>
                  </div>
                  <button className="text-xs font-bold text-orange-500/50 hover:text-orange-500 transition-all">Download PDF ↗</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
