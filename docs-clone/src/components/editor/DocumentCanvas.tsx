"use client";

import { Slate, Editable, withReact } from "slate-react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import { useMemo, useRef, useState, useEffect } from "react";
import { useDocumentStore } from "@/hooks/useDocument";
import Toolbar from "./Toolbar";

// A4 dimensions in pixels (at 96 DPI)
const A4_WIDTH = 794; // 8.27 inches * 96 DPI
const A4_HEIGHT = 1123; // 11.69 inches * 96 DPI
const PAGE_PADDING = 72; // 0.75 inches * 96 DPI

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
	const [slateKey, setSlateKey] = useState(0);
	const pageRef = useRef<HTMLDivElement>(null);

	// Force re-render when value changes
	useEffect(() => {
		setSlateKey(prev => prev + 1);
	}, [value]);

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
				key={slateKey}
				editor={editor}
				initialValue={value as Descendant[]}
				onValueChange={(v) => {
					setValue(v as Descendant[]);
				}}
			>
				<Toolbar onUndo={() => editor.undo()} onRedo={() => editor.redo()} />
				<div className="flex-1 overflow-auto bg-[#f8f9fa] py-6">
					<div className="mx-auto">
						{/* A4 Page Container with Visual Page Breaks */}
						<div 
							className="bg-white shadow-sm border print:border-0 mx-auto relative"
							style={{
								width: A4_WIDTH,
								minHeight: A4_HEIGHT,
								padding: PAGE_PADDING,
								// Create visual page breaks using CSS
								backgroundImage: `
									repeating-linear-gradient(
										to bottom,
										transparent,
										transparent ${A4_HEIGHT - 2}px,
										#d1d5db ${A4_HEIGHT - 2}px,
										#d1d5db ${A4_HEIGHT}px
									)
								`,
								backgroundSize: `${A4_WIDTH}px ${A4_HEIGHT}px`,
								backgroundRepeat: 'repeat-y'
							}}
							ref={pageRef}
							id="doc-page"
						>
							{/* Page content */}
							<div className="relative z-10">
								<Editable
									renderElement={renderElement}
									renderLeaf={renderLeaf}
									spellCheck
									autoFocus
									className="outline-none text-[11pt] font-[Arial]"
									style={{
										// Ensure content flows naturally across pages
										minHeight: '100%',
										// Add page break styles for better visual separation
										pageBreakAfter: 'auto',
										pageBreakInside: 'auto',
										// Add some spacing between elements for better readability
										lineHeight: '1.6'
									}}
								/>
							</div>
							
							{/* Page number indicators (optional) */}
							<div 
								className="absolute bottom-4 right-4 text-xs text-gray-400 pointer-events-none"
								style={{
									backgroundImage: `
										repeating-linear-gradient(
											to bottom,
											transparent,
											transparent ${A4_HEIGHT - 40}px,
											rgba(156, 163, 175, 0.1) ${A4_HEIGHT - 40}px,
											rgba(156, 163, 175, 0.1) ${A4_HEIGHT}px
										)
									`,
									backgroundSize: `${A4_WIDTH}px ${A4_HEIGHT}px`,
									backgroundRepeat: 'repeat-y'
								}}
							/>
						</div>
					</div>
				</div>
			</Slate>
		</div>
	);
}