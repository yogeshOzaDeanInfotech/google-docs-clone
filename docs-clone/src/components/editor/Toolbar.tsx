"use client";

import { Editor } from "slate";
import { useSlate } from "slate-react";
import {
	Bold,
	Italic,
	Underline,
	List,
	ListOrdered,
	Link as LinkIcon,
	Image as ImageIcon,
	Table,
	Undo2,
	Redo2,
	AlignLeft,
	AlignCenter,
	AlignRight,
	AlignJustify,
	Indent,
	Outdent,
	Strikethrough,
	Subscript,
	Superscript,
	Quote,
	Code,
	Minus,
	Palette,
	Type,
	RotateCcw,
	RotateCw,
	Search,
	FileText,
	BarChart3,
} from "lucide-react";
import {
	toggleMark,
	toggleBlock,
	isMarkActive,
	isBlockActive,
	setAlign,
	isAlignActive,
	increaseIndent,
	decreaseIndent,
	setTextColor,
	setBackgroundColor,
	insertDivider,
	insertTable,
	setLineSpacing,
} from "@/lib/document-utils";
import { useState } from "react";

// Color palette for text and background colors
const TEXT_COLORS = [
	"#000000",
	"#434343",
	"#666666",
	"#999999",
	"#b7b7b7",
	"#cccccc",
	"#d9d9d9",
	"#efefef",
	"#f3f3f3",
	"#ffffff",
	"#980000",
	"#ff0000",
	"#ff9900",
	"#ffff00",
	"#00ff00",
	"#00ffff",
	"#4a86e8",
	"#0000ff",
	"#9900ff",
	"#ff00ff",
	"#e6b8af",
	"#f4cccc",
	"#fce5cd",
	"#fff2cc",
	"#d9ead3",
	"#d0e0e3",
	"#c9daf8",
	"#cfe2f3",
	"#d9d2e9",
	"#ead1dc",
	"#dd7e6b",
	"#ea9999",
	"#f9cb9c",
	"#ffe599",
	"#b6d7a8",
	"#a2c4c9",
	"#a4c2f4",
	"#a4c2f4",
	"#b4a7d6",
	"#d5a6bd",
];

const BACKGROUND_COLORS = [
	"#ffffff",
	"#f8f9fa",
	"#e9ecef",
	"#dee2e6",
	"#ced4da",
	"#adb5bd",
	"#6c757d",
	"#495057",
	"#343a40",
	"#212529",
	"#fff5f5",
	"#ffe3e3",
	"#ffc9c9",
	"#ffa8a8",
	"#ff8787",
	"#ff6b6b",
	"#fa5252",
	"#f03e3e",
	"#e03131",
	"#c92a2a",
	"#fff9db",
	"#fff3bf",
	"#ffec99",
	"#ffe066",
	"#ffd43b",
	"#fcc419",
	"#f59f00",
	"#f08c00",
	"#e67700",
	"#d9480f",
];

// Line spacing options
const LINE_SPACING_OPTIONS = [
	{ value: 1, label: "1.0" },
	{ value: 1.15, label: "1.15" },
	{ value: 1.5, label: "1.5" },
	{ value: 2, label: "2.0" },
	{ value: 2.5, label: "2.5" },
	{ value: 3, label: "3.0" },
];

