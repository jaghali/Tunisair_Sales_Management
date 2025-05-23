"use client";

import { X } from 'lucide-react';
import * as RadixToast from "@radix-ui/react-toast";
import { AnimatePresence, color, motion } from "framer-motion";
import {
  createContext,
  useContext,
  useState,
  forwardRef,
} from "react";

const ToastContext = createContext({
  showToast: () => {
    throw new Error(
      "You can't call showToast() outside of a <ToastProvider> – add it to your tree."
    );
  },
});

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [messages, setMessages] = useState([]);

  function showToast(text) {
    setMessages((toasts) => [
      ...toasts,
      {
        id: crypto.randomUUID(),
        text,
      },
    ]);
  }

  function handleClose(id) {
    setMessages((toasts) => toasts.filter((t) => t.id !== id));
  }

  return (
    <RadixToast.Provider swipeDirection="right">
      <ToastContext.Provider value={{ showToast }}>
        {children}
      </ToastContext.Provider>

      <AnimatePresence mode="popLayout">
        {messages.map(({ id, text }) => (
          <Toast key={id} text={text} onClose={() => handleClose(id)} />
        ))}
      </AnimatePresence>

      <RadixToast.Viewport style={styles.viewport} />
    </RadixToast.Provider>
  );
}

const Toast = forwardRef(function Toast({ onClose, text }, forwardedRef) {
  const width = 320;
  const margin = 16;

  return (
    <RadixToast.Root
      ref={forwardedRef}
      asChild
      forceMount
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      duration={2500}
    >
      <motion.li
        layout
        initial={{ x: width + margin }}
        animate={{ x: 0 }}
        exit={{
          opacity: 0,
          zIndex: -1,
          transition: { opacity: { duration: 0.2 } },
        }}
        transition={{
          type: "spring",
          mass: 1,
          damping: 30,
          stiffness: 200,
        }}
        style={{ width, WebkitTapHighlightColor: "transparent", listStyle: "none" }}
      >
        <div style={styles.toastContainer}>
          <RadixToast.Description style={styles.description}>
            {text}
          </RadixToast.Description>
          <RadixToast.Close style={styles.closeButton}>
            <X style={styles.closeIcon} />
          </RadixToast.Close>
        </div>
      </motion.li>
    </RadixToast.Root>
  );
});

const styles = {
  viewport: {
    position: "fixed",
    top: 16, // top-4
    right: 16, // right-4
    display: "flex",
    flexDirection: "column-reverse",
    gap: 12, // gap-3 (3*4 = 12px)
    width: 320, // w-80 (80 * 4 = 320px)
    maxWidth: "100vw",
    zIndex: 9999,
  },
  toastContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    whiteSpace: "nowrap",
    borderRadius: 8, 
    backgroundColor: "rgba(200, 5, 5, 0.875)",
    color: "white",
    fontSize: 14, 
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
    backdropFilter: "blur(4px)", 
    paddingLeft: 16,
    paddingRight: 0,
  },
  description: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    padding: 16,
  },
  closeButton: {
    padding: 16,
    color: "rgba(156, 163, 175, 1)", 
    backgroundColor:"transparent",
    border:"none",
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    height: 20, 
    width: 20, 
    color:"white"
  },
};
