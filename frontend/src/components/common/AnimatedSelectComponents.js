import React from "react";
import { Select, MenuItem, styled } from "@mui/material";
import { motion } from "framer-motion";

// Styled Select component
const AnimatedSelect = styled(Select)(({ theme }) => ({
  height: 50,
  width: "100%",
  backgroundColor: "#fff",
  border: "1px solid #333",
  borderRadius: 4,
  paddingLeft: 20,
  paddingRight: 45,
  color: "#333",
  "& .MuiSelect-icon": {
    transition: "transform 0.3s ease",
  },
  "&.Mui-expanded .MuiSelect-icon": {
    transform: "rotate(180deg)",
  },
}));

// Motion variants for the list container (ul)
const listVariants = {
  open: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
  closed: {},
};

// Motion variants for each list item (li)
const itemVariants = {
  open: (i) => ({
    opacity: 1,
    y: (i + 1) * 30, // vertical translate similar to your original code
    transition: { duration: 0.25, ease: "easeOut" },
  }),
  closed: {
    opacity: 0,
    y: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

// Custom motion ul replacing MUI's MenuList inside Select's MenuProps
const MotionList = React.forwardRef(function MotionList(props, ref) {
  const { children, open, ...other } = props;

  return (
    <motion.ul
      ref={ref}
      style={{
        margin: 0,
        padding: 0,
        listStyle: "none",
        overflow: "hidden",
      }}
      initial="closed"
      animate={open ? "open" : "closed"}
      variants={listVariants}
      {...other}
    >
      {React.Children.map(children, (child, index) =>
        React.cloneElement(child, {
          component: motion.li,
          custom: index,
          variants: itemVariants,
          style: { originX: 0, originY: 0 },
        })
      )}
    </motion.ul>
  );
});

// Main export component
export default function CustomAnimatedSelect(props) {
  const { value, onChange, children, ...other } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <AnimatedSelect
      {...other}
      value={value}
      onChange={onChange}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      MenuProps={{
        MenuListProps: {
          component: MotionList,
          open: open,
        },
        PaperProps: {
          style: { overflow: "visible" }, // Allow animation overflow
        },
        transitionDuration: 0, // Disable default menu transitions
        disableScrollLock: true,
      }}
    >
      {children}
    </AnimatedSelect>
  );
}

// Named export of MenuItem to use alongside CustomAnimatedSelect
export { MenuItem  };
