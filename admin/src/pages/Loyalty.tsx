import { PageWrapper } from '../components/layout/PageWrapper';
import { Star } from 'lucide-react';

export default function Loyalty() {
  return (
    <PageWrapper title="Loyalty Points System" description="Manage customer rewards, tier thresholds, and point transactions.">
       <div className="flex flex-col items-center justify-center p-12 bg-neutral-900 border border-neutral-800 rounded-xl border-dashed">
        <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800 mb-4 shadow-sm">
          <Star className="w-8 h-8 text-yellow-500 fill-yellow-500/20" />
        </div>
        <h2 className="text-lg font-medium text-white mb-2">Loyalty Rules Engine</h2>
        <p className="text-neutral-400 text-sm max-w-md text-center">
          Configure how many points customers earn per repair or purchase, and manage redemptions. (UI Concept Placeholder)
        </p>
      </div>
    </PageWrapper>
  );
}
