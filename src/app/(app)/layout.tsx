"use client";

import { OnbordaProvider, Onborda } from "onborda";
import { RequireAuth } from "@/components/auth-provider";
import { AppShell } from "@/components/layout/app-shell";
import { OnbordaCard } from "@/components/onborda-card";
import { tourSteps } from "@/lib/tour-steps";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <OnbordaProvider>
        <Onborda
          steps={tourSteps}
          shadowRgb="0,0,0"
          shadowOpacity="0.7"
          cardComponent={OnbordaCard}
        >
          <AppShell>{children}</AppShell>
        </Onborda>
      </OnbordaProvider>
    </RequireAuth>
  );
}
