'use client';

import { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <input ref={ref} className={clsx('input', error && 'border-red-500 focus:border-red-500', className)} {...props} />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

export { Input };
