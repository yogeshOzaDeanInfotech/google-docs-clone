"use client";

import { useState, useRef, useEffect } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Send,
	Copy,
	FilePlus,
	Wand2,
	Settings,
} from "lucide-react";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useDocumentStore } from "@/hooks/useDocument";

export default function OpenAIPanel() {
	const [open, setOpen] = useState(true);
	const [autoEdit, setAutoEdit] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const { messages, loading, ask, autoEditDocument } = useOpenAI();
	const [input, setInput] = useState("");
	const areaRef = useRef<HTMLDivElement>(null);
	const doc = useDocumentStore();

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		if (areaRef.current) {
			areaRef.current.scrollTop = areaRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim()) return;

		if (autoEdit) {
			// Auto-edit mode: AI will directly edit the document
			await autoEditDocument(input.trim());
		} else {
			// Manual mode: AI provides suggestions
			await ask(input.trim());
		}

		setInput("");
	};

	const handleInsert = (text: string) => {
		const current = doc.value as any[];

		// Split text by line breaks and create paragraphs
		const lines = text.split("\n").filter(line => line.trim() !== "");

		const newParagraphs = lines.map(line => ({
			type: "paragraph",
			children: [{ text: line.trim() }],
		}));

		const updatedValue = [...current, ...newParagraphs];

		// Set the new value
		doc.setValue(updatedValue);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div
			className={`border-l bg-white w-[360px] flex flex-col transition-all ${open ? "" : "-mr-[320px]"}`}
		>
			<div className="h-12 border-b flex items-center justify-between px-3">
				<div className="font-medium flex items-center gap-2">
					<Wand2 size={16} />
					AI Assistant
				</div>
				<div className="flex items-center gap-1">
					<button
						onClick={() => setShowSettings(!showSettings)}
						className={`p-1 rounded hover:bg-gray-100 ${showSettings ? "bg-gray-100" : ""}`}
						title="Settings"
					>
						<Settings size={14} />
					</button>
					<button
						onClick={() => setOpen(o => !o)}
						className="p-1 rounded hover:bg-gray-100"
					>
						{open ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
					</button>
				</div>
			</div>

			{/* Settings Panel */}
			{showSettings && (
				<div className="border-b p-3 bg-gray-50">
					<div className="flex items-center justify-between">
						<div className="text-sm font-medium">Auto-Edit Mode</div>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={autoEdit}
								onChange={e => setAutoEdit(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
						</label>
					</div>
					<div className="text-xs text-gray-600 mt-1">
						{autoEdit
							? "AI will automatically edit your document based on prompts"
							: "AI will provide suggestions that you can manually insert"}
					</div>
				</div>
			)}

			{/* Messages Area */}
			<div ref={areaRef} className="flex-1 overflow-auto p-3 space-y-3">
				{/* Mode indicator */}
				{autoEdit && (
					<div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
						<Wand2 className="inline mr-1" size={12} />
						Auto-Edit Mode: AI will directly modify your document
					</div>
				)}

				{messages.map(m => (
					<div
						key={m.id}
						className={`rounded-lg p-2 text-sm ${
							m.role === "user"
								? "bg-blue-50 ml-8"
								: m.role === "assistant"
									? "bg-gray-50 mr-8"
									: m.role === "system"
										? "bg-green-50 border border-green-200"
										: "bg-red-50"
						}`}
					>
						<div className="whitespace-pre-wrap">{m.text}</div>
						{m.role === "assistant" && !autoEdit && (
							<div className="flex gap-2 mt-2">
								<button
									className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
									onClick={() => navigator.clipboard.writeText(m.text)}
									title="Copy to clipboard"
								>
									<Copy className="inline mr-1" size={12} /> Copy
								</button>
								<button
									className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
									onClick={() => handleInsert(m.text)}
									title="Insert into document"
								>
									<FilePlus className="inline mr-1" size={12} /> Insert
								</button>
							</div>
						)}
					</div>
				))}
				{loading && (
					<div className="text-xs text-gray-500 flex items-center gap-2">
						<div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
						{autoEdit ? "AI is editing your document..." : "AI is typing..."}
					</div>
				)}
			</div>

			{/* Input Area */}
			<div className="p-2 border-t">
				<div className="flex items-center gap-2">
					<textarea
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyDown={handleKeyPress}
						rows={2}
						className="flex-1 resize-none border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
						placeholder={
							autoEdit
								? "Describe what you want AI to edit in your document..."
								: "Enter a prompt here"
						}
						disabled={loading}
					/>
					<button
						onClick={handleSend}
						disabled={loading || !input.trim()}
						className={`h-9 px-3 rounded flex items-center gap-1 transition-colors ${
							loading || !input.trim()
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: "bg-blue-600 text-white hover:bg-blue-700"
						}`}
					>
						<Send size={16} /> Send
					</button>
				</div>
				{autoEdit && (
					<div className="text-xs text-gray-500 mt-1 px-1">
						💡 Try: "Make this more professional", "Add bullet points", "Fix
						grammar", etc.
					</div>
				)}
			</div>
		</div>
	);
}
