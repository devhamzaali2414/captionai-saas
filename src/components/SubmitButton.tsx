'use client';

import { useFormStatus } from 'react-dom';
import React from 'react';

export default function SubmitButton({
  children,
  className,
  style,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className || ''} ${pending ? 'opacity-50 pointer-events-none' : ''}`}
      style={style}
      {...props}
    >
      {pending ? 'Working...' : children}
    </button>
  );
}
