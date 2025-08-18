"use client";

export default function MessageBubble({ role, children }: { role: "user" | "assistant" | "error"; children: React.ReactNode }) {
	const cls = role === "user" ? "bg-blue-50 ml-8" : role === "assistant" ? "bg-gray-50 mr-8" : "bg-red-50";
	return <div className={`rounded-lg p-2 text-sm whitespace-pre-wrap ${cls}`}>{children}</div>;
}