import type { Metadata } from "next";
import { geistMono, geistSans } from "./fonts";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: "AurthaFi",
  description: "One stop solution for all your financial needs",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="scroll-pt-10 scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Toaster position="bottom-right" expand={false} richColors={true} />

        {/* footer */}
        <footer className="bg-blue-50 py-4">
          <div className="container mx-auto px-4 text-center">
            <code> {"<Coded/>"} </code> by{" "}
            <a
              href="https://itsdevanshu.vercel.app/x"
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
