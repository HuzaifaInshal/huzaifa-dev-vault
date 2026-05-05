import { cn } from "../utils";

export const handleRippleAnimation = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  overwriteClassname?: string
) => {
  const btn = e.currentTarget;
  if (!btn) return;

  const ripple = document.createElement("span");
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;

  const rect = btn.getBoundingClientRect();
  const dx = e.clientX - rect.left;
  const dy = e.clientY - rect.top;

  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${dx - radius}px`;
  ripple.style.top = `${dy - radius}px`;

  ripple.className = cn(
    "opacity-70 ripple pointer-events-none bg-white/40",
    overwriteClassname
  );

  btn.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
};
