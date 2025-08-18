"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Send, Copy, FilePlus } from "lucide-react";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useDocumentStore } from "@/hooks/useDocument";

export default function OpenAIPanel() {
	const [open, setOpen] = useState(true);
	const { messages, loading, ask } = useOpenAI();
	const [input, setInput] = useState("");
	const areaRef = useRef<HTMLDivElement>(null);
	const doc = useDocumentStore();

	const handleSend = async () => {
		if (!input.trim()) return;
		await ask(input.trim());
		setInput("");
	};

	const handleInsert = (text: string) => {
		const current = doc.value as any[];
		
		// Split text by line breaks and create paragraphs
		const lines = text.split('\n').filter(line => line.trim() !== '');
		
		const newParagraphs = lines.map(line => ({
			type: "paragraph",
			children: [{ text: line.trim() }]
		}));
		
		const updatedValue = [...current, ...newParagraphs];
		
		// Set the new value
		doc.setValue(updatedValue);
	};

	return (
		<div className={`border-l bg-white w-[360px] flex flex-col transition-all ${open ? "" : "-mr-[320px]"}`}>
			<div className="h-12 border-b flex items-center justify-between px-3">
				<div className="font-medium">OpenAI</div>
				<button onClick={() => setOpen(o => !o)} className="p-1 rounded hover:bg-gray-100">
					{open ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
				</button>
			</div>
			<div ref={areaRef} className="flex-1 overflow-auto p-3 space-y-3">
				{messages.map(m => (
					<div key={m.id} className={`rounded-lg p-2 text-sm ${m.role === "user" ? "bg-blue-50 ml-8" : m.role === "assistant" ? "bg-gray-50 mr-8" : "bg-red-50"}`}>
						<div className="whitespace-pre-wrap">{m.text}</div>
						{m.role === "assistant" && (
							<div className="flex gap-2 mt-2">
								<button className="text-xs px-2 py-1 rounded bg-gray-200" onClick={() => navigator.clipboard.writeText(m.text)}>
									<Copy className="inline mr-1" size={12}/> Copy
								</button>
								<button className="text-xs px-2 py-1 rounded bg-blue-600 text-white" onClick={() => handleInsert(m.text)}>
									<FilePlus className="inline mr-1" size={12}/> Insert
								</button>
							</div>
						)}
					</div>
				))}
				{loading && <div className="text-xs text-gray-500">OpenAI is typing…</div>}
			</div>
			<div className="p-2 border-t flex items-center gap-2">
				<textarea value={input} onChange={(e) => setInput(e.target.value)} rows={2} className="flex-1 resize-none border rounded p-2 text-sm" placeholder="Enter a prompt here"/>
				<button onClick={handleSend} className="h-9 px-3 rounded bg-blue-600 text-white flex items-center gap-1"><Send size={16}/> Send</button>
			</div>
		</div>
	);
}
