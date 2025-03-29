import { motion } from 'framer-motion';

export function SlideIn({ 
  children, 
  direction = 'left',
  delay = 0 
}: { 
  children: React.ReactNode; 
  direction?: 'left' | 'right' | 'top' | 'bottom';
  delay?: number;
}) {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -20 : direction === 'right' ? 20 : 0,
      y: direction === 'top' ? -20 : direction === 'bottom' ? 20 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}