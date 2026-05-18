"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode, useEffect } from "react";
import { LanguageProvider } from "@/contexts/language-context";
import { DataProvider } from "@/contexts/data-context";

interface ProvidersProps {
  children: ReactNode;
}

function PreviewListener() {
  useEffect(() => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'PREVIEW_READY' }, '*');
    }

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'HIGHLIGHT') {
        document.querySelectorAll('.edit-highlight').forEach(el => {
          el.classList.remove('edit-highlight');
          (el as HTMLElement).style.outline = '';
          (el as HTMLElement).style.backgroundColor = '';
          (el as HTMLElement).style.transition = '';
          (el as HTMLElement).style.boxShadow = '';
          (el as HTMLElement).style.borderRadius = '';
        });
        
        const path = e.data.path;
        if (path) {
          const el = document.querySelector(`[data-edit-id="${path}"]`);
          if (el) {
            el.classList.add('edit-highlight');
            (el as HTMLElement).style.outline = '4px solid #facc15';
            (el as HTMLElement).style.backgroundColor = 'rgba(250, 204, 21, 0.4)';
            (el as HTMLElement).style.transition = 'all 0.4s ease-out';
            (el as HTMLElement).style.boxShadow = '0 0 20px rgba(250, 204, 21, 0.6)';
            (el as HTMLElement).style.borderRadius = '4px';
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  return null;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="cleo-ameylia-theme"
    >
      <DataProvider>
        <LanguageProvider>
          <PreviewListener />
          {children}
        </LanguageProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
