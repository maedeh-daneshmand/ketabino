import type { Metadata } from "next";
import "@fontsource/vazirmatn/400.css";
import "@fontsource/vazirmatn/500.css";
import "@fontsource/vazirmatn/600.css";
import "@fontsource/vazirmatn/700.css";
import "./globals.css";
import { StoreProvider } from "@/components/store-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = { title: { default: "کتابینو | دنیای کتاب‌های تو", template: "%s | کتابینو" }, description: "کتاب‌های تازه را کشف کن، به کتابخانه‌ات اضافه کن و از خواندن لذت ببر." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body><StoreProvider><SiteHeader /><main>{children}</main><SiteFooter /></StoreProvider></body></html>;
}
