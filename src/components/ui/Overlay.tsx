import { ReactNode } from 'react';

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Overlay({ isOpen, onClose, children }: OverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-40"
      onClick={onClose}
    >
      {children}
    </div>
  );
}