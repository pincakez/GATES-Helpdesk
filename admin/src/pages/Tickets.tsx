import { PageWrapper } from '../components/layout/PageWrapper';
import { Search, Filter, MoreHorizontal, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

const mockTickets = [
  { id: 'GH-2041', subject: 'Dell XPS 15', status: 'Open', priority: 'High', customer: 'Ahmed Alrashidi', date: 'May 12, 2026', issue: 'Laptop freezes entirely and won\'t shut down properly.' },
  { id: 'GH-2035', subject: 'HP Spectre x360', status: 'Processing', priority: 'Medium', customer: 'Sara Khalid', date: 'May 10, 2026', issue: 'Screen glitching with horizontal lines.' },
  { id: 'GH-2029', subject: 'MacBook Pro M3', status: 'Resolved', priority: 'Low', customer: 'Fahad Otaibi', date: 'May 5, 2026', issue: 'Battery drains too fast.' },
  { id: 'GH-2021', subject: 'Lenovo ThinkPad', status: 'Closed', priority: 'Low', customer: 'Mohammad Adel', date: 'Apr 28, 2026', issue: 'Keyboard not working - A key broken.' },
  { id: 'GH-2018', subject: 'ASUS ROG', status: 'Open', priority: 'High', customer: 'Yasser Omar', date: 'Apr 25, 2026', issue: 'Laptop overheats drastically during gaming.' },
];

export default function Tickets() {
  return (
    <PageWrapper 
      title="Ticket Management" 
      description="Manage and respond to customer support tickets."
      action={
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary/20">
          Create Ticket
        </button>
      }
    >
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-14rem)]">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex-1 max-w-sm relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by ID, Customer, or Subject" 
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-800 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Table/List View */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-500 bg-neutral-900/50">
                <th className="px-6 py-4 font-medium">Ticket</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Status & Priority</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {mockTickets.map((ticket, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={ticket.id} 
                  className="hover:bg-neutral-800/40 transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">{ticket.subject}</span>
                      <span className="text-neutral-500 flex items-center gap-2 mt-1">
                        {ticket.id} <span className="w-1 h-1 rounded-full bg-neutral-600"></span> {ticket.issue.substring(0, 40)}...
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">{ticket.customer}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`font-medium ${ticket.priority === 'High' ? 'text-red-500' : ticket.priority === 'Medium' ? 'text-orange-500' : 'text-neutral-500'}`}>
                        {ticket.priority}
                      </span>
                      <StatusBadge status={ticket.status} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 whitespace-nowrap">{ticket.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-neutral-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="Reply">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-md transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </PageWrapper>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    'Open': 'bg-emerald-900/20 text-emerald-500',
    'Processing': 'bg-neutral-800 text-white',
    'Resolved': 'bg-neutral-800 text-neutral-400',
    'Closed': 'bg-neutral-800 text-neutral-400',
  }[status] || 'bg-neutral-800 text-neutral-400';

  return (
    <span className={`px-2 py-0.5 rounded text-xs ${styles}`}>
      {status}
    </span>
  );
}
