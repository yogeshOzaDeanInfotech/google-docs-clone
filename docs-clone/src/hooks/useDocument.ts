"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DocumentValue, DocumentVersion } from "@/types/document";
import { INITIAL_SLATE_VALUE } from "@/constants/templates";
import { uid } from "@/lib/utils";
import React from "react";

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
		{
			name: "docs-clone-state",
			// Add partial hydration to prevent hydration mismatches
			partialize: state => ({
				title: state.title,
				value: state.value,
				versions: state.versions,
			}),
		}
	)
);

// Hook to handle auto-commit functionality
export const useAutoCommit = () => {
	React.useEffect(() => {
		// Only run on client side
		if (typeof window === "undefined") return;

		const intervalHandle = setInterval(() => {
			const { commitVersion } = useDocumentStore.getState();
			commitVersion();
		}, 30000);

		// Cleanup interval on unmount
		return () => {
			clearInterval(intervalHandle);
		};
	}, []);
};
