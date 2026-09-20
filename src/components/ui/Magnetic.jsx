import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const spring = { stiffness: 280, damping: 18, mass: 0.35 };

const Magnetic = ({ children, className = "", strength = 18 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const handleMove = (event) => {
    const node = ref.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;

    const rect = node.getBoundingClientRect();
    const offsetX = event.clientX - (rect.left + rect.width / 2);
    const offsetY = event.clientY - (rect.top + rect.height / 2);

    x.set(offsetX / strength);
    y.set(offsetY / strength);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: "inline-flex" }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  );
};

export default Magnetic;
