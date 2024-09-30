// hooks/Chat/usePopupMessage.ts
import { useState, useCallback } from 'react';

export const usePopupMessage = () => {
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const showPopup = useCallback((message: string) => {
    setPopupMessage(message);
    setTimeout(() => setPopupMessage(null), 2000);
  }, []);

  return {
    popupMessage,
    showPopup,
  };
};
