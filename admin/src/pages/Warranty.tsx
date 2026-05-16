import { PageWrapper } from '../components/layout/PageWrapper';
import { ShieldCheck, Search } from 'lucide-react';

export default function Warranty() {
  return (
    <PageWrapper title="Warranty Check" description="Verify device warranty status via serial numbers (Integration Placeholder).">
      <div className="max-w-xl">
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl">
           <h3 className="font-medium text-neutral-100 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Check Device Coverage
           </h3>
           <div className="relative mb-6">
            <Search className="w-5 h-5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Enter device serial number (e.g. SN-109249X)" 
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-10 pr-4 py-3 text-sm text-neutral-200 placeholder-neutral-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none uppercase font-mono"
            />
          </div>
          <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg text-center text-sm text-neutral-500">
            Enter a serial number to fetch warranty info from vendor APIs (Dell, HP, Apple, Lenovo).
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
