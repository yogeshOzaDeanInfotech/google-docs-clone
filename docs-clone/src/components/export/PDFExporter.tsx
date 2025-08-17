"use client";

import { useEffect } from "react";
import { useExport } from "@/hooks/useExport";

export default function PDFExporter({ onDone }: { onDone?: () => void }) {
	const { exportPDF } = useExport();
	useEffect(() => {
		const el = document.getElementById("doc-page");
		if (el) exportPDF(el).finally(() => onDone && onDone());
	}, [exportPDF, onDone]);
	return null;
}