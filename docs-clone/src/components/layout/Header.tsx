"use client";

import { useDocumentStore } from "@/hooks/useDocument";
import { cn } from "@/lib/utils";
import { Star, Folder, Share2, User, Loader2 } from "lucide-react";

export default function Header() {
	const { title, setTitle, isSaving } = useDocumentStore();
	return (
		<div className="w-full h-14 border-b bg-white flex items-center justify-between px-3">
			<div className="flex items-center gap-2">
				<Star size={20} className="text-gray-500" />
				<input
					value={title}
					onChange={e => setTitle(e.target.value)}
					className={cn(
						"text-sm font-medium outline-none px-2 py-1 rounded hover:bg-gray-50 focus:bg-gray-50"
					)}
				/>
				<Folder size={18} className="text-gray-500" />
			</div>
			<div className="flex items-center gap-2">
				<button className="h-8 px-3 rounded-full bg-blue-600 text-white text-sm flex items-center gap-2">
					<Share2 size={16} /> Share
				</button>
				<div className="size-8 rounded-full bg-gray-200 flex items-center justify-center">
					{isSaving ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<User size={16} />
					)}
				</div>
			</div>
		</div>
	);
}
