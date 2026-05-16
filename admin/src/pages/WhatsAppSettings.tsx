import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MessageCircle, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function WhatsAppSettings() {
  const [isConnected, setIsConnected] = useState(false);
  
  return (
    <PageWrapper title="WhatsApp API Management" description="Connect and configure your WhatsApp Business API.">
      <div className="max-w-3xl space-y-6">
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-500" />
                WhatsApp Connection
              </h3>
              <p className="text-sm text-neutral-400">Configure your Meta Developer credentials to send and receive WhatsApp messages.</p>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" /> Connected
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" /> Not Connected
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Phone Number ID</label>
              <input type="text" placeholder="e.g. 10234567890" className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">WhatsApp Business Account ID</label>
              <input type="text" placeholder="e.g. 10987654321" className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">System User Access Token</label>
              <input type="password" placeholder="EAABw..." className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setIsConnected(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Connect WhatsApp
            </button>
          </div>
        </div>

        {/* API Capabilities info */}
        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-6">
          <h4 className="font-semibold text-white mb-4">Available Capabilities</h4>
          <ul className="space-y-3 text-sm text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <div>
                <strong className="text-white block">Bulk Marketing Messages</strong>
                <span className="text-neutral-500 text-xs">Send template messages to broadcast lists without getting banned (requires template approval).</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
               <span className="text-green-500 mt-0.5">•</span>
              <div>
                <strong className="text-white block">OTP & Transactional Alerts</strong>
                <span className="text-neutral-500 text-xs">Send automated One-Time Passwords or order updates instantly.</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
               <span className="text-green-500 mt-0.5">•</span>
              <div>
                <strong className="text-white block">Direct Real-Time Chat</strong>
                <span className="text-neutral-500 text-xs">A unified inbox where agents (or AI) can chat back-and-forth natively.</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
               <span className="text-green-500 mt-0.5">•</span>
              <div>
                <strong className="text-white block">Personal Alerts</strong>
                <span className="text-neutral-500 text-xs">Send system notifications directly to your developer or admin WhatsApp numbers.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </PageWrapper>
  );
}
