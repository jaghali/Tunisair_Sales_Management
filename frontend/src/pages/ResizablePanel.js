"use client";

import React, { createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useMeasure from "react-use-measure";

const PanelContext = createContext({ value: "" });

export function PanelContextProvider({ children, value }) {
  const [ref, bounds] = useMeasure();

  return (
    <motion.div
      animate={{ height: bounds.height > 0 ? bounds.height : undefined }}
      transition={{ type: "spring", bounce: 0, duration: 0.8 }}
      style={{ overflow: "hidden", position: "relative" }}
    >
      <div ref={ref}>
        <PanelContext.Provider value={{ value }}>
          <div>{children}</div>
        </PanelContext.Provider>
      </div>
    </motion.div>
  );
}

export function Content({ value, children }) {
  const panelContext = useContext(PanelContext);
  const isActive = panelContext.value === value;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { type: "ease", ease: "easeInOut", duration: 0.3, delay: 0.2 },
          }}
          exit={{
            opacity: 0,
            transition: { type: "ease", ease: "easeInOut", duration: 0.2 },
          }}
          style={{ position: "relative" }}
        >
          <div>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
