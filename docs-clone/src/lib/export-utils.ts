import { serializeToHTML, serializeToPlainText } from "./document-utils";

export async function exportAsPDF(rootElement: HTMLElement, filename: string) {
	const { jsPDF } = await import("jspdf");
	const html2canvas = (await import("html2canvas")).default;
	const canvas = await html2canvas(rootElement, { scale: 2, useCORS: true });
	const imgData = canvas.toDataURL("image/png");
	const pdf = new jsPDF({ unit: "pt", format: "a4" });
	const pageWidth = pdf.internal.pageSize.getWidth();
	const pageHeight = pdf.internal.pageSize.getHeight();
	const imgWidth = pageWidth;
	const imgHeight = (canvas.height * imgWidth) / canvas.width;
	let heightLeft = imgHeight;
	let position = 0;
	pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
	heightLeft -= pageHeight;
	while (heightLeft > 0) {
		position = heightLeft - imgHeight;
		pdf.addPage();
		pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
		heightLeft -= pageHeight;
	}
	pdf.save(`${filename}.pdf`);
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
	const blob = new Blob([`<!doctype html><html><head><meta charset=\"utf-8\" /></head><body>${html}</body></html>`], { type: "text/html;charset=utf-8" });
	const { saveAs } = await import("file-saver");
	saveAs(blob, `${filename}.html`);
}

export const buildHtmlFromSlate = (nodes: any[]) => serializeToHTML(nodes);
export const buildTextFromSlate = (nodes: any[]) => serializeToPlainText(nodes);