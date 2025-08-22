"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types/openai";
import { uid } from "@/lib/utils";
import { tryGenerateContent } from "@/lib/openai";
import { serializeToPlainText } from "@/lib/document-utils";
import { useDocumentStore } from "./useDocument";

// Helper function to parse AI response into Slate format
function parseAIResponseToSlate(content: string): any[] {
	const lines = content.split("\n").filter(line => line.trim() !== "");
	const result: any[] = [];

	let currentList: any[] = [];
	let inTable = false;
	let tableRows: any[] = [];

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim();

		// Check for table indicators
		if (
			line.includes("|") ||
			(line.includes("Book") &&
				line.includes("Author") &&
				line.includes("Price"))
		) {
			if (!inTable) {
				inTable = true;
				tableRows = [];
			}

			// Parse table row
			const cells = line
				.split("|")
				.map(cell => cell.trim())
				.filter(cell => cell !== "");
			if (cells.length > 1) {
				const tableRow = {
					type: "table-row",
					children: cells.map(cell => ({
						type: "table-cell",
						children: [{ text: cell }],
					})),
				};
				tableRows.push(tableRow);
			}
		} else {
			// End table if we were in one
			if (inTable && tableRows.length > 0) {
				const table = {
					type: "table",
					children: tableRows,
				};
				result.push(table);
				inTable = false;
				tableRows = [];
			}

			// Check for headings
			if (
				line.startsWith("#") ||
				(line.toUpperCase() === line && line.length > 3)
			) {
				result.push({
					type: "heading",
					children: [{ text: line.replace(/^#+\s*/, "") }],
				});
			}
			// Check for bullet points
			else if (
				line.startsWith("-") ||
				line.startsWith("•") ||
				line.startsWith("*")
			) {
				result.push({
					type: "list-item",
					children: [{ text: line.replace(/^[-•*]\s*/, "") }],
				});
			}
			// Check for numbered lists
			else if (/^\d+\./.test(line)) {
				result.push({
					type: "list-item",
					children: [{ text: line.replace(/^\d+\.\s*/, "") }],
				});
			}
			// Regular paragraph
			else if (line) {
				result.push({
					type: "paragraph",
					children: [{ text: line }],
				});
			}
		}
	}

	// Handle any remaining table
	if (inTable && tableRows.length > 0) {
		const table = {
			type: "table",
			children: tableRows,
		};
		result.push(table);
	}

	// Ensure we have at least one paragraph
	if (result.length === 0) {
		result.push({
			type: "paragraph",
			children: [{ text: "" }],
		});
	}

	return result;
}

export function useOpenAI() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const doc = useDocumentStore();

	const ask = async (prompt: string) => {
		setError(null);
		const userMsg: ChatMessage = {
			id: uid("m"),
			role: "user",
			text: prompt,
			timestamp: Date.now(),
		};
		setMessages(m => [...m, userMsg]);
		setLoading(true);
		const context = serializeToPlainText(doc.value as any);
		const res = await tryGenerateContent({ prompt, documentContext: context });
		setLoading(false);
		if (!res.ok) {
			const errMsg: ChatMessage = {
				id: uid("m"),
				role: "error",
				text: res.error,
				timestamp: Date.now(),
			};
			setMessages(m => [...m, errMsg]);
			setError(res.error);
			return;
		}
		const aiMsg: ChatMessage = {
			id: uid("m"),
			role: "assistant",
			text: res.text,
			timestamp: Date.now(),
		};
		setMessages(m => [...m, aiMsg]);
	};

	const autoEditDocument = async (prompt: string) => {
		setError(null);
		const userMsg: ChatMessage = {
			id: uid("m"),
			role: "user",
			text: prompt,
			timestamp: Date.now(),
		};
		setMessages(m => [...m, userMsg]);
		setLoading(true);

		try {
			const context = serializeToPlainText(doc.value as any);
			const currentValue = doc.value as any[];

			const isAddition = /add|insert|append|include|create|write/i.test(prompt);
			const isModification =
				/edit|modify|change|update|improve|fix|correct|rewrite|rephrase/i.test(
					prompt
				);
			const isReplacement = /replace|substitute|swap/i.test(prompt);
			const isFormatting = /format|style|structure|organize|arrange/i.test(
				prompt
			);

			let editPrompt = "";
			if (isAddition) {
				editPrompt = `You are an AI document editor. The user wants to ADD content to their document based on this request: "${prompt}"

Current document content:
${context}

Please provide ONLY the new content to be added. If the user requests a table, format it with | separators like this:
| Column1 | Column2 | Column3 |
| Data1 | Data2 | Data3 |`;
			} else if (isModification || isReplacement) {
				editPrompt = `You are an AI document editor. The user wants to MODIFY their document based on this request: "${prompt}"

Current document content:
${context}

Please provide the COMPLETE modified version of the document. Maintain the same structure but apply the requested changes. If tables are requested, format them with | separators.`;
			} else if (isFormatting) {
				editPrompt = `You are an AI document editor. The user wants to FORMAT their document based on this request: "${prompt}"

Current document content:
${context}

Please provide the COMPLETE reformatted version of the document. Apply the requested formatting while keeping all the original content.`;
			} else {
				editPrompt = `You are an AI document editor. The user wants you to edit their document based on this request: "${prompt}"

Current document content:
${context}

Please provide the edited version of the document. If tables are requested, format them with | separators. Return ONLY the edited content, maintaining the same structure and formatting.`;
			}

			const res = await tryGenerateContent({
				prompt: editPrompt,
				documentContext: context,
			});
			setLoading(false);

			if (!res.ok) {
				const errMsg: ChatMessage = {
					id: uid("m"),
					role: "error",
					text: res.error,
					timestamp: Date.now(),
				};
				setMessages(m => [...m, errMsg]);
				setError(res.error);
				return;
			}

			const editedContent = res.text.trim();
			const parsedContent = parseAIResponseToSlate(editedContent);
			const newValue = isAddition
				? [...currentValue, ...parsedContent]
				: parsedContent;
			doc.setValue(newValue);

			const action = isAddition
				? "added to"
				: isModification
					? "modified"
					: isReplacement
						? "replaced"
						: isFormatting
							? "reformatted"
							: "updated";
			const systemMsg: ChatMessage = {
				id: uid("m"),
				role: "system",
				text: `✅ Document ${action} based on your request: "${prompt}"`,
				timestamp: Date.now(),
			};
			setMessages(m => [...m, systemMsg]);
		} catch (error) {
			setLoading(false);

			// Fallback: simple text insertion based on AI response
			try {
				const context = serializeToPlainText(doc.value as any);
				const currentValue = doc.value as any[];
				const fallbackPrompt = `Please respond to this request: "${prompt}". If you need to create a table, use | separators.`;
				const res = await tryGenerateContent({
					prompt: fallbackPrompt,
					documentContext: context,
				});
				if (res.ok) {
					const lines = res.text.split("\n").filter(line => line.trim() !== "");
					const newParagraphs = lines.map(line => ({
						type: "paragraph",
						children: [{ text: line.trim() }],
					}));
					doc.setValue([...currentValue, ...newParagraphs]);
					const fallbackMsg: ChatMessage = {
						id: uid("m"),
						role: "system",
						text: `✅ Document updated (fallback method) based on your request: "${prompt}"`,
						timestamp: Date.now(),
					};
					setMessages(m => [...m, fallbackMsg]);
					return;
				}
			} catch {}

			const errMsg: ChatMessage = {
				id: uid("m"),
				role: "error",
				text: "Failed to edit document. Please try again.",
				timestamp: Date.now(),
			};
			setMessages(m => [...m, errMsg]);
			setError("Failed to edit document");
		}
	};

	return { messages, loading, error, ask, autoEditDocument };
}
