import type { BaseEditor, Descendant } from "slate";
import type { HistoryEditor } from "slate-history";
import type { ReactEditor } from "slate-react";

export type DocumentValue = Descendant[];

export type EditorType = BaseEditor & ReactEditor & HistoryEditor;

export type DocumentVersion = {
	id: string;
	timestamp: number;
	title: string;
	value: DocumentValue;
};

export type ExportFormat = "pdf" | "docx" | "txt" | "html";
