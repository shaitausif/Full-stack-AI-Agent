import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Cursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(window.innerWidth >= 768); // Show only on PC

  useEffect(() => {
    const moveCursor = (e) => {
      if (isVisible) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleResize = () => {
      setIsVisible(window.innerWidth >= 768);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("resize", handleResize);
    };
  }, [isVisible]);

  if (!isVisible) return null; // Hide cursor on mobile

  return (
    <motion.div
      className="fixed w-5 h-5 bg-blue-500 rounded-full pointer-events-none z-[999] -translate-x-1/2 -translate-y-1/2"
      animate={{ x: position.x, y: position.y }}
      transition={{ duration: 0.6, ease: "backOut" }}
    />
  );
};

export default Cursor;
