// frontend/src/components/ui/Toast.jsx
import * as RadixToast from "@radix-ui/react-toast";
import { useState, useCallback, createContext, useContext } from "react";
import { cn } from "@/utils/cn";

const ToastContext = createContext(null);

let externalAdd = null;

export const toast = {
  success: (msg) => externalAdd?.({ type: "success", message: msg }),
  error:   (msg) => externalAdd?.({ type: "error",   message: msg }),
  info:    (msg) => externalAdd?.({ type: "info",    message: msg }),
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((t) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);

  externalAdd = add;

  const icons = {
    success: "✓",
    error:   "✕",
    info:    "ℹ",
  };

  const colors = {
    success: "border-green-200 bg-green-50 text-green-800",
    error:   "border-red-200   bg-red-50   text-red-800",
    info:    "border-blue-200  bg-blue-50  text-blue-800",
  };

  return (
    <ToastContext.Provider value={{ add }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map((t) => (
          <RadixToast.Root
            key={t.id}
            className={cn(
              "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg",
              "animate-slide-up max-w-sm text-sm font-medium",
              colors[t.type]
            )}
          >
            <span className="text-base font-bold">{icons[t.type]}</span>
            <RadixToast.Description>{t.message}</RadixToast.Description>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
};
