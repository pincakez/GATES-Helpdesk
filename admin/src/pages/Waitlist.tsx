import { PageWrapper } from '../components/layout/PageWrapper';
import { MessageCircle } from 'lucide-react';

export default function Waitlist() {
  return (
    <PageWrapper 
      title="Back-in-Stock & WhatsApp Push" 
      description="Manage customer waitlists and trigger automated WhatsApp notifications."
      action={
        <button className="bg-[#25D366] hover:bg-[#1EBE5C] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <MessageCircle className="w-4 h-4 fill-white" />
          Connect WhatsApp API
        </button>
      }
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden mt-4">
         <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 bg-neutral-900/50">
                <th className="px-6 py-4 font-medium">Item Requested</th>
                <th className="px-6 py-4 font-medium">Waiting Customers</th>
                <th className="px-6 py-4 font-medium">Stock Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              <tr>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">MacBook Pro M3 Screen Panel</span>
                    <span className="text-neutral-500 font-mono mt-1">SKU: A2992-SCR</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-300">14 customers</td>
                 <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded text-red-500">Out of Stock</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button disabled className="font-semibold px-3 py-1.5 bg-neutral-800 text-neutral-500 rounded cursor-not-allowed">
                    Send Notifications
                  </button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">Dell XPS 15 Battery (97Wh)</span>
                    <span className="text-neutral-500 font-mono mt-1">SKU: DELL-XPS-B97</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-neutral-300">8 customers</td>
                 <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded bg-emerald-900/20 text-emerald-500">In Stock (12)</span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="font-semibold px-3 py-1.5 bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 rounded transition-colors">
                    Push to WhatsApp
                  </button>
                </td>
              </tr>
            </tbody>
         </table>
      </div>
    </PageWrapper>
  );
}
