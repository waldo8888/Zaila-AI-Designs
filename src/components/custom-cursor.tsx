"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouch, setIsTouch] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Check if device is touch-based
        if (window.matchMedia("(hover: none)").matches) {
            setIsTouch(true);
            return;
        }

        // Hide default cursor in CSS
        document.body.style.cursor = "none";

        // Enforce custom cursor on children elements
        const style = document.createElement("style");
        style.innerHTML = `* { cursor: none !important; }`;
        document.head.appendChild(style);

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
            if (!isVisible) setIsVisible(true);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                target.tagName.toLowerCase() === "a" ||
                target.tagName.toLowerCase() === "button" ||
                target.closest("a") ||
                target.closest("button") ||
                target.classList.contains("interactive")
            ) {
                setIsHovered(true);
            } else {
                setIsHovered(false);
            }
        };

        const handleMouseLeave = () => {
            setIsVisible(false);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.body.style.cursor = "auto";
            document.head.removeChild(style);
        };
    }, [cursorX, cursorY, isVisible]);

    if (isTouch) return null;

    return (
        <>
            {/* Outer Ring */}
            <motion.div
                className="pointer-events-none fixed left-0 top-0 z-[9999] h-8 w-8 rounded-full border border-fuchsia-500/50 mix-blend-difference hidden md:block"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isHovered ? 1.5 : 1,
                    backgroundColor: isHovered ? "rgba(217, 70, 239, 0.1)" : "transparent",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />

            {/* Inner Dot */}
            <motion.div
                className="pointer-events-none fixed left-0 top-0 z-[10000] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference hidden md:block"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: 13,
                    translateY: 13,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isHovered ? 0 : 1, // Shrink dot on hover 
                }}
                transition={{ duration: 0.2 }}
            />
        </>
    );
}
