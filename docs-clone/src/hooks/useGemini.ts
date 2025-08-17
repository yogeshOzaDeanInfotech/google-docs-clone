"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/gemini";
import { uid } from "@/lib/utils";
import { tryGenerateContent } from "@/lib/gemini";
import { serializeToPlainText } from "@/lib/document-utils";
import { useDocumentStore } from "./useDocument";

export function useGemini() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const doc = useDocumentStore();

	const ask = async (prompt: string) => {
		setError(null);
		const userMsg: ChatMessage = { id: uid("m"), role: "user", text: prompt, timestamp: Date.now() };
		setMessages((m) => [...m, userMsg]);
		setLoading(true);
		const context = serializeToPlainText(doc.value as any);
		const res = await tryGenerateContent({ prompt, documentContext: context });
		setLoading(false);
		if (!res.ok) {
			const errMsg: ChatMessage = { id: uid("m"), role: "error", text: res.error, timestamp: Date.now() };
			setMessages((m) => [...m, errMsg]);
			setError(res.error);
			return;
		}
		const aiMsg: ChatMessage = { id: uid("m"), role: "assistant", text: res.text, timestamp: Date.now() };
		setMessages((m) => [...m, aiMsg]);
	};

	return { messages, loading, error, ask };
}