export type GenerateContentOptions = {
	prompt: string;
	documentContext?: string;
	model?: string;
};

export async function generateContent({ prompt, documentContext, model = "gemini-1.5-pro" }: GenerateContentOptions): Promise<string> {
	if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
		throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
	}
	// Lazy import to avoid SSR issues
	const { GoogleGenerativeAI } = await import("@google/generative-ai");
	const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
	const genModel = genAI.getGenerativeModel({ model });
	const contextPrompt = documentContext ? `Document Context:\n${documentContext}\n\nUser Request:\n${prompt}` : prompt;
	const result = await genModel.generateContent(contextPrompt);
	return result.response.text();
}

export async function tryGenerateContent(opts: GenerateContentOptions): Promise<{ ok: true; text: string } | { ok: false; error: string }>{
	try {
		const text = await generateContent(opts);
		return { ok: true, text };
	} catch (err: any) {
		return { ok: false, error: err?.message ?? "Gemini error" };
	}
}