import React, { createContext, useContext, useState, ReactNode } from "react";
import { Link } from "react-router";

export type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  type: ToastType;
  title?: string;
  message: string;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
}

interface ToastContextProps {
  addToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, ...toast }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const variantClasses = {
    success: {
      container:
        "border-green-500 bg-green-50 dark:border-green-500/30 dark:bg-green-500/15",
      icon: "text-green-500",
    },
    error: {
      container:
        "border-red-500 bg-red-50 dark:border-red-500/30 dark:bg-red-500/15",
      icon: "text-red-500",
    },
    warning: {
      container:
        "border-yellow-500 bg-yellow-50 dark:border-yellow-500/30 dark:bg-yellow-500/15",
      icon: "text-yellow-500",
    },
    info: {
      container:
        "border-blue-500 bg-blue-50 dark:border-blue-500/30 dark:bg-blue-500/15",
      icon: "text-blue-500",
    },
  };

  const icons = {
    success: (
      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
        <path d="M3.70186 12.0001C3.70186 7.41711 7.41711 3.70186 12.0001 3.70186C16.5831 3.70186 20.2984 7.41711 20.2984 12.0001C20.2984 16.5831 16.5831 20.2984 12.0001 20.2984C7.41711 20.2984 3.70186 16.5831 3.70186 12.0001ZM15.6197 10.7395C15.9712 10.388 15.9712 9.81819 15.6197 9.46672C15.2683 9.11525 14.6984 9.11525 14.347 9.46672L11.1894 12.6243L9.6533 11.0883C9.30183 10.7368 8.73198 10.7368 8.38051 11.0883C8.02904 11.4397 8.02904 12.0096 8.38051 12.3611L10.553 14.5335C10.7217 14.7023 10.9507 14.7971 11.1894 14.7971C11.428 14.7971 11.657 14.7023 11.8257 14.5335L15.6197 10.7395Z" />
      </svg>
    ),
    error: (
      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.536 13.536a1 1 0 0 1-1.414 0L12 13.414 l-2.122 2.122a1 1 0 0 1-1.414-1.414L10.586 12 8.464 9.879a1 1 0 1 1 1.414-1.414L12 10.586 l2.122-2.121a1 1 0 0 1 1.414 1.414L13.414 12 l2.122 2.122a1 1 0 0 1 0 1.414z"
        />
      </svg>
    ),

    warning: (
      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
        <path d="M3.6501 12.0001C3.6501 7.38852 7.38852 3.6501 12.0001 3.6501C16.6117 3.6501 20.3501 7.38852 20.3501 12.0001C20.3501 16.6117 16.6117 20.3501 12.0001 20.3501C7.38852 20.3501 3.6501 16.6117 3.6501 12.0001ZM12.0002 17.3715C11.586 17.3715 11.2502 17.0357 11.2502 16.6215V10.945C11.2502 10.5308 11.586 10.195 12.0002 10.195C12.4144 10.195 12.7502 10.5308 12.7502 10.945V16.6215C12.7502 17.0357 12.4144 17.3715 12.0002 17.3715Z" />
      </svg>
    ),
    info: (
      <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24">
        <path d="M3.6501 11.9996C3.6501 7.38803 7.38852 3.64961 12.0001 3.64961C16.6117 3.64961 20.3501 7.38803 20.3501 11.9996C20.3501 16.6112 16.6117 20.3496 12.0001 20.3496C7.38852 20.3496 3.6501 16.6112 3.6501 11.9996ZM12.0002 17.371C11.586 17.371 11.2502 17.0352 11.2502 16.621V10.9445C11.2502 10.5303 11.586 10.1945 12.0002 10.1945C12.4144 10.1945 12.7502 10.5303 12.7502 10.9445V16.621" />
      </svg>
    ),
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-xl border p-4 max-w-sm w-full shadow-lg flex items-start gap-3 transition-all duration-300 ${
              variantClasses[t.type].container
            }`}
          >
            <div className={`-mt-0.5 ${variantClasses[t.type].icon}`}>
              {icons[t.type]}
            </div>
            <div>
              {t.title && (
                <h4 className="mb-1 text-sm font-semibold text-gray-800 dark:text-white/90">
                  {t.title}
                </h4>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.message}
              </p>
              {t.showLink && (
                <Link
                  to={t.linkHref || "#"}
                  className="inline-block mt-3 text-sm font-medium text-gray-500 underline dark:text-gray-400"
                >
                  {t.linkText || "Learn more"}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
