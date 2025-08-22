export type ChatRole = "user" | "assistant" | "system" | "error";

export type ChatMessage = {
	id: string;
	role: ChatRole;
	text: string;
	timestamp: number;
};