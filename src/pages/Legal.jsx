import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Shield, FileText, RefreshCw, Truck } from 'lucide-react'

const SECTIONS = {
  privacy: {
    title: 'Privacy Policy',
    icon: <Shield size={18} />,
    updated: '21 May 2025',
    content: (
      <>
        <p className="text-neutral-500 text-sm leading-relaxed mb-8">
          This Privacy Policy describes how KnoWMi ("we", "us", or "our") collects, uses, and protects information about you when you use our website, products, and services. We take your privacy seriously — this document is written in plain language so you actually understand what we do with your data.
        </p>

        <Section title="1. Who We Are">
          <p>KnoWMi is a phygital identity platform based in India. We sell QR-enabled identity t-shirts that link to your personal digital profile. Our registered contact email is <a href="mailto:support.knowmi@gmail.com" className="text-orange-500 hover:underline font-medium">support.knowmi@gmail.com</a>.</p>
        </Section>

        <Section title="2. What Information We Collect">
          <p>We collect two kinds of information:</p>
          <SubSection title="Information you give us directly">
            <ul>
              <li>Your name and email address when you sign up</li>
              <li>Profile details you choose to add — job title, bio, social handles, links, profile photo</li>
              <li>Shipping address and contact number when you place an order</li>
              <li>Payment details — we do not store card numbers. Payments are processed securely by Razorpay. We only receive a confirmation token.</li>
            </ul>
          </SubSection>
          <SubSection title="Information collected automatically when your QR is scanned">
            <ul>
              <li>Device type (mobile, desktop, tablet)</li>
              <li>Browser name and version</li>
              <li>Approximate location at city level (based on IP address) — we do not track GPS or precise coordinates</li>
              <li>Time and date of the scan</li>
              <li>Referrer source (how the person found your profile)</li>
            </ul>
            <p className="mt-3 text-sm text-neutral-400">This data is tied to your profile, not to the person who scanned it. The scanner remains anonymous.</p>
          </SubSection>
        </Section>

        <Section title="3. How We Use Your Information">
          <ul>
            <li><strong>To operate your profile</strong> — your name, bio, links, and photo are shown publicly on your profile page when someone scans your QR code</li>
            <li><strong>To fulfil your order</strong> — your shipping address and contact number are used to deliver your tee</li>
            <li><strong>To show you analytics</strong> — scan counts, city data, and device breakdowns are shown only to you inside your dashboard</li>
            <li><strong>To improve our service</strong> — aggregated, non-identifiable data helps us understand how the platform is used overall</li>
            <li><strong>To communicate with you</strong> — order confirmations, support replies, and occasional product updates via email</li>
          </ul>
          <p className="mt-4 font-medium text-neutral-700">We do not sell, rent, or share your personal information with any third party for marketing purposes. Ever.</p>
        </Section>

        <Section title="4. Who We Share Data With">
          <p>We share limited data only with vendors who help us operate:</p>
          <ul>
            <li><strong>Razorpay</strong> — payment processing. They handle your card/UPI data under their own privacy policy and PCI-DSS compliance.</li>
            <li><strong>Supabase</strong> — our database and authentication provider. Data is stored in secure, encrypted cloud infrastructure.</li>
            <li><strong>Courier partners</strong> — your name, phone number, and address are shared with our logistics partners solely for delivery.</li>
          </ul>
          <p className="mt-3">We do not use Google Ads, Facebook Pixel, or any third-party advertising trackers on this platform.</p>
        </Section>

        <Section title="5. Your Public Profile">
          <p>Your KnoWMi profile is <strong>public by design</strong> — that is the purpose of the product. Anyone with a link or who scans your QR code can view the information you have added to your profile.</p>
          <p className="mt-3">You are in full control of what you publish. You can update or remove any profile content at any time from your dashboard. If you want to temporarily deactivate your profile link, contact us and we will pause it within 24 hours.</p>
        </Section>

        <Section title="6. Data Retention">
          <ul>
            <li>Your profile and account data is retained as long as your account is active</li>
            <li>Scan analytics data is retained for 12 months on a rolling basis</li>
            <li>Order records are retained for 7 years for GST/tax compliance requirements</li>
          </ul>
          <p className="mt-3">You can request deletion of your account and personal data at any time by emailing us. We will process it within 15 business days, subject to any legal retention obligations.</p>
        </Section>

        <Section title="7. Cookies">
          <p>We use one essential cookie to keep you logged in (a session token). We do not use advertising cookies, tracking pixels, or third-party analytics cookies like Google Analytics.</p>
        </Section>

        <Section title="8. Your Rights (Under Indian Law & DPDP Act 2023)">
          <ul>
            <li>Right to access what data we hold about you</li>
            <li>Right to correct inaccurate data</li>
            <li>Right to erase your data (with limited exceptions for legal compliance)</li>
            <li>Right to withdraw consent at any time</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, email <a href="mailto:support.knowmi@gmail.com" className="text-orange-500 hover:underline font-medium">support.knowmi@gmail.com</a> with your registered email address and the specific request.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>KnoWMi is not intended for users under 13 years of age. We do not knowingly collect data from children. If you believe a child has created an account, please contact us and we will remove it immediately.</p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>If we make significant changes to how we handle your data, we will notify registered users by email at least 7 days before the change takes effect. Minor clarifications may be updated without prior notice, but the "Last Updated" date will always reflect the latest version.</p>
        </Section>
      </>
    )
  },

  terms: {
    title: 'Terms of Service',
    icon: <FileText size={18} />,
    updated: '21 May 2025',
    content: (
      <>
        <p className="text-neutral-500 text-sm leading-relaxed mb-8">
          These Terms of Service govern your use of KnoWMi's website, products, and services. By purchasing a KnoWMi tee or creating an account, you agree to these terms. Please read them — they are written in plain language.
        </p>

        <Section title="1. The Product">
          <p>KnoWMi is a wearable identity product — a t-shirt with a printed QR code linked to your personal digital profile. Each tee is personalised and tied to one account. The digital profile is hosted by us and accessed via the QR code.</p>
        </Section>

        <Section title="2. Your Account">
          <ul>
            <li>You must be at least 13 years old to create an account</li>
            <li>You are responsible for keeping your login credentials secure</li>
            <li>You may not share, sell, or transfer your account to another person</li>
            <li>Each KnoWMi product is linked to one account. The WM code on your tee is unique to you.</li>
          </ul>
        </Section>

        <Section title="3. Your Profile Content">
          <p>You are fully responsible for what you publish on your profile. You agree not to post:</p>
          <ul>
            <li>Content that is false, misleading, or impersonates another person</li>
            <li>Hate speech, threats, or content that harasses any individual or group</li>
            <li>Sexually explicit material</li>
            <li>Content that promotes illegal activities</li>
            <li>Spam links, phishing URLs, or malware</li>
          </ul>
          <p className="mt-3">We reserve the right to remove content that violates these terms and to suspend accounts that repeatedly breach them. We are not responsible for the content users publish on their profiles — that is their responsibility.</p>
        </Section>

        <Section title="4. Orders and Payments">
          <ul>
            <li>All prices are listed in Indian Rupees (₹) and are inclusive of applicable taxes</li>
            <li>Payment is collected at checkout via Razorpay. Your order is confirmed only after successful payment.</li>
            <li>We reserve the right to cancel any order in cases of suspected fraud, incorrect pricing, or stock unavailability. You will be fully refunded in such cases.</li>
            <li>GST invoice is generated for every order and emailed to you</li>
          </ul>
        </Section>

        <Section title="5. Custom and Team Orders">
          <p>Team Plan orders (4+ members) are processed with the member details provided at checkout. Once production begins, member details (names, sizes, colours) cannot be modified. Ensure all information is correct before completing payment.</p>
        </Section>

        <Section title="6. Intellectual Property">
          <ul>
            <li>The KnoWMi name, logo, and product designs are our intellectual property</li>
            <li>You may not reproduce, copy, or use our designs without written permission</li>
            <li>The QR code on your tee encodes a URL that belongs to our platform. Attempting to redirect, hijack, or interfere with this URL is strictly prohibited.</li>
          </ul>
        </Section>

        <Section title="7. Prohibited Uses">
          <p>You may not:</p>
          <ul>
            <li>Attempt to reverse-engineer, scrape, or extract data from our platform</li>
            <li>Use automated bots to scan QR codes or access profiles at scale</li>
            <li>Attempt to gain unauthorised access to another user's account or dashboard</li>
            <li>Interfere with the platform's infrastructure or security</li>
          </ul>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>KnoWMi is a small Indian startup. To the maximum extent permitted by law, our liability for any claim arising out of your use of our products or platform is limited to the amount you paid for the specific product or service in question.</p>
          <p className="mt-3">We are not liable for indirect, consequential, or punitive damages — for example, loss of business or reputation arising from your use of the platform.</p>
        </Section>

        <Section title="9. Governing Law">
          <p>These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Tamil Nadu, India. We will always try to resolve disputes informally before any legal proceedings — reach out to us first.</p>
        </Section>

        <Section title="10. Changes to These Terms">
          <p>We may update these terms from time to time. If the changes are significant, we will notify you by email with at least 7 days' notice. Continued use of the platform after changes take effect constitutes acceptance of the new terms.</p>
        </Section>

        <Section title="11. Contact">
          <p>Questions about these terms? Email us at <a href="mailto:support.knowmi@gmail.com" className="text-orange-500 hover:underline font-medium">support.knowmi@gmail.com</a> and we will get back to you within 2 business days.</p>
        </Section>
      </>
    )
  },

  refund: {
    title: 'Returns & Exchanges',
    icon: <RefreshCw size={18} />,
    updated: '21 May 2025',
    content: (
      <>
        <p className="text-neutral-500 text-sm leading-relaxed mb-8">
          Every KnoWMi tee is made to order. We print and fulfil each piece only after your order is confirmed — which means we can't resell a returned item. This shapes our returns policy. We've written it clearly below so there are no surprises.
        </p>

        <Section title="1. What We Accept Returns For">
          <p>We accept return or replacement requests only if your order arrives with one or more of the following issues:</p>
          <ul>
            <li>Manufacturing defect — torn seams, holes, or fabric damage before first wash</li>
            <li>Print defect — significant smudging, misalignment, or fading of the design on arrival</li>
            <li>Wrong item delivered — you received a different design, colour, or size than what you ordered</li>
            <li>QR code not scanning correctly out of the box</li>
          </ul>
          <p className="mt-3">All other reasons — including disliking the design, change of mind, or colour appearing slightly different from screen to real life — are not eligible for a return.</p>
        </Section>

        <Section title="2. Mandatory Unboxing Video">
          <p>To raise any return, exchange, or defect claim, you <strong>must submit a continuous, uncut unboxing video</strong> that clearly shows:</p>
          <ul>
            <li>The sealed package being opened for the first time</li>
            <li>The tee being taken out and the defect or wrong item being clearly visible</li>
            <li>The delivery label on the package (for order verification)</li>
          </ul>
          <p className="mt-3"><strong>No unboxing video = No return or exchange.</strong> This protects both you and us from fraudulent claims, and keeps our prices fair for everyone in the community.</p>
        </Section>

        <Section title="3. Size Exchange Policy">
          <p>Got the size wrong? We get it — sizing can be tricky.</p>
          <ul>
            <li>We offer a <strong>one-time size exchange</strong> per order, within 7 days of delivery</li>
            <li>The tee must be unwashed and unworn, with original tags intact</li>
            <li>You bear the cost of shipping the tee back to us</li>
            <li>We ship the replacement to you at no additional charge once we receive and verify the original</li>
          </ul>
          <p className="mt-3">Please check our Size Guide on the product page before ordering to avoid this situation.</p>
        </Section>

        <Section title="4. What Is Not Covered">
          <ul>
            <li>Normal wear and tear after use or washing</li>
            <li>Colour fading after multiple washes (follow care instructions inside the tee)</li>
            <li>Damage caused by improper washing (machine wash hot, bleach, tumble dry)</li>
            <li>Requests raised more than 7 days after delivery</li>
            <li>Requests without a valid unboxing video</li>
            <li>Items that have been used, washed, or had tags removed</li>
          </ul>
        </Section>

        <Section title="5. Refunds">
          <p>Refunds to your original payment method are issued only in the following cases:</p>
          <ul>
            <li>We are unable to replace a defective item due to stock unavailability</li>
            <li>The order was cancelled by us (fraud detection, stock error, etc.)</li>
          </ul>
          <p className="mt-3">Refunds are processed within 5–7 business days of approval. The amount will reflect in your account within 7–10 business days depending on your bank.</p>
        </Section>

        <Section title="6. How to Raise a Request">
          <p>Message us on WhatsApp at <a href="https://wa.me/917981325397" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline font-medium">+91 79813 25397</a> or email <a href="mailto:support.knowmi@gmail.com" className="text-orange-500 hover:underline font-medium">support.knowmi@gmail.com</a> within 7 days of delivery. Include:</p>
          <ul>
            <li>Your order ID</li>
            <li>Your registered email address</li>
            <li>The unboxing video (share via Google Drive or WhatsApp)</li>
            <li>Description of the issue</li>
          </ul>
          <p className="mt-3">We will respond within 2 business days and, if the claim is valid, begin processing your replacement or refund immediately.</p>
        </Section>
      </>
    )
  },

  shipping: {
    title: 'Shipping Policy',
    icon: <Truck size={18} />,
    updated: '21 May 2025',
    content: (
      <>
        <p className="text-neutral-500 text-sm leading-relaxed mb-8">
          We ship across India. Every tee is made to order — so we ask for a small amount of time to get it right before it leaves our facility.
        </p>

        <Section title="1. Production Time">
          <p>Because each KnoWMi is personalised and printed specifically for you, there is a production window before we dispatch:</p>
          <ul>
            <li><strong>Standard orders:</strong> 3–5 business days for production</li>
            <li><strong>Team Plan orders (4+ members):</strong> 5–8 business days for production</li>
          </ul>
          <p className="mt-3">Business days are Monday to Saturday, excluding national holidays.</p>
        </Section>

        <Section title="2. Delivery Time">
          <p>After dispatch, estimated delivery timelines are:</p>
          <ul>
            <li><strong>Metro cities</strong> (Chennai, Bengaluru, Mumbai, Delhi, Hyderabad, Kolkata): 2–4 business days</li>
            <li><strong>Tier-2 and Tier-3 cities:</strong> 4–7 business days</li>
            <li><strong>Remote or rural areas:</strong> 7–10 business days</li>
          </ul>
          <p className="mt-3">These are estimates, not guarantees. Delays can occur due to courier issues, public holidays, or extreme weather.</p>
        </Section>

        <Section title="3. Shipping Charges">
          <ul>
            <li><strong>Free shipping</strong> on all orders — no minimum order value</li>
            <li>For size exchange returns initiated by the customer, reverse shipping is at the customer's cost</li>
          </ul>
        </Section>

        <Section title="4. Tracking Your Order">
          <p>Once your order is dispatched, you will receive an SMS and/or email with the courier name and tracking number. You can also track your order at <a href="/track" className="text-orange-500 hover:underline font-medium">knowmi.in/track</a>.</p>
          <p className="mt-3">If the tracking link doesn't update for more than 5 business days after dispatch, please contact us — it might be a courier issue we need to follow up on.</p>
        </Section>

        <Section title="5. Failed Deliveries">
          <p>If a delivery attempt fails because you were unavailable, the courier will attempt delivery again. After 2 failed attempts, the parcel is typically returned to us.</p>
          <ul>
            <li>If the return is due to an incorrect address provided by you, re-shipping charges apply</li>
            <li>If the return is due to courier error, we will reship at no extra cost</li>
          </ul>
          <p className="mt-3">Please ensure your delivery address and phone number are correct at checkout. We cannot make address changes after an order has been dispatched.</p>
        </Section>

        <Section title="6. International Shipping">
          <p>We currently ship within India only. International shipping is not available at this time. If you are an NRI interested in a KnoWMi, email us — we may be able to arrange something for bulk orders.</p>
        </Section>
      </>
    )
  }
}

