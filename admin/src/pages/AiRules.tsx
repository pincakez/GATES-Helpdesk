import React, { useState } from 'react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { BrainCircuit, Settings2, Code, Lightbulb, Play, Save, AlertTriangle, Key, Cpu, Eye, FileUp, Zap, Star } from 'lucide-react';

export default function AiRules() {
  const [apiKey, setApiKey] = useState('sk-proj-**********************************');
  const [reasoning, setReasoning] = useState('medium');
  const [visionDpi, setVisionDpi] = useState('auto');
  const [allowFiles, setAllowFiles] = useState(true);

  return (
    <PageWrapper 
      title="AI Rules Engine" 
      description="Configure system prompts, API endpoints, model capabilities, and view AI improvement suggestions."
      action={
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors">
          <Save className="w-4 h-4" />
          Deploy Rules
        </button>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Settings */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* API Provider & Models */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-primary" />
              API Provider & Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">OpenAI / Provider API Key</label>
                <div className="flex gap-2">
                  <input 
                    type="password" 
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 bg-[#0a0a0a] border border-neutral-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all font-mono"
                  />
                  <button className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                    Update
                  </button>
                </div>
                <p className="text-[10px] text-neutral-500 mt-2">Connecting to OpenAI v1 API backend.</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">Enabled API Models</label>
                <div className="flex flex-wrap gap-2">
                  {['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o1-mini'].map((model) => (
                    <label key={model} className="flex items-center gap-2 bg-[#0a0a0a] border border-neutral-700 px-3 py-1.5 rounded-md cursor-pointer hover:border-neutral-500 transition-colors">
                      <input type="checkbox" defaultChecked className="accent-primary" />
                      <span className="text-xs text-neutral-300 font-mono">{model}</span>
                    </label>
                  ))}
                  <button className="text-xs text-emerald-500 font-medium hover:text-emerald-400 pl-2 transition-colors">+ Add Custom</button>
                </div>
              </div>
            </div>
          </div>

          {/* Reasoning & Capabilities */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <Cpu className="w-5 h-5 text-primary" />
              Model Control & Capabilities
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="space-y-3">
                 <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                   <Lightbulb className="w-4 h-4 text-emerald-500" />
                   Thinking / Reasoning
                 </label>
                 <select 
                   value={reasoning} 
                   onChange={e => setReasoning(e.target.value)}
                   className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                 >
                   <option value="low">Low (Fast, inexpensive)</option>
                   <option value="medium">Medium (Balanced)</option>
                   <option value="high">High (Complex logic, slow)</option>
                 </select>
               </div>

               <div className="space-y-3">
                 <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                   <Eye className="w-4 h-4 text-emerald-500" />
                   Vision DPI
                 </label>
                 <select 
                   value={visionDpi} 
                   onChange={e => setVisionDpi(e.target.value)}
                   className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                 >
                   <option value="low">Low Res (85 tokens)</option>
                   <option value="auto">Auto Select</option>
                   <option value="high">High Res (Detailed)</option>
                 </select>
               </div>

               <div className="space-y-3">
                 <label className="flex items-center gap-2 text-sm font-medium text-neutral-300">
                   <FileUp className="w-4 h-4 text-emerald-500" />
                   File Sharing Limits
                 </label>
                 <select 
                   className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                 >
                   <option>Disabled</option>
                   <option>Images Only (PNG/JPG)</option>
                   <option>Docs & Images (up to 10MB)</option>
                   <option>All files (up to 50MB)</option>
                 </select>
               </div>
            </div>
          </div>

          {/* User Tier Assignment */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-primary" />
              Role-Based AI Assignment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Premium Client */}
               <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg flex flex-col gap-3">
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">Premium Client</span>
                   <span className="text-[10px] text-amber-500/70 border border-amber-500/20 px-2 rounded-full">High Priority</span>
                 </div>
                 <select className="w-full bg-[#0a0a0a] border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-amber-500">
                   <option>Model: o1-preview</option>
                   <option>Model: gpt-4o</option>
                   <option>Model: gpt-4o-mini</option>
                 </select>
                 <div className="space-y-2 mt-2">
                   <label className="flex items-center gap-2 text-xs text-neutral-300"><input type="checkbox" defaultChecked className="accent-amber-500" /> Enable Complex Reasoning</label>
                   <label className="flex items-center gap-2 text-xs text-neutral-300"><input type="checkbox" defaultChecked className="accent-amber-500" /> Allow File Attachments (50MB)</label>
                   <label className="flex items-center gap-2 text-xs text-neutral-300"><input type="checkbox" defaultChecked className="accent-amber-500" /> Human Escalation Priority 1</label>
                 </div>
               </div>

               {/* Standard Client */}
               <div className="p-4 border border-neutral-700 bg-[#0a0a0a] rounded-lg flex flex-col gap-3">
                 <div className="flex justify-between items-center">
                   <span className="text-sm font-bold text-neutral-300 uppercase tracking-widest">Standard / Default</span>
                   <span className="text-[10px] text-neutral-500 border border-neutral-600 px-2 rounded-full">Cost Optimized</span>
                 </div>
                 <select className="w-full bg-[#0a0a0a] border border-neutral-600 rounded-lg px-3 py-2 text-sm text-white font-mono focus:border-primary">
                   <option>Model: gpt-4o-mini</option>
                   <option>Model: gpt-4o</option>
                 </select>
                 <div className="space-y-2 mt-2">
                   <label className="flex items-center gap-2 text-xs text-neutral-400"><input type="checkbox" className="accent-primary" /> Enable Complex Reasoning</label>
                   <label className="flex items-center gap-2 text-xs text-neutral-300"><input type="checkbox" defaultChecked className="accent-primary" /> Allow Images Only (No Docs)</label>
                   <label className="flex items-center gap-2 text-xs text-neutral-300"><input type="checkbox" defaultChecked className="accent-primary" /> Standard Queue Escalation</label>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <Settings2 className="w-5 h-5 text-primary" />
              Global System Instructions
            </h3>
            <textarea 
              className="w-full h-48 bg-[#0a0a0a] border border-neutral-700 rounded-lg p-4 text-sm text-neutral-300 font-mono focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none leading-relaxed"
              defaultValue="You are an expert tech support agent for Gates Technology in Egypt.
Always respond in Egyptian Arabic.
Be polite, professional, and empathetic.
If a customer complains about price, offer alternatives and mention the 12-month zero-interest installment plan.
If the user uses profanity, issue a polite warning and escalate."
            />
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-primary" />
              Enabled Function Calling
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {[
                 { name: 'check_warranty(serialNumber)', desc: 'Validates warranty status from external API.', enabled: true },
                 { name: 'create_ticket(subject, issue)', desc: 'Opens a new support ticket in the CRM.', enabled: true },
                 { name: 'check_inventory(sku)', desc: 'Checks live stock levels for an item.', enabled: true },
                 { name: 'escalate_to_human(reason)', desc: 'Transfers chat to a live L1/L2 agent.', enabled: true },
                 { name: 'issue_refund(orderId)', desc: 'Process a refund directly.', enabled: false },
               ].map((func, i) => (
                 <div key={i} className="flex items-start justify-between p-3 border border-neutral-800 rounded-lg bg-[#0a0a0a]/50">
                    <div>
                      <div className="font-mono text-sm text-emerald-400 mb-1 break-all">{func.name}</div>
                      <div className="text-xs text-neutral-500 leading-tight">{func.desc}</div>
                    </div>
                    <button className={`flex-shrink-0 ml-2 w-10 h-5 rounded-full relative transition-colors ${func.enabled ? 'bg-primary' : 'bg-neutral-700'}`}>
                       <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${func.enabled ? 'translate-x-5' : ''}`} />
                    </button>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* AI Suggestions Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-neutral-900 to-[#0a0a0a] border border-neutral-800 rounded-xl p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] sticky top-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
              <BrainCircuit className="w-4 h-4 text-emerald-500" />
              AI Agent Thoughts
            </h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Based on the last 1,000 conversations, the AI has generated these suggestions to improve automation logic.
            </p>

            <div className="space-y-4">
               <div className="p-4 border border-emerald-900/40 bg-emerald-900/10 rounded-lg border-l-4 border-l-emerald-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-400">New Function Suggested</span>
                  </div>
                  <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
                    "I am frequently asked for store locations in Nasr City. Add a <code className="text-emerald-300 bg-emerald-900/40 px-1 rounded">get_store_hours(branch)</code> function."
                  </p>
                  <button className="text-[10px] uppercase tracking-widest font-bold text-white bg-emerald-600 px-3 py-1.5 rounded hover:bg-emerald-500 transition-colors w-full shadow-sm">Implement Logic</button>
               </div>

               <div className="p-4 border border-neutral-800 bg-[#0a0a0a] rounded-lg border-l-4 border-l-neutral-600">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm font-medium text-neutral-400">Instruction Conflict</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                    "I am instructed to offer alternatives, but the inventory tool sometimes times out (status 504), causing me to apologize repeatedly."
                  </p>
               </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-neutral-800">
               <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-neutral-700 text-sm font-medium text-neutral-300 rounded hover:bg-neutral-800 transition-colors shadow-sm bg-[#0a0a0a]">
                 <Play className="w-4 h-4 text-neutral-400" />
                 Run Simulation Test
               </button>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
