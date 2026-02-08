import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Drumy 🥁",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[radial-gradient(circle_at_top,_#1b2350,_var(--bg-dark))] text-white">
        {children}
      </body>
    </html>
  );
}
