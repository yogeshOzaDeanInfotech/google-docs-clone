import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
	try {
		const { html, filename } = await request.json();

		if (!html) {
			return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
		}

		// Launch puppeteer
		const browser = await puppeteer.launch({
			headless: true,
			args: ['--no-sandbox', '--disable-setuid-sandbox']
		});

		try {
			// Create a new page
			const page = await browser.newPage();
			
			// Set viewport to A4 size
			await page.setViewport({
				width: 794, // A4 width in pixels
				height: 1123, // A4 height in pixels
				deviceScaleFactor: 2 // Higher quality
			});

			// Create a complete HTML document with proper styling
			const fullHtml = `
				<!DOCTYPE html>
				<html>
				<body>
					${html}
				</body>
				</html>
			`;

			// Set the HTML content
			await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

			// Generate PDF with proper settings
			const pdfBuffer = await page.pdf({
				format: 'A4',
				printBackground: true,
				margin: {
					top: '20mm',
					right: '20mm',
					bottom: '20mm',
					left: '20mm'
				},
				preferCSSPageSize: true,
				displayHeaderFooter: false
			});

			// Return the PDF as a response
			return new NextResponse(pdfBuffer, {
				headers: {
					'Content-Type': 'application/pdf',
					'Content-Disposition': `attachment; filename="${filename}.pdf"`
				}
			});

		} finally {
			// Close the browser
			await browser.close();
		}

	} catch (error) {
		console.error('PDF generation error:', error);
		return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
	}
}
