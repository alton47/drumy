import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Drumy 🥁",
  description: "Drum machine QWERTZ layout",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