// ── Sub-components ─────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h3 className="text-base font-black text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
        {title}
      </h3>
      <div className="space-y-3 text-[15px] text-neutral-600 leading-relaxed [&_ul]:mt-3 [&_ul]:ml-5 [&_ul]:space-y-2 [&_ul]:list-disc [&_li]:leading-relaxed">
        {children}
      </div>
    </div>
  )
}

function SubSection({ title, children }) {
  return (
    <div className="mt-5">
      <p className="text-sm font-bold text-neutral-700 mb-2">{title}</p>
      <div className="space-y-2 text-[15px] text-neutral-600 [&_ul]:ml-5 [&_ul]:space-y-2 [&_ul]:list-disc [&_li]:leading-relaxed">
        {children}
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────

export default function Legal() {
  const [activeTab, setActiveTab] = useState('privacy')

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash && SECTIONS[hash]) {
      setActiveTab(hash)
    }
    window.scrollTo(0, 0)
  }, [])

  const active = SECTIONS[activeTab]

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-black">
      <Navbar />

      <main className="pt-28 pb-24 px-5 sm:px-6">
        <div className="max-w-[1060px] mx-auto">

          {/* Page header */}
          <div className="mb-12 text-center">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-50 border border-orange-100 px-4 py-1.5 rounded-full mb-4">
              Legal & Policies
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-black text-neutral-900 tracking-tight mb-4">
              KnoWMi Legal Center
            </h1>
            <p className="text-neutral-400 text-sm font-medium max-w-lg mx-auto leading-relaxed">
              Written in plain language. No legalese. If anything is unclear, email us and we'll explain it.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">

            {/* Sidebar */}
            <aside className="w-full md:w-56 flex-shrink-0">
              <nav className="md:sticky md:top-28 bg-white rounded-2xl border border-neutral-100 p-3 shadow-sm">
                {Object.entries(SECTIONS).map(([id, sec]) => (
                  <button
                    key={id}
                    onClick={() => { setActiveTab(id); window.history.replaceState(null, '', `#${id}`); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all mb-1 last:mb-0 text-left ${
                      activeTab === id
                        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                        : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700'
                    }`}
                  >
                    <span className="flex-shrink-0">{sec.icon}</span>
                    <span className="leading-tight">{sec.title}</span>
                  </button>
                ))}

                <div className="mt-4 pt-4 border-t border-neutral-100 px-4">
                  <p className="text-[10px] font-black text-neutral-300 uppercase tracking-widest mb-1">Need help?</p>
                  <a
                    href="mailto:support.knowmi@gmail.com"
                    className="text-[11px] font-bold text-orange-500 hover:underline break-all"
                  >
                    support.knowmi@gmail.com
                  </a>
                </div>
              </nav>
            </aside>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-white border border-neutral-100 rounded-3xl p-8 md:p-12 shadow-sm">

                {/* Section header */}
                <div className="flex items-start gap-4 mb-10 pb-8 border-b border-neutral-100">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
                    {active.icon}
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-black text-neutral-900 tracking-tight">
                      {active.title}
                    </h2>
                    <p className="text-[11px] font-black text-neutral-300 uppercase tracking-widest mt-1.5">
                      Last updated: {active.updated}
                    </p>
                  </div>
                </div>

                {/* Policy content */}
                <div>
                  {active.content}
                </div>

                {/* Footer bar */}
                <div className="mt-14 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-neutral-300 mb-1">
                      Questions about this policy?
                    </p>
                    <a
                      href="mailto:support.knowmi@gmail.com"
                      className="text-sm font-bold text-orange-500 hover:underline"
                    >
                      support.knowmi@gmail.com
                    </a>
                  </div>
                  <div className="flex gap-3">
                    {Object.entries(SECTIONS).filter(([id]) => id !== activeTab).map(([id, sec]) => (
                      <button
                        key={id}
                        onClick={() => { setActiveTab(id); window.history.replaceState(null, '', `#${id}`); window.scrollTo(0,0); }}
                        className="text-[11px] font-bold text-neutral-300 hover:text-neutral-700 transition-colors"
                      >
                        {sec.title} →
                      </button>
                    ))}
                  </div>
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
