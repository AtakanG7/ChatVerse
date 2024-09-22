import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atakan Gül - Real-time Chat App to Chat, Collaborate, and Find Friends",
  description: "A real-time chat application built by Atakan Gül using Next.js and WebSocket. Chat, collaborate, and find friends in an intuitive and responsive environment.",
  keywords: "Atakan Gül, chatting, chat, real-time chat, find friends, collaborate, Next.js, WebSocket, real-time communication",
  openGraph: {
    title: "Atakan Gül - Chat, Collaborate, and Find Friends in Real-time",
    description: "Engage in real-time conversations with Atakan Gül's modern chat application. Connect, collaborate, and find friends using Next.js and WebSocket.",
    url: "https://yourwebsite.com", // Replace with your app URL
    type: "website",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg", // Replace with your OG image URL
        width: 800,
        height: 600,
        alt: "Chat App by Atakan Gül",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://yourwebsite.com" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
