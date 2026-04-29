'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
      primary: 'bg-primary hover:bg-primary-hover text-white hover:shadow-glow',
      outline: 'border border-border text-text hover:border-primary hover:text-primary',
      ghost: 'text-text-muted hover:text-text hover:bg-surface-2',
    };
    const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5', lg: 'px-7 py-3.5 text-lg' };

    return (
      <motion.button ref={ref}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        className={clsx(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...(props as object)}>
        {loading && <Loader2 size={16} className="animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
