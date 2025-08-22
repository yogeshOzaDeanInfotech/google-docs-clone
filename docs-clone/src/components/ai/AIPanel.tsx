"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Send, Copy, FilePlus, Wand2, Settings } from "lucide-react";
import { useAI } from "@/hooks/useAI";

export default function AIPanel() {
	const [open, setOpen] = useState(true);
	const [autoEdit, setAutoEdit] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [input, setInput] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	
	const { 
		messages, 
		loading, 
		sendMessage, 
		appendToDocument,
		documentStats 
	} = useAI();

	// Auto-scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = useCallback(async () => {
		if (!input.trim() || loading) return;
		
		await sendMessage(input.trim(), autoEdit);
		setInput("");
	}, [input, loading, sendMessage, autoEdit]);

	const handleCopy = useCallback((text: string) => {
		navigator.clipboard.writeText(text);
	}, []);

	const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}, [handleSend]);

	if (!open) {
		return (
			<button
				onClick={() => setOpen(true)}
				className="fixed right-0 top-1/2 -translate-y-1/2 bg-white border-l border-t border-b rounded-l-lg p-2 shadow-lg hover:bg-gray-50 transition-colors"
			>
				<ChevronLeft className="w-5 h-5" />
			</button>
		);
	}

	return (
		<div className="fixed right-0 top-0 h-full w-96 bg-white border-l shadow-xl flex flex-col">
			{/* Header */}
			<div className="border-b p-4 flex items-center justify-between bg-gray-50">
				<h2 className="font-semibold flex items-center gap-2">
					<Wand2 className="w-5 h-5 text-blue-600" />
					AI Assistant
				</h2>
				<div className="flex items-center gap-2">
					<button
						onClick={() => setShowSettings(!showSettings)}
						className="p-1.5 hover:bg-gray-200 rounded transition-colors"
						title="Settings"
					>
						<Settings className="w-4 h-4" />
					</button>
					<button
						onClick={() => setOpen(false)}
						className="p-1.5 hover:bg-gray-200 rounded transition-colors"
					>
						<ChevronRight className="w-4 h-4" />
					</button>
				</div>
			</div>

			{/* Settings Panel */}
			{showSettings && (
				<div className="border-b p-4 bg-gray-50">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="checkbox"
							checked={autoEdit}
							onChange={(e) => setAutoEdit(e.target.checked)}
							className="rounded"
						/>
						<span className="text-sm">Auto-edit mode</span>
					</label>
					<p className="text-xs text-gray-600 mt-1">
						{autoEdit 
							? "AI will include document context in responses" 
							: "AI provides general suggestions"}
					</p>
				</div>
			)}

			{/* Document Stats */}
			<div className="px-4 py-2 bg-gray-50 border-b text-xs text-gray-600">
				Document: {documentStats.words} words, {documentStats.characters} characters
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={`${
							msg.role === "user" 
								? "ml-auto bg-blue-600 text-white" 
								: msg.role === "error"
								? "bg-red-100 text-red-800"
								: "bg-gray-100"
						} rounded-lg p-3 max-w-[85%] relative group`}
					>
						<div className="text-sm whitespace-pre-wrap">{msg.text}</div>
						{msg.role === "assistant" && (
							<div className="absolute -bottom-8 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
								<button
									onClick={() => handleCopy(msg.text)}
									className="p-1 bg-white border rounded shadow-sm hover:bg-gray-50 text-gray-600"
									title="Copy"
								>
									<Copy className="w-3 h-3" />
								</button>
								<button
									onClick={() => appendToDocument(msg.text)}
									className="p-1 bg-white border rounded shadow-sm hover:bg-gray-50 text-gray-600"
									title="Append to document"
								>
									<FilePlus className="w-3 h-3" />
								</button>
							</div>
						)}
					</div>
				))}
				{loading && (
					<div className="bg-gray-100 rounded-lg p-3 max-w-[85%]">
						<div className="flex items-center gap-2">
							<div className="animate-pulse flex gap-1">
								<div className="w-2 h-2 bg-gray-400 rounded-full"></div>
								<div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
								<div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
							</div>
							<span className="text-sm text-gray-600">Thinking...</span>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="border-t p-4">
				<div className="flex gap-2">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={handleKeyPress}
						placeholder={autoEdit ? "Describe edits to make..." : "Ask a question..."}
						className="flex-1 border rounded-lg p-2 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
						disabled={loading}
					/>
					<button
						onClick={handleSend}
						disabled={!input.trim() || loading}
						className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						<Send className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
}