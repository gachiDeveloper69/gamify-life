import type { ButtonHTMLAttributes, ReactNode } from 'react';

type QButtonProps = {
  children: ReactNode;
  ClassName?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function QButton({
  children,
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ...rest
}: QButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`qbtn ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
