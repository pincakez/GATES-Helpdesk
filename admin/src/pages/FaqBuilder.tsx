import { PageWrapper } from '../components/layout/PageWrapper';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function FaqBuilder() {
  return (
    <PageWrapper 
      title="Auto FAQ Builder" 
      description="Extract knowledge from resolved chat tickets automatically using Gemini AI."
    >
      <div className="bg-gradient-to-br from-primary/10 via-surface-card to-surface-card border border-primary/20 rounded-xl p-8 max-w-3xl">
        <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-xl flex items-center justify-center mb-6">
          <Sparkles className="w-6 h-6 text-primary-light" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Automated Knowledge Extraction</h2>
        <p className="text-neutral-400 text-sm mb-8 leading-relaxed max-w-xl">
          The system analyzes support tickets marked as "Resolved" to identify recurring questions. It then synthesizes the best answers into draft FAQ articles for your review.
        </p>
        
        <div className="space-y-4 mb-8">
          {[
            { q: "How to fix ThinkPad keyboard driver issue?", confidence: 94 },
            { q: "ASUS battery draining fast on standby", confidence: 88 }
          ].map((item, i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex items-center justify-between group hover:border-neutral-700 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-neutral-200 mb-1">{item.q}</span>
                <span className="text-xs text-neutral-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Based on 12 related tickets &bull; {item.confidence}% confidence
                </span>
              </div>
              <button className="text-xs font-semibold px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-md transition-colors flex items-center gap-1">
                Review & Publish <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        
        <button className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Run Deep Analysis Now
        </button>
      </div>
    </PageWrapper>
  );
}
