import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { CBESuperAppProvider } from "./context/CBESuperAppContext";
import { CartProvider } from "./context/CartContext";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Choice-Shop - Ethiopian Marketplace",
  description: "Discover authentic Ethiopian products - coffee, spices, crafts and more. Powered by Choice SuperApp.",
  keywords: ["Ethiopian", "marketplace", "coffee", "spices", "crafts", "Choice", "SuperApp"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d4f3c",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} ${dmSans.variable}`}>
        <CBESuperAppProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CBESuperAppProvider>
      </body>
    </html>
  );
}
