import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const notoDevanagari = Noto_Sans_Devanagari({
	variable: "--font-devanagari",
	subsets: ["devanagari"],
	weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
	title: "Docs Clone",
	description: "Google Docs-like editor with AI Assistant",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${notoDevanagari.variable} antialiased bg-[#f1f3f4]`}
			>
				{children}
			</body>
		</html>
	);
}
