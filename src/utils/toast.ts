// utils/toast.ts
import toast from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message, {
    style: {
      background: '#10b981', // emerald-500
      color: 'white',
    },
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    style: {
      background: '#ef4444', // rose-500
      color: 'white',
    },
  });
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const dismissToast = (toastId?: string) => {
  toast.dismiss(toastId);
};

export const showPromiseToast = <T = any>(
  promise: Promise<T>,
  messages: { loading: string; success: string | ((data: T) => string); error: string | ((err: any) => string) }
) => {
  return toast.promise(promise, {
    loading: messages.loading,
    success: messages.success,
    error: messages.error,
  });
};
