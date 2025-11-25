import { useEffect, useRef } from 'react';
import { trackSkipDialogOpened, trackSkipDialogClosed, trackSkipQuiz } from '../../services';

interface SkipDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  screenIndex: number;
}

export function SkipDialog({ isOpen, onClose, onSkip, screenIndex }: SkipDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Track dialog open/close
  useEffect(() => {
    if (isOpen) {
      trackSkipDialogOpened(screenIndex);
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Focus the dialog
      setTimeout(() => dialogRef.current?.focus(), 0);
    }
  }, [isOpen, screenIndex]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    trackSkipDialogClosed(screenIndex);
    onClose();
    // Return focus
    previousFocusRef.current?.focus();
  };

  const handleSkip = () => {
    trackSkipQuiz(screenIndex);
    onSkip();
    previousFocusRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="skip-dialog-title"
        aria-describedby="skip-dialog-description"
        tabIndex={-1}
        className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200"
      >
        <h2
          id="skip-dialog-title"
          className="text-xl font-semibold text-[#3A2D32] mb-3 font-inter"
        >
          Skip the quiz?
        </h2>

        <p
          id="skip-dialog-description"
          className="text-[#696969] mb-6 font-inter"
        >
          Only skip the quiz if you've previously completed it, as it's required
          to create a personalized routine based on your hair condition,
          lifestyle, and other key factors.
        </p>

        <div className="flex gap-3">
          {/* Continue Quiz - Orange button (primary action) */}
          <button
            onClick={handleClose}
            className="flex-1 py-3 px-4 rounded-[10px] font-medium text-white transition-all hover:brightness-110 active:scale-[0.98] font-inter"
            style={{ backgroundColor: '#FE6903' }}
          >
            Continue Quiz
          </button>
          {/* Skip Quiz - Secondary/outline style */}
          <button
            onClick={handleSkip}
            className="flex-1 py-3 px-4 rounded-[10px] font-medium transition-all hover:bg-gray-100 active:scale-[0.98] font-inter"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #7375A6',
              color: '#7375A6',
            }}
          >
            Skip Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
