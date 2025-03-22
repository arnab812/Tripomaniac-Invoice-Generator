
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import logo from '../assets/logo.svg';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6">
      <motion.div 
        className={cn(
          "flex justify-center items-center",
          "stagger-item"
        )}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <img 
          src={logo} 
          alt="Tripomaniac" 
          className="h-12 md:h-16 object-contain"
        />
      </motion.div>
    </header>
  );
};

export default Header;
