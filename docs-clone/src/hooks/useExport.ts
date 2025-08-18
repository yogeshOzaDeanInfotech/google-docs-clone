"use client";

import { exportAsDocx, exportAsHTML, exportAsPDF, exportAsTxt, buildHtmlFromSlate, buildTextFromSlate } from "@/lib/export-utils";
import { useDocumentStore } from "./useDocument";

export function useExport() {
	const { value, title } = useDocumentStore();
	
	const exportPDF = async (element: HTMLElement) => {
		await exportAsPDF(element, title || "document", value as any[]);
	};
	const exportDOCX = async () => {
		const html = buildHtmlFromSlate(value as any);
		await exportAsDocx(html, title || "document");
	};
	const exportTXT = async () => {
		const text = buildTextFromSlate(value as any);
		await exportAsTxt(text, title || "document");
	};
	const exportHTML = async () => {
		const html = buildHtmlFromSlate(value as any);
		await exportAsHTML(html, title || "document");
	};
	return { exportPDF, exportDOCX, exportTXT, exportHTML };
}