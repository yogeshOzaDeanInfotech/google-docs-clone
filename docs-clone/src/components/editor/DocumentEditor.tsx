"use client";

import Header from "@/components/layout/Header";
import DocumentCanvas from "./DocumentCanvas";
import OpenAIPanel from "@/components/openai/OpenAIPanel";
import StatusBar from "@/components/layout/StatusBar";

export default function DocumentEditor() {
	return (
		<div className="flex flex-col h-full">
			<Header />
			<div className="flex min-h-0 flex-1">
				<div className="flex-1 min-w-0 flex flex-col">
					<div className="flex-1 min-h-0">
						<DocumentCanvas />
					</div>
					<StatusBar />
				</div>
				<OpenAIPanel />
			</div>
		</div>
	);
}