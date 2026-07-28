import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Clases Tailwind de ancho del panel. Default: modal grande. */
  width?: string;
}

/* ============================================================
 * <Modal /> — contenedor genérico, sin conocimiento de "Alert".
 * Reutilizable en cualquier otro modal de la plataforma.
 * ========================================================== */
export function Modal({
  open,
  onClose,
  children,
  width = 'w-[95vw] sm:w-[85vw] lg:w-[75vw] xl:w-[65vw] max-w-6xl',
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative ${width} bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden`}>
        {children}
      </div>
    </div>
  );
}