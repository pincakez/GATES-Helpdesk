import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { MessageSquare, Save, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FacebookSettings() {
  const [isConnected, setIsConnected] = useState(false);
  
  return (
    <PageWrapper title="Facebook API Management" description="Connect and configure your Facebook Messenger API.">
      <div className="max-w-3xl space-y-6">
        
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-500" />
                Facebook / Messenger Connection
              </h3>
              <p className="text-sm text-neutral-400">Configure your Meta Developer credentials to send and receive Messenger messages.</p>
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
              <label className="block text-sm font-medium text-neutral-300 mb-1">Facebook Page ID</label>
              <input type="text" placeholder="e.g. 10234567890" className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Page Access Token</label>
              <input type="password" placeholder="EAABw..." className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={() => setIsConnected(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Connect Facebook
            </button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
