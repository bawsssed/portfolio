import { useEffect, useRef, useState } from "react";
import "./cursor.css";

const HOVER_SELECTOR = "a, button, input, textarea, select, label, [data-cursor='hover']";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)");
    const sync = () => setEnabled(finePointer.matches);
    
    sync();
    finePointer.addEventListener("change", sync);
    
    return () => finePointer.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("has-custom-cursor");

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    
    if (!cursor || !dot) return;

    const move = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    const handleMouseOver = (e) => {
      if (e.target.closest(HOVER_SELECTOR)) {
        dot.classList.add("is-hover");
      }
    };

    const handleMouseOut = (e) => {
      if (e.target.closest(HOVER_SELECTOR)) {
        dot.classList.remove("is-hover");
      }
    };

    const enter = () => {
      cursor.style.opacity = "1";
    };

    const leave = () => {
      cursor.style.opacity = "0";
      dot.classList.remove("is-hover");
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.addEventListener("mouseenter", enter, { passive: true });
    document.addEventListener("mouseleave", leave, { passive: true });

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseenter", enter);
      document.removeEventListener("mouseleave", leave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={cursorRef}
      className="cursor"
      style={{ opacity: 0, pointerEvents: "none", position: "fixed", top: 0, left: 0, zIndex: 9999 }}
      aria-hidden="true"
    >
      <span ref={dotRef} className="cursor__dot" />
    </div>
  );
};

export default CustomCursor;