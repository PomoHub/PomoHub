import { createContext, useContext, useState, useRef, ReactNode, useCallback } from 'react';
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: 'danger'
  });
  
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions) => {
    setOptions({
        confirmText: "Confirm",
        cancelText: "Cancel",
        variant: 'danger',
        ...options
    });
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = () => {
    if (resolveRef.current) {
      resolveRef.current(true);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolveRef.current) {
      resolveRef.current(false);
    }
    setIsOpen(false);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <Modal 
        isOpen={isOpen} 
        onClose={handleCancel} 
        title={options.title}
        className="max-w-sm"
      >
        <div className="space-y-6">
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{options.message}</p>
            <div className="flex gap-3 justify-end">
                <button 
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                    {options.cancelText}
                </button>
                <button 
                    onClick={handleConfirm}
                    className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors shadow-sm",
                        options.variant === 'danger' 
                            ? "bg-red-500 hover:bg-red-600" 
                            : "bg-indigo-600 hover:bg-indigo-700"
                    )}
                >
                    {options.confirmText}
                </button>
            </div>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}
