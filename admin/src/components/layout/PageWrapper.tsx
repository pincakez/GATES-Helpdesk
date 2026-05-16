import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface PageWrapperProps {
  children: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageWrapper({ children, title, description, action }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col h-full gap-6"
    >
      <div className="flex justify-between items-start mt-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100">{title}</h1>
          {description && <p className="text-sm text-neutral-400 mt-1">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </motion.div>
  );
}
