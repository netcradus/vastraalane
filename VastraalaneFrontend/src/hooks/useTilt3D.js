import { useEffect, useRef } from "react";

function getReducedMotionPreference() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useTilt3D({ maxRotate = 10, glare = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || getReducedMotionPreference()) {
      return undefined;
    }

    let frameId = 0;
    let pointerInside = false;
    let bounds = null;
    let nextState = {
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      glareOpacity: 0,
    };

    const render = () => {
      frameId = 0;
      element.style.setProperty("--tilt-rotate-x", `${nextState.rotateX.toFixed(2)}deg`);
      element.style.setProperty("--tilt-rotate-y", `${nextState.rotateY.toFixed(2)}deg`);
      if (glare) {
        element.style.setProperty("--tilt-glare-x", `${nextState.glareX.toFixed(2)}%`);
        element.style.setProperty("--tilt-glare-y", `${nextState.glareY.toFixed(2)}%`);
        element.style.setProperty("--tilt-glare-opacity", `${nextState.glareOpacity}`);
      }
    };

    const queueRender = () => {
      if (!frameId) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const updateBounds = () => {
      bounds = element.getBoundingClientRect();
    };

    const resetTilt = () => {
      nextState = {
        rotateX: 0,
        rotateY: 0,
        glareX: 50,
        glareY: 50,
        glareOpacity: 0,
      };
      queueRender();
    };

    const handlePointerMove = (event) => {
      if (!pointerInside) {
        pointerInside = true;
        updateBounds();
      }

      if (!bounds) {
        updateBounds();
      }

      const percentX = (event.clientX - bounds.left) / bounds.width;
      const percentY = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (percentX - 0.5) * maxRotate * 2;
      const rotateX = (0.5 - percentY) * maxRotate * 2;

      nextState = {
        rotateX,
        rotateY,
        glareX: percentX * 100,
        glareY: percentY * 100,
        glareOpacity: 0.24,
      };
      queueRender();
    };

    const handlePointerLeave = () => {
      pointerInside = false;
      resetTilt();
    };

    element.addEventListener("pointermove", handlePointerMove);
    element.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", updateBounds);

    return () => {
      element.removeEventListener("pointermove", handlePointerMove);
      element.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", updateBounds);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [glare, maxRotate]);

  return ref;
}
