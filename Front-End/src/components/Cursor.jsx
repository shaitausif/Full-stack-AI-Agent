import { useEffect, useState } from "react";
import { motion } from "motion/react";

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(window.innerWidth >= 768);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      if (isVisible) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleResize = () => {
      setIsVisible(window.innerWidth >= 768);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed w-3 h-3 rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        }}
        animate={{
          x: position.x,
          y: position.y,
          scale: isClicking ? 0.6 : 1,
        }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
      {/* Trailing glow ring */}
      <motion.div
        className="fixed w-8 h-8 rounded-full pointer-events-none z-[998] -translate-x-1/2 -translate-y-1/2 border border-blue-400/30"
        animate={{
          x: position.x,
          y: position.y,
          scale: isClicking ? 1.5 : 1,
          opacity: isClicking ? 0.2 : 0.5,
        }}
        transition={{ duration: 0.4, ease: "backOut" }}
      />
    </>
  );
};

export default Cursor;
