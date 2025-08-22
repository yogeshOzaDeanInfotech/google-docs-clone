import { Editor, Element as SlateElement, Transforms, Text, Node } from "slate";

export type BlockType =
	| "paragraph"
	| "heading"
	| "bulleted-list"
	| "numbered-list"
	| "list-item"
	| "quote"
	| "code"
	| "ruler"
	| "divider";
export type TextAlign = "left" | "center" | "right" | "justify";

export const isMarkActive = (editor: Editor, mark: string) => {
	const marks = Editor.marks(editor);
	// @ts-ignore
	return marks ? marks[mark] === true : false;
};

export const toggleMark = (editor: Editor, mark: string) => {
	const isActive = isMarkActive(editor, mark);
	if (isActive) Editor.removeMark(editor, mark);
	else Editor.addMark(editor, mark, true);
};

export const setMark = (editor: Editor, mark: string, value: any) => {
	Editor.addMark(editor, mark, value);
};

export const isBlockActive = (editor: Editor, format: BlockType) => {
	const [match] = Editor.nodes(editor, {
		match: n =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			(n as any).type === format,
	});
	return !!match;
};

export const toggleBlock = (editor: Editor, format: BlockType) => {
	const isActive = isBlockActive(editor, format);
	const isList = format === "bulleted-list" || format === "numbered-list";
	Transforms.unwrapNodes(editor, {
		match: n =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			["bulleted-list", "numbered-list"].includes((n as any).type),
		split: true,
	});
	const newType = isActive ? "paragraph" : isList ? "list-item" : format;
	Transforms.setNodes(editor, { type: newType } as any);
	if (!isActive && isList) {
		const block = { type: format, children: [] } as any;
		Transforms.wrapNodes(editor, block);
	}
};

// Text alignment utilities
export const isAlignActive = (editor: Editor, align: TextAlign) => {
	const [match] = Editor.nodes(editor, {
		match: n =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			(n as any).align === align,
	});
	return !!match;
};

export const setAlign = (editor: Editor, align: TextAlign) => {
	Transforms.setNodes(editor, { align } as any);
};

// Indentation utilities
export const getIndentLevel = (editor: Editor) => {
	const [match] = Editor.nodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n),
	});
	return match ? (match[0] as any).indent || 0 : 0;
};

export const setIndent = (editor: Editor, indent: number) => {
	Transforms.setNodes(editor, { indent } as any);
};

export const increaseIndent = (editor: Editor) => {
	const currentIndent = getIndentLevel(editor);
	setIndent(editor, Math.min(currentIndent + 1, 4)); // Max 4 levels
};

export const decreaseIndent = (editor: Editor) => {
	const currentIndent = getIndentLevel(editor);
	setIndent(editor, Math.max(currentIndent - 1, 0)); // Min 0 levels
};

// Color utilities
export const setTextColor = (editor: Editor, color: string) => {
	Editor.addMark(editor, "color", color);
};

export const setBackgroundColor = (editor: Editor, color: string) => {
	Editor.addMark(editor, "backgroundColor", color);
};

// Line spacing utilities
export const setLineSpacing = (editor: Editor, spacing: number) => {
	Transforms.setNodes(editor, { lineSpacing: spacing } as any);
};

// Insert utilities
export const insertDivider = (editor: Editor) => {
	Transforms.insertNodes(editor, {
		type: "divider",
		children: [{ text: "" }],
	} as any);
};

export const insertTable = (
	editor: Editor,
	rows: number = 3,
	cols: number = 3
) => {
	const table = {
		type: "table",
		children: Array.from({ length: rows }, () => ({
			type: "table-row",
			children: Array.from({ length: cols }, () => ({
				type: "table-cell",
				children: [{ text: "" }],
			})),
		})),
	} as any;
	Transforms.insertNodes(editor, table);
};

export const serializeToPlainText = (nodes: Node[]): string => {
	return nodes.map(n => Node.string(n)).join("\n");
};

export const serializeToHTML = (nodes: Node[]): string => {
	const serializeNode = (node: any): string => {
		if (Text.isText(node)) {
			let text = node.text
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/\n/g, "<br/>");

			// Apply text formatting
			if ((node as any).bold) text = `<strong>${text}</strong>`;
			if ((node as any).italic) text = `<em>${text}</em>`;
			if ((node as any).underline) text = `<u>${text}</u>`;
			if ((node as any).strikethrough) text = `<del>${text}</del>`;
			if ((node as any).subscript) text = `<sub>${text}</sub>`;
			if ((node as any).superscript) text = `<sup>${text}</sup>`;
			if ((node as any).color)
				text = `<span style="color: ${(node as any).color}">${text}</span>`;
			if ((node as any).backgroundColor)
				text = `<span style="background-color: ${(node as any).backgroundColor}">${text}</span>`;

			return text;
		}

		const style: any = {};
		if (node.align) style.textAlign = node.align;
		if (node.indent) style.marginLeft = `${node.indent * 20}px`;
		if (node.lineSpacing) style.lineHeight = node.lineSpacing;

		const styleAttr =
			Object.keys(style).length > 0
				? ` style="${Object.entries(style)
						.map(([k, v]) => `${k}: ${v}`)
						.join("; ")}"`
				: "";

		switch (node.type) {
			case "heading":
				return `<h2${styleAttr}>${node.children.map(serializeNode).join("")}</h2>`;
			case "bulleted-list":
				return `<ul${styleAttr}>${node.children.map(serializeNode).join("")}</ul>`;
			case "numbered-list":
				return `<ol${styleAttr}>${node.children.map(serializeNode).join("")}</ol>`;
			case "list-item":
				return `<li${styleAttr}>${node.children.map(serializeNode).join("")}</li>`;
			case "quote":
				return `<blockquote${styleAttr}>${node.children.map(serializeNode).join("")}</blockquote>`;
			case "code":
				return `<pre><code${styleAttr}>${node.children.map(serializeNode).join("")}</code></pre>`;
			case "divider":
				return `<hr${styleAttr} />`;
			case "table":
				return `<table${styleAttr}>${node.children.map(serializeNode).join("")}</table>`;
			case "table-row":
				return `<tr${styleAttr}>${node.children.map(serializeNode).join("")}</tr>`;
			case "table-cell":
				return `<td${styleAttr}>${node.children.map(serializeNode).join("")}</td>`;
			default:
				return `<p${styleAttr}>${node.children.map(serializeNode).join("")}</p>`;
		}
	};
	return nodes.map(serializeNode).join("");
};
