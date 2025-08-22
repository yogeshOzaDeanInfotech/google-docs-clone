"use client";

import { useState, useCallback, useMemo } from "react";
import type { ChatMessage } from "@/types/ai";
import { uid } from "@/lib/utils";
import { tryGenerateContent } from "@/lib/ai";
import { serializeToPlainText } from "@/lib/document-utils";
import { useDocumentStore } from "./useDocument";

// Helper function to parse AI response into Slate format
const parseAIResponseToSlate = (content: string): any[] => {
	const lines = content.split("\n").filter(line => line.trim());
	const result: any[] = [];
	
	let inTable = false;
	let tableRows: any[] = [];
	
	for (const line of lines) {
		const trimmedLine = line.trim();
		
		// Handle table rows
		if (trimmedLine.includes("|")) {
			if (!inTable) {
				inTable = true;
				tableRows = [];
			}
			
			const cells = trimmedLine.split("|")
				.map(cell => cell.trim())
				.filter(cell => cell);
				
			if (cells.length > 1) {
				tableRows.push({
					type: "table-row",
					children: cells.map(cell => ({
						type: "table-cell",
						children: [{ text: cell }],
					})),
				});
			}
		} else {
			// End table if we were in one
			if (inTable && tableRows.length > 0) {
				result.push({
					type: "table",
					children: tableRows,
				});
				inTable = false;
				tableRows = [];
			}
			
			// Parse non-table content
			if (trimmedLine.startsWith("#") || (trimmedLine === trimmedLine.toUpperCase() && trimmedLine.length > 3)) {
				result.push({
					type: "heading",
					children: [{ text: trimmedLine.replace(/^#+\s*/, "") }],
				});
			} else if (trimmedLine.match(/^[-•*]\s/)) {
				result.push({
					type: "list-item",
					children: [{ text: trimmedLine.replace(/^[-•*]\s*/, "") }],
				});
			} else if (trimmedLine.match(/^\d+\./)) {
				result.push({
					type: "list-item",
					children: [{ text: trimmedLine.replace(/^\d+\.\s*/, "") }],
				});
			} else if (trimmedLine) {
				result.push({
					type: "paragraph",
					children: [{ text: trimmedLine }],
				});
			}
		}
	}
	
	// Handle any remaining table
	if (inTable && tableRows.length > 0) {
		result.push({
			type: "table",
			children: tableRows,
		});
	}
	
	// Ensure we have at least one paragraph
	if (result.length === 0) {
		result.push({
			type: "paragraph",
			children: [{ text: "" }],
		});
	}
	
	return result;
};

export function useAI() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [loading, setLoading] = useState(false);
	const [showAI, setShowAI] = useState(false);
	const { editorContent, updateEditorContent } = useDocumentStore();

	const addMessage = useCallback((role: ChatMessage["role"], text: string) => {
		const message: ChatMessage = {
			id: uid(),
			role,
			text,
			timestamp: Date.now(),
		};
		setMessages(prev => [...prev, message]);
		return message;
	}, []);

	const sendMessage = useCallback(async (text: string, includeContext: boolean = false) => {
		if (!text.trim() || loading) return;

		setLoading(true);
		addMessage("user", text);

		try {
			const documentContext = includeContext 
				? serializeToPlainText(editorContent).trim()
				: undefined;

			const result = await tryGenerateContent({
				prompt: text,
				documentContext,
			});

			if (result.ok) {
				addMessage("assistant", result.text);
			} else {
				addMessage("error", result.error);
			}
		} catch (error) {
			addMessage("error", error instanceof Error ? error.message : "Failed to get response");
		} finally {
			setLoading(false);
		}
	}, [loading, editorContent, addMessage]);

	const appendToDocument = useCallback((text: string) => {
		const contentToAdd = parseAIResponseToSlate(text);
		updateEditorContent([...editorContent, ...contentToAdd]);
	}, [editorContent, updateEditorContent]);

	const replaceDocument = useCallback((text: string) => {
		const newContent = parseAIResponseToSlate(text);
		updateEditorContent(newContent);
	}, [updateEditorContent]);

	const clearMessages = useCallback(() => {
		setMessages([]);
	}, []);

	// Memoized values
	const hasMessages = useMemo(() => messages.length > 0, [messages]);
	
	const documentStats = useMemo(() => {
		const text = serializeToPlainText(editorContent);
		return {
			words: text.split(/\s+/).filter(word => word.length > 0).length,
			characters: text.length,
		};
	}, [editorContent]);

	return {
		messages,
		loading,
		showAI,
		setShowAI,
		sendMessage,
		appendToDocument,
		replaceDocument,
		clearMessages,
		hasMessages,
		documentStats,
	};
}