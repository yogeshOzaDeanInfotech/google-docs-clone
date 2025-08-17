import ExportDialog from "@/components/export/ExportDialog";
import DocumentEditor from "@/components/editor/DocumentEditor";

export default function Home() {
	return (
		<div className="h-screen w-screen flex flex-col">
			<div className="h-10 border-b bg-white flex items-center justify-between px-3 text-xs text-gray-600">
				<div>Preloaded: RTI Marathi template. Use the Gemini panel on the right for content help.</div>
				<ExportDialog />
			</div>
			<div className="flex-1 min-h-0">
				<DocumentEditor />
			</div>
		</div>
	);
}
