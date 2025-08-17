"use client";

import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { useMemo, useRef, useState } from "react";
import { useDocumentStore } from "@/hooks/useDocument";
import Toolbar from "./Toolbar";

function Ruler() {
	const marks = Array.from({ length: 30 }, (_, i) => i);
	return (
		<div className="h-6 bg-gray-100 border-b flex text-[10px] text-gray-500 select-none">
			{marks.map((m) => (
				<div key={m} className="flex-1 relative flex items-end">
					<div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-3 bg-gray-300" />
					<span className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-3">{m}</span>
				</div>
			))}
		</div>
	);
}

export default function DocumentCanvas() {
	const { value, setValue } = useDocumentStore();
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);
	const [_, setRefresh] = useState(0);
	const pageRef = useRef<HTMLDivElement>(null);

	const renderElement = (props: any) => {
		switch (props.element.type) {
			case "heading":
				return <h2 {...props.attributes} className="text-xl font-semibold my-2">{props.children}</h2>;
			case "bulleted-list":
				return <ul {...props.attributes} className="list-disc pl-6 my-2">{props.children}</ul>;
			case "numbered-list":
				return <ol {...props.attributes} className="list-decimal pl-6 my-2">{props.children}</ol>;
			case "list-item":
				return <li {...props.attributes}>{props.children}</li>;
			default:
				return <p {...props.attributes} className="my-1 leading-7">{props.children}</p>;
		}
	};

	const renderLeaf = (props: any) => {
		return (
			<span
				{...props.attributes}
				style={{}}
				className={`${props.leaf.bold ? "font-bold" : ""} ${props.leaf.italic ? "italic" : ""} ${props.leaf.underline ? "underline" : ""}`}
			>
				{props.children}
			</span>
		);
	};

	return (
		<div className="flex flex-col min-h-0 flex-1">
			<Ruler />
			<Slate
				editor={editor}
				initialValue={value as Descendant[]}
				onChange={(v) => setValue(v as Descendant[])}
			>
				<Toolbar onUndo={() => editor.undo()} onRedo={() => editor.redo()} />
				<div className="flex-1 overflow-auto bg-[#f8f9fa] py-6">
					<div className="bg-white mx-auto shadow-sm border print:border-0 w-[794px] min-h-[1123px] p-[72px]" ref={pageRef} id="doc-page">
						<Editable
							renderElement={renderElement}
							renderLeaf={renderLeaf}
							spellCheck
							autoFocus
							className="outline-none text-[11pt] font-[Arial]"
						/>
					</div>
				</div>
			</Slate>
		</div>
	);
}