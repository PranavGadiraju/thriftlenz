import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { StoreProvider } from "@/context/store-context";
import { ToastProvider } from "@/context/toast-context";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ThriftLenz — Curated secondhand clothing",
    template: "%s · ThriftLenz",
  },
  description:
    "A small, carefully selected edit of secondhand clothing. Distinctive pieces chosen for condition, style, and wearability.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;1,6..72,300;1,6..72,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-pill focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-canvas"
            >
              Skip to content
            </a>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
