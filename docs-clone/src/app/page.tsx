import ExportDialog from "@/components/export/ExportDialog";
import ClientOnly from "@/components/ClientOnly";
import DocumentEditorWrapper from "@/components/DocumentEditorWrapper";

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
				<DocumentEditorWrapper />
			</div>
		</div>
	);
}
