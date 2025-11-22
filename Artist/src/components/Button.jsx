import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', ...props }) => {
  const baseStyles = "px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer";
  
  const variants = {
    primary: "bg-(--color-accent-green) text-black hover:bg-(--color-accent-hover) hover:shadow-[0_0_15px_rgba(29,185,84,0.4)]",
    secondary: "bg-white text-black hover:bg-gray-200",
    outline: "border border-(--color-border-subtle) text-white hover:border-white",
    ghost: "text-(--color-text-secondary) hover:text-white hover:bg-(--color-card-hover)",
    google: "bg-white text-black hover:bg-gray-100 relative"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