// Color picker component
function ColorPicker({
	colors,
	onSelect,
	isOpen,
	onToggle,
	label,
	icon,
}: {
	colors: string[];
	onSelect: (color: string) => void;
	isOpen: boolean;
	onToggle: () => void;
	label: string;
	icon: React.ReactNode;
}) {
	return (
		<div className="relative">
			<button
				onClick={onToggle}
				className="p-2 hover:bg-gray-100 rounded flex items-center gap-1"
				title={label}
			>
				{icon}
			</button>
			{isOpen && (
				<div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-50 w-48">
					<div className="grid grid-cols-10 gap-1">
						{colors.map(color => (
							<button
								key={color}
								onClick={() => {
									onSelect(color);
									onToggle();
								}}
								className="w-4 h-4 rounded border border-gray-300 hover:scale-110 transition-transform"
								style={{ backgroundColor: color }}
								title={color}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

// Toolbar button component
function ToolbarButton({
	onClick,
	icon,
	isActive = false,
	title,
}: {
	onClick: () => void;
	icon: React.ReactNode;
	isActive?: boolean;
	title: string;
}) {
	return (
		<button
			onMouseDown={e => {
				e.preventDefault();
				onClick();
			}}
			className={`p-2 rounded transition-colors ${
				isActive
					? "bg-blue-100 text-blue-600"
					: "hover:bg-gray-100 text-gray-700"
			}`}
			title={title}
		>
			{icon}
		</button>
	);
}

export default function Toolbar({
	onUndo,
	onRedo,
	onFindReplace,
}: {
	onUndo: () => void;
	onRedo: () => void;
	onFindReplace?: () => void;
}) {
	const editor = useSlate();
	const [textColorOpen, setTextColorOpen] = useState(false);
	const [bgColorOpen, setBgColorOpen] = useState(false);
	const [lineSpacingOpen, setLineSpacingOpen] = useState(false);

	// Get current formatting state
	const isBold = isMarkActive(editor, "bold");
	const isItalic = isMarkActive(editor, "italic");
	const isUnderline = isMarkActive(editor, "underline");
	const isStrikethrough = isMarkActive(editor, "strikethrough");
	const isSubscript = isMarkActive(editor, "subscript");
	const isSuperscript = isMarkActive(editor, "superscript");
	const isBulletList = isBlockActive(editor, "bulleted-list");
	const isNumberedList = isBlockActive(editor, "numbered-list");
	const isQuote = isBlockActive(editor, "quote");
	const isCode = isBlockActive(editor, "code");

	// Get current alignment
	const isLeftAlign = isAlignActive(editor, "left");
	const isCenterAlign = isAlignActive(editor, "center");
	const isRightAlign = isAlignActive(editor, "right");
	const isJustifyAlign = isAlignActive(editor, "justify");

	return (
		<div className="border-b bg-gray-50 flex items-center gap-1 px-2 py-1 text-gray-700 flex-wrap">
			{/* Font Controls */}
			<div className="flex items-center gap-1 border-r pr-2">
				<select className="text-sm px-2 py-1 rounded border bg-white min-w-[100px]">
					<option value="Arial">Arial</option>
					<option value="Times New Roman">Times New Roman</option>
					<option value="Noto Sans">Noto Sans</option>
					<option value="Georgia">Georgia</option>
					<option value="Verdana">Verdana</option>
					<option value="Courier New">Courier New</option>
				</select>
				<select className="text-sm px-1 py-1 rounded border bg-white min-w-[60px]">
					{[8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72].map(s => (
						<option key={s} value={s}>
							{s}
						</option>
					))}
				</select>
			</div>

			{/* Text Formatting */}
			<div className="flex items-center gap-1 border-r pr-2">
				<ToolbarButton
					onClick={() => toggleMark(editor as unknown as Editor, "bold")}
					icon={<Bold size={16} />}
					isActive={isBold}
					title="Bold (Ctrl+B)"
				/>
				<ToolbarButton
					onClick={() => toggleMark(editor as unknown as Editor, "italic")}
					icon={<Italic size={16} />}
					isActive={isItalic}
					title="Italic (Ctrl+I)"
				/>
				<ToolbarButton
					onClick={() => toggleMark(editor as unknown as Editor, "underline")}
					icon={<Underline size={16} />}
					isActive={isUnderline}
					title="Underline (Ctrl+U)"
				/>
				<ToolbarButton
					onClick={() =>
						toggleMark(editor as unknown as Editor, "strikethrough")
					}
					icon={<Strikethrough size={16} />}
					isActive={isStrikethrough}
					title="Strikethrough"
				/>
			</div>

			{/* Advanced Text Formatting */}
			<div className="flex items-center gap-1 border-r pr-2">
				<ToolbarButton
					onClick={() => toggleMark(editor as unknown as Editor, "subscript")}
					icon={<Subscript size={16} />}
					isActive={isSubscript}
					title="Subscript"
				/>
				<ToolbarButton
					onClick={() => toggleMark(editor as unknown as Editor, "superscript")}
					icon={<Superscript size={16} />}
					isActive={isSuperscript}
					title="Superscript"
				/>
			</div>

			{/* Colors */}
			<div className="flex items-center gap-1 border-r pr-2">
				<ColorPicker
					colors={TEXT_COLORS}
					onSelect={color => setTextColor(editor as unknown as Editor, color)}
					isOpen={textColorOpen}
					onToggle={() => setTextColorOpen(!textColorOpen)}
					label="Text Color"
					icon={<Type size={16} />}
				/>
				<ColorPicker
					colors={BACKGROUND_COLORS}
					onSelect={color =>
						setBackgroundColor(editor as unknown as Editor, color)
					}
					isOpen={bgColorOpen}
					onToggle={() => setBgColorOpen(!bgColorOpen)}
					label="Background Color"
					icon={<Palette size={16} />}
				/>
			</div>

			{/* Alignment */}
			<div className="flex items-center gap-1 border-r pr-2">
				<ToolbarButton
					onClick={() => setAlign(editor as unknown as Editor, "left")}
					icon={<AlignLeft size={16} />}
					isActive={isLeftAlign}
					title="Align Left"
				/>
				<ToolbarButton
					onClick={() => setAlign(editor as unknown as Editor, "center")}
					icon={<AlignCenter size={16} />}
					isActive={isCenterAlign}
					title="Align Center"
				/>
				<ToolbarButton
					onClick={() => setAlign(editor as unknown as Editor, "right")}
					icon={<AlignRight size={16} />}
					isActive={isRightAlign}
					title="Align Right"
				/>
				<ToolbarButton
					onClick={() => setAlign(editor as unknown as Editor, "justify")}
					icon={<AlignJustify size={16} />}
					isActive={isJustifyAlign}
					title="Justify"
				/>
			</div>

			{/* Indentation */}
			<div className="flex items-center gap-1 border-r pr-2">
				<ToolbarButton
					onClick={() => decreaseIndent(editor as unknown as Editor)}
					icon={<Outdent size={16} />}
					title="Decrease Indent"
				/>
				<ToolbarButton
					onClick={() => increaseIndent(editor as unknown as Editor)}
					icon={<Indent size={16} />}
					title="Increase Indent"
				/>
			</div>

			{/* Lists */}
			<div className="flex items-center gap-1 border-r pr-2">
				<ToolbarButton
					onClick={() =>
						toggleBlock(editor as unknown as Editor, "bulleted-list")
					}
					icon={<List size={16} />}
					isActive={isBulletList}
					title="Bullet List"
				/>
				<ToolbarButton
					onClick={() =>
						toggleBlock(editor as unknown as Editor, "numbered-list")
					}
					icon={<ListOrdered size={16} />}
					isActive={isNumberedList}
					title="Numbered List"
				/>
			</div>

			{/* Block Elements */}
			<div className="flex items-center gap-1 border-r pr-2">
				<ToolbarButton
					onClick={() => toggleBlock(editor as unknown as Editor, "quote")}
					icon={<Quote size={16} />}
					isActive={isQuote}
					title="Quote Block"
				/>
				<ToolbarButton
					onClick={() => toggleBlock(editor as unknown as Editor, "code")}
					icon={<Code size={16} />}
					isActive={isCode}
					title="Code Block"
				/>
				<ToolbarButton
					onClick={() => insertDivider(editor as unknown as Editor)}
					icon={<Minus size={16} />}
					title="Insert Divider"
				/>
			</div>

			{/* History */}
			<div className="flex items-center gap-1 border-r pr-2">
				<ToolbarButton
					onClick={onUndo}
					icon={<Undo2 size={16} />}
					title="Undo (Ctrl+Z)"
				/>
				<ToolbarButton
					onClick={onRedo}
					icon={<Redo2 size={16} />}
					title="Redo (Ctrl+Y)"
				/>
			</div>

			{/* Line Spacing */}
			<div className="flex items-center gap-1 border-r pr-2">
				<div className="relative">
					<button
						onClick={() => setLineSpacingOpen(!lineSpacingOpen)}
						className="p-2 hover:bg-gray-100 rounded flex items-center gap-1"
						title="Line Spacing"
					>
						<BarChart3 size={16} />
					</button>
					{lineSpacingOpen && (
						<div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-2 z-50 min-w-[80px]">
							{LINE_SPACING_OPTIONS.map(option => (
								<button
									key={option.value}
									onClick={() => {
										setLineSpacing(editor as unknown as Editor, option.value);
										setLineSpacingOpen(false);
									}}
									className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
								>
									{option.label}
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Right side tools */}
			<div className="ml-auto flex items-center gap-1">
				{onFindReplace && (
					<ToolbarButton
						onClick={onFindReplace}
						icon={<Search size={16} />}
						title="Find & Replace"
					/>
				)}
				<ToolbarButton
					onClick={() => {}} // TODO: Implement link dialog
					icon={<LinkIcon size={16} />}
					title="Insert Link"
				/>
				<ToolbarButton
					onClick={() => {}} // TODO: Implement image upload
					icon={<ImageIcon size={16} />}
					title="Insert Image"
				/>
				<ToolbarButton
					onClick={() => insertTable(editor as unknown as Editor)}
					icon={<Table size={16} />}
					title="Insert Table"
				/>
			</div>
		</div>
	);
}
