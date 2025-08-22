"use client";

import { useCallback, useState, memo } from "react";
import { Editor } from "slate";
import { useSlate } from "slate-react";
import {
	Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
	Image as ImageIcon, Table, Undo2, Redo2, AlignLeft, AlignCenter,
	AlignRight, AlignJustify, Indent, Outdent, Strikethrough,
	Quote, Code, Minus, Palette, Search,
} from "lucide-react";
import {
	toggleMark, toggleBlock, isMarkActive, isBlockActive,
	setAlign, isAlignActive, increaseIndent, decreaseIndent,
	setTextColor, setBackgroundColor, insertDivider, insertTable,
} from "@/lib/document-utils";
import { TEXT_COLORS, BACKGROUND_COLORS } from "./toolbar-constants";

// Memoized icon button component
const IconButton = memo(({ 
	icon: Icon, 
	onClick, 
	active = false, 
	disabled = false, 
	title 
}: {
	icon: React.ElementType;
	onClick: () => void;
	active?: boolean;
	disabled?: boolean;
	title: string;
}) => (
	<button
		onMouseDown={(e) => {
			e.preventDefault();
			onClick();
		}}
		disabled={disabled}
		title={title}
		className={`p-1.5 rounded transition-colors ${
			active
				? "bg-blue-100 text-blue-700"
				: "hover:bg-gray-100 text-gray-700"
		} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
	>
		<Icon className="h-4 w-4" />
	</button>
));

IconButton.displayName = "IconButton";

// Memoized color picker component
const ColorPicker = memo(({ 
	colors, 
	onSelect, 
	title 
}: { 
	colors: string[]; 
	onSelect: (color: string) => void; 
	title: string;
}) => {
	const [open, setOpen] = useState(false);

	return (
		<div className="relative">
			<button
				onMouseDown={(e) => {
					e.preventDefault();
					setOpen(!open);
				}}
				title={title}
				className="p-1.5 rounded hover:bg-gray-100 text-gray-700 transition-colors"
			>
				<Palette className="h-4 w-4" />
			</button>
			{open && (
				<div className="absolute top-8 left-0 bg-white border rounded-lg shadow-lg p-2 z-50 grid grid-cols-10 gap-1 w-64">
					{colors.map((color) => (
						<button
							key={color}
							onMouseDown={(e) => {
								e.preventDefault();
								onSelect(color);
								setOpen(false);
							}}
							style={{ backgroundColor: color }}
							className="w-5 h-5 rounded border border-gray-300 hover:scale-110 transition-transform"
							title={color}
						/>
					))}
				</div>
			)}
		</div>
	);
});

ColorPicker.displayName = "ColorPicker";

// Main Toolbar component
export default function Toolbar() {
	const editor = useSlate();
	const [findReplaceOpen, setFindReplaceOpen] = useState(false);

	// Memoized handlers
	const handleUndo = useCallback(() => editor.undo(), [editor]);
	const handleRedo = useCallback(() => editor.redo(), [editor]);
	
	const toggleMarkHandler = useCallback((format: string) => {
		toggleMark(editor, format);
	}, [editor]);
	
	const toggleBlockHandler = useCallback((format: string) => {
		toggleBlock(editor, format);
	}, [editor]);
	
	const setAlignHandler = useCallback((alignment: string) => {
		setAlign(editor, alignment);
	}, [editor]);

	const insertLinkHandler = useCallback(() => {
		const url = prompt("Enter URL:");
		if (url && Editor.selection) {
			Editor.addMark(editor, "link", url);
		}
	}, [editor]);

	const insertImageHandler = useCallback(() => {
		const url = prompt("Enter image URL:");
		if (url) {
			editor.insertNode({
				type: "image",
				url,
				children: [{ text: "" }],
			});
		}
	}, [editor]);

	return (
		<div className="border-b bg-white sticky top-0 z-10">
			<div className="flex flex-wrap items-center gap-1 p-2">
				{/* History controls */}
				<div className="flex items-center gap-0.5 pr-2 border-r">
					<IconButton icon={Undo2} onClick={handleUndo} title="Undo (Ctrl+Z)" />
					<IconButton icon={Redo2} onClick={handleRedo} title="Redo (Ctrl+Y)" />
				</div>

				{/* Text formatting */}
				<div className="flex items-center gap-0.5 pr-2 border-r">
					<IconButton
						icon={Bold}
						onClick={() => toggleMarkHandler("bold")}
						active={isMarkActive(editor, "bold")}
						title="Bold (Ctrl+B)"
					/>
					<IconButton
						icon={Italic}
						onClick={() => toggleMarkHandler("italic")}
						active={isMarkActive(editor, "italic")}
						title="Italic (Ctrl+I)"
					/>
					<IconButton
						icon={Underline}
						onClick={() => toggleMarkHandler("underline")}
						active={isMarkActive(editor, "underline")}
						title="Underline (Ctrl+U)"
					/>
					<IconButton
						icon={Strikethrough}
						onClick={() => toggleMarkHandler("strikethrough")}
						active={isMarkActive(editor, "strikethrough")}
						title="Strikethrough"
					/>
				</div>

				{/* Block formatting */}
				<div className="flex items-center gap-0.5 pr-2 border-r">
					<IconButton
						icon={List}
						onClick={() => toggleBlockHandler("list-item")}
						active={isBlockActive(editor, "list-item")}
						title="Bullet List"
					/>
					<IconButton
						icon={ListOrdered}
						onClick={() => toggleBlockHandler("numbered-list")}
						active={isBlockActive(editor, "numbered-list")}
						title="Numbered List"
					/>
					<IconButton
						icon={Quote}
						onClick={() => toggleBlockHandler("block-quote")}
						active={isBlockActive(editor, "block-quote")}
						title="Quote"
					/>
					<IconButton
						icon={Code}
						onClick={() => toggleBlockHandler("code-block")}
						active={isBlockActive(editor, "code-block")}
						title="Code Block"
					/>
				</div>

				{/* Alignment */}
				<div className="flex items-center gap-0.5 pr-2 border-r">
					<IconButton
						icon={AlignLeft}
						onClick={() => setAlignHandler("left")}
						active={isAlignActive(editor, "left")}
						title="Align Left"
					/>
					<IconButton
						icon={AlignCenter}
						onClick={() => setAlignHandler("center")}
						active={isAlignActive(editor, "center")}
						title="Align Center"
					/>
					<IconButton
						icon={AlignRight}
						onClick={() => setAlignHandler("right")}
						active={isAlignActive(editor, "right")}
						title="Align Right"
					/>
					<IconButton
						icon={AlignJustify}
						onClick={() => setAlignHandler("justify")}
						active={isAlignActive(editor, "justify")}
						title="Justify"
					/>
				</div>

				{/* Indent */}
				<div className="flex items-center gap-0.5 pr-2 border-r">
					<IconButton
						icon={Outdent}
						onClick={() => decreaseIndent(editor)}
						title="Decrease Indent"
					/>
					<IconButton
						icon={Indent}
						onClick={() => increaseIndent(editor)}
						title="Increase Indent"
					/>
				</div>

				{/* Colors */}
				<div className="flex items-center gap-0.5 pr-2 border-r">
					<ColorPicker
						colors={TEXT_COLORS}
						onSelect={(color) => setTextColor(editor, color)}
						title="Text Color"
					/>
					<ColorPicker
						colors={BACKGROUND_COLORS}
						onSelect={(color) => setBackgroundColor(editor, color)}
						title="Background Color"
					/>
				</div>

				{/* Insert elements */}
				<div className="flex items-center gap-0.5 pr-2 border-r">
					<IconButton
						icon={LinkIcon}
						onClick={insertLinkHandler}
						title="Insert Link"
					/>
					<IconButton
						icon={ImageIcon}
						onClick={insertImageHandler}
						title="Insert Image"
					/>
					<IconButton
						icon={Table}
						onClick={() => insertTable(editor)}
						title="Insert Table"
					/>
					<IconButton
						icon={Minus}
						onClick={() => insertDivider(editor)}
						title="Insert Divider"
					/>
				</div>

				{/* Tools */}
				<div className="flex items-center gap-0.5">
					<IconButton
						icon={Search}
						onClick={() => setFindReplaceOpen(true)}
						title="Find & Replace (Ctrl+F)"
					/>
				</div>
			</div>

			{/* Find & Replace Dialog */}
			{findReplaceOpen && (
				<div className="fixed inset-0 z-50">
					<div className="absolute inset-0 bg-black/20" onClick={() => setFindReplaceOpen(false)} />
					<div className="absolute top-20 right-4 bg-white rounded-lg shadow-xl border p-4 w-96">
						<h3 className="font-semibold mb-4">Find & Replace</h3>
						<p className="text-sm text-gray-600">Feature coming soon...</p>
						<button
							onClick={() => setFindReplaceOpen(false)}
							className="mt-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
