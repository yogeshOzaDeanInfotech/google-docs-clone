"use client";

import { Editor } from "slate";
import { useSlate } from "slate-react";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, Table, Undo2, Redo2, Type } from "lucide-react";
import { toggleMark, toggleBlock } from "@/lib/document-utils";

export default function Toolbar({ onUndo, onRedo }: { onUndo: () => void; onRedo: () => void }) {
	const editor = useSlate();
	return (
		<div className="h-11 border-b bg-gray-50 flex items-center gap-1 px-2 text-gray-700">
			<select className="text-sm px-2 py-1 rounded border bg-white">
				<option value="Arial">Arial</option>
				<option value="Times New Roman">Times New Roman</option>
				<option value="Noto Sans">Noto Sans</option>
			</select>
			<select className="text-sm px-1 py-1 rounded border bg-white">
				{[8,9,10,11,12,14,16,18].map(s => (<option key={s} value={s}>{s}</option>))}
			</select>
			<button onMouseDown={e => { e.preventDefault(); toggleMark(editor as unknown as Editor, "bold"); }} className="p-2 hover:bg-gray-100 rounded"><Bold size={16}/></button>
			<button onMouseDown={e => { e.preventDefault(); toggleMark(editor as unknown as Editor, "italic"); }} className="p-2 hover:bg-gray-100 rounded"><Italic size={16}/></button>
			<button onMouseDown={e => { e.preventDefault(); toggleMark(editor as unknown as Editor, "underline"); }} className="p-2 hover:bg-gray-100 rounded"><Underline size={16}/></button>
			<div className="w-px h-6 bg-gray-200 mx-1" />
			<button onMouseDown={e => { e.preventDefault(); toggleBlock(editor as any, "bulleted-list"); }} className="p-2 hover:bg-gray-100 rounded"><List size={16}/></button>
			<button onMouseDown={e => { e.preventDefault(); toggleBlock(editor as any, "numbered-list"); }} className="p-2 hover:bg-gray-100 rounded"><ListOrdered size={16}/></button>
			<div className="w-px h-6 bg-gray-200 mx-1" />
			<button onMouseDown={e => { e.preventDefault(); onUndo(); }} className="p-2 hover:bg-gray-100 rounded"><Undo2 size={16}/></button>
			<button onMouseDown={e => { e.preventDefault(); onRedo(); }} className="p-2 hover:bg-gray-100 rounded"><Redo2 size={16}/></button>
			<div className="ml-auto flex items-center gap-1">
				<button className="p-2 hover:bg-gray-100 rounded"><LinkIcon size={16}/></button>
				<button className="p-2 hover:bg-gray-100 rounded"><ImageIcon size={16}/></button>
				<button className="p-2 hover:bg-gray-100 rounded"><Table size={16}/></button>
			</div>
		</div>
	);
}