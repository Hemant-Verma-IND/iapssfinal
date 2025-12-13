// src/components/ui/LoadingDots.jsx
import { motion } from 'framer-motion';

const Dot = ({ delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0 }}
    animate={{ opacity: [0, 1, 0] }}
    transition={{
      duration: 0.9,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
      delay,
    }}
    style={{ display: 'inline-block' }}
  >
    .
  </motion.span>
);

const LoadingDots = () => (
  <span
    style={{
      display: 'inline-flex',
      marginLeft: 4,
      fontSize: '1.1em',
      alignItems: 'baseline',
    }}
  >
    <Dot delay={0} />
    <Dot delay={0.2} />
    <Dot delay={0.4} />
  </span>
);

export default LoadingDots;
