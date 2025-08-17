"use client";

import { useDocumentStore } from "@/hooks/useDocument";
import { serializeToPlainText } from "@/lib/document-utils";

export default function StatusBar() {
	const { value } = useDocumentStore();
	const text = serializeToPlainText(value as any);
	const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
	return (
		<div className="h-6 border-t text-xs text-gray-600 flex items-center justify-end px-3 bg-white">Words: {wordCount}</div>
	);
}