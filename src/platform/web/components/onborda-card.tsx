"use client";

import { useRef, useEffect } from "react";
import type { CardComponentProps } from "onborda";
import { useOnborda } from "onborda";
import { X } from "lucide-react";
import { useUpdateSettings } from "@/core/hooks/use-settings";
import { isDemoUser } from "@/core/services/auth";

export function OnbordaCard({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  arrow,
}: CardComponentProps) {
  const { closeOnborda } = useOnborda();
  const updateSettings = useUpdateSettings();
  const cardRef = useRef<HTMLDivElement>(null);

  const dismiss = () => {
    if (isDemoUser()) {
      sessionStorage.setItem("hv-tour-dismissed", "1");
    } else {
      updateSettings.mutate({ onboarding_completed: true } as any);
    }
    closeOnborda();
  };

  // Nudge onborda's positioning wrapper so the card stays in the viewport.
  // Onborda positions an absolute/fixed parent — we find it and adjust.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const nudge = () => {
      // Walk up to find the positioned parent onborda uses
      const wrapper = el.closest("[style]")?.parentElement?.closest("[style]") as HTMLElement | null;
      const target = wrapper ?? el;

      const rect = target.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pad = 12;

      // Parse current left/top from inline style
      const style = target.style;
      const curLeft = parseFloat(style.left) || 0;
      const curTop = parseFloat(style.top) || 0;

      let newLeft = curLeft;
      let newTop = curTop;

      if (rect.left < pad) newLeft = curLeft + (pad - rect.left);
      else if (rect.right > vw - pad) newLeft = curLeft + ((vw - pad) - rect.right);
      if (rect.top < pad) newTop = curTop + (pad - rect.top);
      else if (rect.bottom > vh - pad) newTop = curTop + ((vh - pad) - rect.bottom);

      if (newLeft !== curLeft) style.left = `${newLeft}px`;
      if (newTop !== curTop) style.top = `${newTop}px`;
    };

    const timers = [50, 200, 500].map((ms) => setTimeout(nudge, ms));
    return () => timers.forEach(clearTimeout);
  }, [currentStep]);

  return (
    <div ref={cardRef} className="relative w-72 rounded-lg border border-border bg-card p-4 shadow-xl">
      {/* Close button */}
      <button
        onClick={dismiss}
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Icon + title */}
      <div className="flex items-center gap-2 pr-6">
        {step.icon}
        <h3 className="text-sm font-semibold text-foreground">{step.title}</h3>
      </div>

      {/* Content */}
      <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {step.content}
      </div>

      {/* Controls */}
      {step.showControls && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {currentStep + 1} of {totalSteps}
          </span>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={currentStep + 1 === totalSteps ? dismiss : nextStep}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {currentStep + 1 === totalSteps ? "Got it" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Arrow pointing at the target element */}
      {arrow}
    </div>
  );
}
