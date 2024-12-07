import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: 'Track your daily habits with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body>
          {children}
        </body>
    </html>
  );
}
