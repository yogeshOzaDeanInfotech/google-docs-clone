"use client";

import { useExport } from "@/hooks/useExport";
import { useEffect, useRef } from "react";

export default function ExportDialog() {
	const { exportPDF, exportDOCX, exportTXT, exportHTML } = useExport();
	const pageRef = useRef<HTMLElement | null>(null);
	useEffect(() => {
		pageRef.current = document.getElementById("doc-page") as HTMLElement;
	}, []);
	return (
		<div className="flex items-center gap-2">
			<button className="px-3 py-1.5 bg-gray-100 rounded" onClick={() => pageRef.current && exportPDF(pageRef.current)}>Export PDF</button>
			<button className="px-3 py-1.5 bg-gray-100 rounded" onClick={() => exportDOCX()}>Export DOCX</button>
			<button className="px-3 py-1.5 bg-gray-100 rounded" onClick={() => exportTXT()}>Export TXT</button>
			<button className="px-3 py-1.5 bg-gray-100 rounded" onClick={() => exportHTML()}>Export HTML</button>
		</div>
	);
}