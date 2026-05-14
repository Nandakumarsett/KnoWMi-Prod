import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Search, Package, Truck, CheckCircle2, Clock } from 'lucide-react'

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [tracking, setTracking] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleTrack = (e) => {
    e.preventDefault()
    if (orderId.trim()) {
      setTracking(true)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />
      
      <main className="pt-40 pb-24 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500/10 mb-6">
            <Package className="w-8 h-8 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black mb-4 tracking-tight">Track Your Order</h1>
          <p className="text-neutral-500 text-lg mb-12 max-w-[500px] mx-auto">
            Enter your order number or tracking ID to see the current status of your KnoWMi shipment.
          </p>

          {/* Tracking Form */}
          <form onSubmit={handleTrack} className="relative max-w-md mx-auto mb-20">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Order Number (e.g. ORD-88242)"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-4 pl-12 pr-32 font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-black text-white rounded-xl font-bold text-sm hover:bg-neutral-800 transition-all"
              >
                Track Now
              </button>
            </div>
          </form>

          {tracking ? (
            <div className="animate-reveal">
              {/* Order Info */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-8 mb-8 text-left">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Current Status</p>
                    <h3 className="text-2xl font-display font-black text-orange-500">Order Processing</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Estimated Delivery</p>
                    <h3 className="text-lg font-bold">28 April, 2025</h3>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative space-y-12 py-8">
                <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-neutral-100" />
                
                <div className="flex items-start gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white z-10 shadow-lg shadow-orange-500/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="text-left pt-1">
                    <h4 className="font-bold text-lg text-black">Order Confirmed</h4>
                    <p className="text-neutral-500 text-sm">We have received your order and it's being prepared.</p>
                    <p className="text-[10px] font-bold text-neutral-300 mt-1 uppercase tracking-wider">Today • 10:30 AM</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center text-orange-500 z-10">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-left pt-1">
                    <h4 className="font-bold text-lg text-black">Processing</h4>
                    <p className="text-neutral-500 text-sm">Your KnoWMi is being printed and packed with care.</p>
                    <p className="text-[10px] font-bold text-orange-500 mt-1 uppercase tracking-wider italic">In Progress</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-neutral-50 border-2 border-neutral-100 flex items-center justify-center text-neutral-300 z-10">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="text-left pt-1 opacity-40">
                    <h4 className="font-bold text-lg text-neutral-400">In Transit</h4>
                    <p className="text-neutral-500 text-sm">Package has been handed over to our delivery partner.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 relative">
                  <div className="w-12 h-12 rounded-full bg-neutral-50 border-2 border-neutral-100 flex items-center justify-center text-neutral-300 z-10">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="text-left pt-1 opacity-40">
                    <h4 className="font-bold text-lg text-neutral-400">Delivered</h4>
                    <p className="text-neutral-500 text-sm">Package successfully delivered to your doorstep.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-20">
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 transition-all hover:border-orange-500/20">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                    <Package className="w-5 h-5 text-orange-500" />
                  </div>
                  <h4 className="font-bold mb-2">Real-time Updates</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">Track every step from printing to your doorstep.</p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 transition-all hover:border-orange-500/20">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                    <Truck className="w-5 h-5 text-orange-500" />
                  </div>
                  <h4 className="font-bold mb-2">Express Delivery</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">Fast and secure shipping across India.</p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 transition-all hover:border-orange-500/20">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  </div>
                  <h4 className="font-bold mb-2">Safe Arrival</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">Quality guaranteed on every delivery.</p>
                </div>
              </div>
              <div className="mt-20 pt-10 border-t border-neutral-100">
                <p className="text-sm text-neutral-500">Need help with your order? Reach out at <a href="mailto:support.knowmi@gmail.com" className="text-black font-bold hover:text-orange-500 transition-colors">support.knowmi@gmail.com</a></p>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
