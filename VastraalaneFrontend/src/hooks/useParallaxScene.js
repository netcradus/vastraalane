import { useEffect } from "react";

function supportsMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useParallaxScene(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !supportsMotion()) {
      return undefined;
    }

    const scenes = Array.from(root.querySelectorAll("[data-parallax-scene]"));
    if (!scenes.length) {
      return undefined;
    }

    let ticking = false;

    const updateParallax = () => {
      ticking = false;

      scenes.forEach((scene) => {
        const rect = scene.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 1;
        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        const eased = Math.max(-1, Math.min(1, progress - 0.5));

        scene.querySelectorAll("[data-parallax-layer]").forEach((layer) => {
          const speed = Number(layer.getAttribute("data-speed") || 0);
          const y = eased * speed * 90;
          const z = Number(layer.getAttribute("data-depth") || 0);
          layer.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
          layer.style.setProperty("--parallax-z", `${z}px`);
        });
      });
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    };

    updateParallax();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [ref]);
}
