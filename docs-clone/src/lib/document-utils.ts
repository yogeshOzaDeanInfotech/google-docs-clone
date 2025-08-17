import { Editor, Element as SlateElement, Transforms, Text, Node } from "slate";

export type BlockType = "paragraph" | "heading" | "bulleted-list" | "numbered-list" | "list-item" | "quote" | "code" | "ruler";

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

export const isBlockActive = (editor: Editor, format: BlockType) => {
	const [match] = Editor.nodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && (n as any).type === format,
	});
	return !!match;
};

export const toggleBlock = (editor: Editor, format: BlockType) => {
	const isActive = isBlockActive(editor, format);
	const isList = format === "bulleted-list" || format === "numbered-list";
	Transforms.unwrapNodes(editor, {
		match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && ["bulleted-list", "numbered-list"].includes((n as any).type),
		split: true,
	});
	const newType = isActive ? "paragraph" : isList ? "list-item" : format;
	Transforms.setNodes(editor, { type: newType } as any);
	if (!isActive && isList) {
		const block = { type: format, children: [] } as any;
		Transforms.wrapNodes(editor, block);
	}
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
			if (node.bold) text = `<strong>${text}</strong>`;
			if (node.italic) text = `<em>${text}</em>`;
			if (node.underline) text = `<u>${text}</u>`;
			return text;
		}
		switch (node.type) {
			case "heading":
				return `<h2>${node.children.map(serializeNode).join("")}</h2>`;
			case "bulleted-list":
				return `<ul>${node.children.map(serializeNode).join("")}</ul>`;
			case "numbered-list":
				return `<ol>${node.children.map(serializeNode).join("")}</ol>`;
			case "list-item":
				return `<li>${node.children.map(serializeNode).join("")}</li>`;
			case "quote":
				return `<blockquote>${node.children.map(serializeNode).join("")}</blockquote>`;
			case "code":
				return `<pre><code>${node.children.map(serializeNode).join("")}</code></pre>`;
			default:
				return `<p>${node.children.map(serializeNode).join("")}</p>`;
		}
	};
	return nodes.map(serializeNode).join("");
};