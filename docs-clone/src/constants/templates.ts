import { Element } from "slate";

export const INITIAL_SLATE_VALUE = [
	{
		type: "paragraph",
		children: [
			{ text: "कार्यालयाचे नाव: महाराष्ट्र शासन, माहिती अधिकार विभाग" },
		],
	} as Element,
	{
		type: "paragraph",
		children: [{ text: "पत्ता: पुणे, महाराष्ट्र" }],
	} as Element,
	{
		type: "paragraph",
		children: [{ text: "दूरध्वनी क्रमांक: ०२०-२३३४५६७८" }],
	} as Element,
	{
		type: "paragraph",
		children: [{ text: "ई-मेल: rti.maharashtra@gov.in" }],
	} as Element,
	{ type: "paragraph", children: [{ text: "" }] } as Element,
	{
		type: "paragraph",
		children: [{ text: "जावक क्र.: RTI/2025/123" }],
	} as Element,
	{
		type: "paragraph",
		children: [{ text: "दिनांक: १८ ऑगस्ट २०२५" }],
	} as Element,
	{ type: "paragraph", children: [{ text: "" }] } as Element,
	{
		type: "heading",
		level: 2,
		children: [{ text: "कार्यकारी अधेश" }],
	} as Element,
	{ type: "paragraph", children: [{ text: "" }] } as Element,
	{
		type: "paragraph",
		children: [
			{
				text: "विषय: माहितीचा अधिकार अधिनियम, २००५ अंतर्गत मानित जन माहिती अधिकारी नेमणूक बाबत.",
			},
		],
	} as Element,
	{ type: "paragraph", children: [{ text: "" }] } as Element,
	{ type: "paragraph", children: [{ text: "संदर्भ:" }] } as Element,
	{
		type: "bulleted-list",
		children: [
			{
				type: "list-item",
				children: [
					{ text: "माहितीचा अधिकार अधिनियम, २००५ चे कलम ५(१) व ५(५)" },
				],
			} as Element,
			{
				type: "list-item",
				children: [
					{
						text: "श्री. योगेश आझा यांचा माहिती अधिकार अर्ज क्र. PO-2025-001 दिनांक १५ ऑगस्ट २०२५",
					},
				],
			} as Element,
		],
	} as Element,
];
