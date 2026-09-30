import type { ReactNode, Ref } from "react";
export function Notice({ children, tone = "info", ref, id }: { children: ReactNode; tone?: "info" | "error"; ref?: Ref<HTMLDivElement>; id?: string }) {
  return <div ref={ref} id={id} tabIndex={ref ? -1 : undefined} className={`notice notice--${tone}`} role={tone === "error" ? "alert" : "status"}>{children}</div>;
}
