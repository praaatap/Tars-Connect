import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pulse Connect",
  description: "Pulse Connect helps your team communicate and collaborate in real time.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Pulse Connect",
    description: "Connect instantly. Collaborate effortlessly.",
    type: "website",
  },
};

export default function RootLayout({
  appbar,
  children,
}: Readonly<{
  appbar: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900 h-screen flex flex-col overflow-hidden`}
      >
        <ConvexClientProvider>
          {appbar}
          <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}

