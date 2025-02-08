import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
// import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AurthaFi",
  description: "One stop solution for all your financial needs",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-pt-10 scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Toaster richColors />

        {/* footer */}
        <footer className="bg-blue-50 py-4">
          <div className="container mx-auto px-4 text-center">
            <code> {"<Coded/>"} </code> by{" "}
            <a
              href="https://www.devanshu.live/x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline-offset-4 hover:underline">
              designdotdevanshu
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
