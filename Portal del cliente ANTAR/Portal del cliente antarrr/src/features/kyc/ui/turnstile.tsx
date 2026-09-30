"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};
declare global { interface Window { turnstile?: TurnstileApi } }

type Props = { siteKey: string; nonce?: string; onToken: (token: string) => void };

/** Verificación antibots de Cloudflare Turnstile. El token se valida de nuevo en el servidor. */
export function Turnstile({ siteKey, nonce, onToken }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  const [ready, setReady] = useState(false);

  useEffect(() => { callback.current = onToken; }, [onToken]);

  useEffect(() => {
    const element = container.current;
    if (!ready || !element || !window.turnstile) return;
    const widget = window.turnstile.render(element, {
      sitekey: siteKey,
      language: "es",
      callback: (token: string) => callback.current(token),
      "expired-callback": () => callback.current(""),
      "error-callback": () => callback.current(""),
    });
    return () => { window.turnstile?.remove(widget); };
  }, [ready, siteKey]);

  return <>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" nonce={nonce} onReady={() => setReady(true)} />
    <div className="captcha" ref={container} id="f-captcha" tabIndex={-1} />
  </>;
}
