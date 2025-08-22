"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DocumentValue, DocumentVersion } from "@/types/document";
import { INITIAL_SLATE_VALUE } from "@/constants/templates";
import { uid } from "@/lib/utils";

export type DocumentState = {
	title: string;
	value: DocumentValue;
	versions: DocumentVersion[];
	isSaving: boolean;
	setTitle: (t: string) => void;
	setValue: (v: DocumentValue) => void;
	commitVersion: () => void;
};

export const useDocumentStore = create<DocumentState>()(
	persist(
		(set, get) => ({
			title: "Untitled document",
			value: INITIAL_SLATE_VALUE,
			versions: [],
			isSaving: false,
			setTitle: t => set({ title: t }),
			setValue: v => set({ value: v }),
			commitVersion: () => {
				const { title, value, versions } = get();
				const ver: DocumentVersion = {
					id: uid("ver"),
					timestamp: Date.now(),
					title,
					value,
				};
				set({ versions: [ver, ...versions].slice(0, 20) });
			},
		}),
		{ name: "docs-clone-state" }
	)
);

// Auto-commit every 30s
let intervalHandle: any;
if (typeof window !== "undefined") {
	clearInterval(intervalHandle);
	intervalHandle = setInterval(() => {
		const { commitVersion } = useDocumentStore.getState();
		commitVersion();
	}, 30000);
}
