"use client";

import dynamic from "next/dynamic";
import ExportDialog from "@/components/export/ExportDialog";
import ClientOnly from "@/components/common/ClientOnly";

// Dynamically import DocumentEditor to prevent hydration issues
const DocumentEditor = dynamic(
	() => import("@/components/editor/DocumentEditor"),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center h-full">
				<div className="text-gray-500">Loading editor...</div>
			</div>
		),
	}
);

export default function Home() {
	return (
		<div className="h-screen w-screen flex flex-col">
			<div className="h-10 border-b bg-white flex items-center justify-between px-3 text-xs text-gray-600">
				<div>Document Editor with AI Assistant</div>
				<ClientOnly>
					<ExportDialog />
				</ClientOnly>
			</div>
			<div className="flex-1 min-h-0">
				<DocumentEditor />
			</div>
		</div>
	);
}
