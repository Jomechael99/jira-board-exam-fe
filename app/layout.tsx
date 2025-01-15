import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/app/layouts/navigation";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-300">
        <NavBar/>
        <div className="px-10">
            {children}
        </div>
      </body>
    </html>
  );
}
