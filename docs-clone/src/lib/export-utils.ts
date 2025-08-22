import { serializeToHTML, serializeToPlainText } from "./document-utils";

export async function exportAsPDF(
	rootElement: HTMLElement,
	filename: string,
	documentValue?: any[]
) {
	try {
		let content: any[];

		if (documentValue && documentValue.length > 0) {
			// Use the Slate content directly
			content = documentValue;
		} else {
			// Fallback to DOM content if no document value provided
			const htmlContent = rootElement.innerHTML;
			content = [
				{
					type: "paragraph",
					children: [{ text: htmlContent.replace(/<[^>]+>/g, "") }],
				},
			];
		}

		// Check if we have any content
		if (!content || content.length === 0) {
			throw new Error("No content available for PDF export");
		}

		// Convert content to HTML for server processing
		const htmlContent = serializeToHTML(content);

		// Call server-side API to generate PDF
		const response = await fetch("/api/generate-pdf", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				html: htmlContent,
				filename: filename,
			}),
		});

		if (!response.ok) {
			throw new Error(`PDF generation failed: ${response.statusText}`);
		}

		// Get the PDF blob
		const blob = await response.blob();

		// Save the PDF
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${filename}.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	} catch (error) {
		console.error("PDF Export Error:", error);
		throw error;
	}
}

export async function exportAsDocx(html: string, filename: string) {
	const { Document, Packer, Paragraph } = await import("docx");
	// Very basic: wrap the HTML as a paragraph of text (docx rich html conversion is complex without additional libs)
	const doc = new Document({
		sections: [
			{
				children: [new Paragraph(html.replace(/<[^>]+>/g, ""))],
			},
		],
	});
	const blob = await Packer.toBlob(doc);
	const { saveAs } = await import("file-saver");
	saveAs(blob, `${filename}.docx`);
}

export async function exportAsTxt(text: string, filename: string) {
	const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	const { saveAs } = await import("file-saver");
	saveAs(blob, `${filename}.txt`);
}

export async function exportAsHTML(html: string, filename: string) {
	const blob = new Blob(
		[
			`<!doctype html><html><head><meta charset=\"utf-8\" /></head><body>${html}</body></html>`,
		],
		{ type: "text/html;charset=utf-8" }
	);
	const { saveAs } = await import("file-saver");
	saveAs(blob, `${filename}.html`);
}

export const buildHtmlFromSlate = (nodes: any[]) => serializeToHTML(nodes);
export const buildTextFromSlate = (nodes: any[]) => serializeToPlainText(nodes);
