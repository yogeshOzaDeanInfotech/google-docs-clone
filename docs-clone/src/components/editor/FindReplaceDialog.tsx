"use client";

import { useState, useEffect } from "react";
import { useSlate } from "slate-react";
import { Editor, Transforms, Node } from "slate";
import { Search, Replace, X, ChevronUp, ChevronDown } from "lucide-react";

interface FindReplaceDialogProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function FindReplaceDialog({
	isOpen,
	onClose,
}: FindReplaceDialogProps) {
	const editor = useSlate();
	const [findText, setFindText] = useState("");
	const [replaceText, setReplaceText] = useState("");
	const [matchCase, setMatchCase] = useState(false);
	const [wholeWord, setWholeWord] = useState(false);
	const [currentMatch, setCurrentMatch] = useState(0);
	const [totalMatches, setTotalMatches] = useState(0);
	const [matches, setMatches] = useState<
		{ path: number[]; start: number; end: number }[]
	>([]);

	// Find all matches when search text changes
	useEffect(() => {
		if (!findText.trim()) {
			setMatches([]);
			setTotalMatches(0);
			setCurrentMatch(0);
			return;
		}

		const newMatches: { path: number[]; start: number; end: number }[] = [];
		const nodes = Array.from(Editor.nodes(editor, { at: [] }));

		nodes.forEach(([node, path]) => {
			if (Node.isText(node)) {
				const text = node.text;
				const searchText = matchCase ? findText : findText.toLowerCase();
				const nodeText = matchCase ? text : text.toLowerCase();

				let startIndex = 0;
				while (true) {
					const index = nodeText.indexOf(searchText, startIndex);
					if (index === -1) break;

					// Check for whole word match if enabled
					if (wholeWord) {
						const before = index > 0 ? nodeText[index - 1] : " ";
						const after =
							index + searchText.length < nodeText.length
								? nodeText[index + searchText.length]
								: " ";
						const wordRegex = /[a-zA-Z0-9]/;

						if (wordRegex.test(before) || wordRegex.test(after)) {
							startIndex = index + 1;
							continue;
						}
					}

					newMatches.push({
						path,
						start: index,
						end: index + searchText.length,
					});
					startIndex = index + 1;
				}
			}
		});

		setMatches(newMatches);
		setTotalMatches(newMatches.length);
		setCurrentMatch(newMatches.length > 0 ? 1 : 0);
	}, [findText, matchCase, wholeWord, editor]);

	// Navigate to current match
	useEffect(() => {
		if (matches.length > 0 && currentMatch > 0) {
			const match = matches[currentMatch - 1];
			Transforms.select(editor, {
				anchor: { path: match.path, offset: match.start },
				focus: { path: match.path, offset: match.end },
			});
		}
	}, [currentMatch, matches, editor]);

	// Handle find next
	const findNext = () => {
		if (totalMatches > 0) {
			setCurrentMatch(prev => (prev >= totalMatches ? 1 : prev + 1));
		}
	};

	// Handle find previous
	const findPrevious = () => {
		if (totalMatches > 0) {
			setCurrentMatch(prev => (prev <= 1 ? totalMatches : prev - 1));
		}
	};

	// Handle replace
	const replace = () => {
		if (matches.length > 0 && currentMatch > 0) {
			const match = matches[currentMatch - 1];
			Transforms.select(editor, {
				anchor: { path: match.path, offset: match.start },
				focus: { path: match.path, offset: match.end },
			});
			Transforms.insertText(editor, replaceText);

			// Update matches after replacement
			setMatches(prev => prev.filter((_, index) => index !== currentMatch - 1));
			setTotalMatches(prev => prev - 1);
			if (currentMatch > totalMatches - 1) {
				setCurrentMatch(Math.max(1, totalMatches - 1));
			}
		}
	};

	// Handle replace all
	const replaceAll = () => {
		if (matches.length > 0) {
			// Sort matches in reverse order to maintain correct indices
			const sortedMatches = [...matches].sort((a, b) => {
				if (a.path.length !== b.path.length)
					return b.path.length - a.path.length;
				return b.start - a.start;
			});

			sortedMatches.forEach(match => {
				Transforms.select(editor, {
					anchor: { path: match.path, offset: match.start },
					focus: { path: match.path, offset: match.end },
				});
				Transforms.insertText(editor, replaceText);
			});

			setMatches([]);
			setTotalMatches(0);
			setCurrentMatch(0);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-xl w-96 max-w-[90vw]">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b">
					<h3 className="text-lg font-semibold">Find & Replace</h3>
					<button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
						<X size={20} />
					</button>
				</div>

				{/* Content */}
				<div className="p-4 space-y-4">
					{/* Find */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Find
						</label>
						<input
							type="text"
							value={findText}
							onChange={e => setFindText(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter text to find..."
						/>
					</div>

					{/* Replace */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Replace with
						</label>
						<input
							type="text"
							value={replaceText}
							onChange={e => setReplaceText(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Enter replacement text..."
						/>
					</div>

					{/* Options */}
					<div className="flex gap-4">
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={matchCase}
								onChange={e => setMatchCase(e.target.checked)}
								className="mr-2"
							/>
							<span className="text-sm">Match case</span>
						</label>
						<label className="flex items-center">
							<input
								type="checkbox"
								checked={wholeWord}
								onChange={e => setWholeWord(e.target.checked)}
								className="mr-2"
							/>
							<span className="text-sm">Whole word</span>
						</label>
					</div>

					{/* Match info */}
					{totalMatches > 0 && (
						<div className="text-sm text-gray-600">
							{currentMatch} of {totalMatches} matches
						</div>
					)}

					{/* Buttons */}
					<div className="flex gap-2">
						<button
							onClick={findPrevious}
							disabled={totalMatches === 0}
							className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
							title="Find Previous"
						>
							<ChevronUp size={16} />
						</button>
						<button
							onClick={findNext}
							disabled={totalMatches === 0}
							className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
							title="Find Next"
						>
							<ChevronDown size={16} />
						</button>
						<div className="flex-1" />
						<button
							onClick={replace}
							disabled={totalMatches === 0}
							className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
						>
							Replace
						</button>
						<button
							onClick={replaceAll}
							disabled={totalMatches === 0}
							className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
						>
							Replace All
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
