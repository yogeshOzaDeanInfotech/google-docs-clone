export type GenerateContentOptions = {
	prompt: string;
	documentContext?: string;
	model?: string;
};

export async function generateContent({
	prompt,
	documentContext,
	model = "gpt-4o",
}: GenerateContentOptions): Promise<string> {
	if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
		throw new Error("Missing NEXT_PUBLIC_OPENAI_API_KEY");
	}

	// Lazy import to avoid SSR issues
	const OpenAI = await import("openai");
	const openai = new OpenAI.default({
		apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
		dangerouslyAllowBrowser: true,
	});

	const contextPrompt = documentContext
		? `Document Context:\n${documentContext}\n\nUser Request:\n${prompt}`
		: prompt;

	const completion = await openai.chat.completions.create({
		model: model,
		messages: [
			{
				role: "system",
				content:
					"You are a helpful AI assistant that helps users with document editing and writing tasks. Provide clear, concise, and helpful responses.",
			},
			{
				role: "user",
				content: contextPrompt,
			},
		],
		max_tokens: 1000,
		temperature: 0.7,
	});

	return completion.choices[0]?.message?.content || "No response generated";
}

export async function tryGenerateContent(
	opts: GenerateContentOptions
): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
	try {
		const text = await generateContent(opts);
		return { ok: true, text };
	} catch (err) {
		return { ok: false, error: err instanceof Error ? err.message : "OpenAI error" };
	}
}