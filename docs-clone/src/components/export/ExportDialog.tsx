"use client";

import { useExport } from "@/hooks/useExport";
import { useState } from "react";

export default function ExportDialog() {
	const { exportPDF, exportDOCX, exportTXT, exportHTML } = useExport();
	const [isExporting, setIsExporting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handlePDFExport = async () => {
		try {
			setIsExporting(true);
			setError(null);

			const pageElement = document.getElementById("doc-page") as HTMLElement;
			if (!pageElement) {
				throw new Error("Document page element not found");
			}

			await exportPDF(pageElement);
		} catch (err: any) {
			console.error("PDF Export failed:", err);
			setError(err.message || "PDF export failed");
		} finally {
			setIsExporting(false);
		}
	};

	const handleDOCXExport = async () => {
		try {
			setIsExporting(true);
			setError(null);
			await exportDOCX();
		} catch (err: any) {
			console.error("DOCX Export failed:", err);
			setError(err.message || "DOCX export failed");
		} finally {
			setIsExporting(false);
		}
	};

	const handleTXTExport = async () => {
		try {
			setIsExporting(true);
			setError(null);
			await exportTXT();
		} catch (err: any) {
			console.error("TXT Export failed:", err);
			setError(err.message || "TXT export failed");
		} finally {
			setIsExporting(false);
		}
	};

	const handleHTMLExport = async () => {
		try {
			setIsExporting(true);
			setError(null);
			await exportHTML();
		} catch (err: any) {
			console.error("HTML Export failed:", err);
			setError(err.message || "HTML export failed");
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<button
					className="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
					onClick={handlePDFExport}
					disabled={isExporting}
				>
					{isExporting ? "Exporting..." : "Export PDF"}
				</button>
				<button
					className="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
					onClick={handleDOCXExport}
					disabled={isExporting}
				>
					{isExporting ? "Exporting..." : "Export DOCX"}
				</button>
				<button
					className="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
					onClick={handleTXTExport}
					disabled={isExporting}
				>
					{isExporting ? "Exporting..." : "Export TXT"}
				</button>
				<button
					className="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
					onClick={handleHTMLExport}
					disabled={isExporting}
				>
					{isExporting ? "Exporting..." : "Export HTML"}
				</button>
			</div>
			{error && <div className="text-red-500 text-xs">Error: {error}</div>}
		</div>
	);
}
