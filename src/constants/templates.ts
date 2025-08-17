export const DOCUMENT_TEMPLATES = {
  RTI_MARATHI: {
    id: 'rti-marathi',
    name: 'RTI Application (Marathi)',
    content: `कार्यालयाचे नाव: महाराष्ट्र शासन, माहिती अधिकार विभाग
पत्ता: पुणे, महाराष्ट्र
दूरध्वनी क्रमांक: ०२०-२३३४५६७८
ई-मेल: rti.maharashtra@gov.in

जावक क्र.: RTI/2025/123
दिनांक: १८ ऑगस्ट २०२५

कार्यकारीन आदेश

विषय: माहितीचा अधिकार अधिनियम, २००५ अंतर्गत मानित जन माहिती अधिकारी नेमणूकबाबत.

संदर्भ:
१. माहितीचा अधिकार अधिनियम, २००५ चे कलम ५(१) व ५(५)
२. श्री. योगेश ओझा यांचा माहिती अधिकार अर्ज क्र. PO-2025-001 दिनांक १५ ऑगस्ट २०२५

ज्याअर्थी, उपरोक्त संदर्भीय अर्जन्वये श्री. योगेश ओझा यांनी माहितीचा अधिकार अधिनियम, २००५ अंतर्गत खालील माहिती मागितली आहे:
१. महाराष्ट्र शासनाच्या माहिती अधिकार विभागातील सर्व कर्मचाऱ्यांची सवस्तिती.
२. माहिती अधिकार विभागातील प्रलंबित अर्जांची संख्या आणि त्यांचा निपटारा करण्याबाठी लागणारा सरासरी वेळ.

आणि ज्याअर्थी, मागितलेली माहिती ही या कार्यालयातील जन माहिती अधिकारी योज्य अधिकारक्षेत्रात असून, ती या कार्यालयातील/प्राधिकरणातील प्रशासन विभागाशी/शाखेशी संबंधित आहे; आणि ज्याअर्थी, माहितीचा अधिकार अधिनियम, २००५ च्या कलम ५(१) नुसार, "जेव्हा एखादा जन माहिती अधिकारी, कलम ६ अन्वये केलेल्या विनंतीवर, तेवीस दिवसांच्या आत निर्णय घेऊ शकत नाही किंवा कलम ७ च्या उप-कलम (१) अन्वये विहित कालावधीत माहिती पुरवू शकत नाही, तेव्हा तो त्या विनंतीला त्याच सार्वजनिक प्राधिकरणातील इतर अधिकाऱ्याकडे हस्तांतरित करू शकतो" असे नमूद आहे;

त्यामुळे आता, माहितीचा अधिकार अधिनियम, २००५ च्या कलम ५(५) अन्वये माझ्यामध्ये निहित अधिकारांचा वापर करून, मी, अधोस्वाक्षरी, अतिरिक्त मुख्य सचिव, माहिती अधिकार विभाग, महाराष्ट्र शासन, याद्वारे श्री./श्रीमती [नाव] यांना या कार्यालयाचे मानद जन माहिती अधिकारी म्हणून नियुक्त करत आहे.

हा आदेश तात्काळ अंमलात येईल.

स्वाक्षरी
[नाव]
अतिरिक्त मुख्य सचिव
माहिती अधिकार विभाग
महाराष्ट्र शासन

प्रत मार्फत:
१. श्री. संतोष पवार, मानित जन माहिती अधिकारी - कृपया लिहित कार्यालयीन मान्यता माहिती उपलब्ध करून देण्याची व्यवस्था करावी.
२. श्री. योगेश ओझा, अर्जदार - माहितीसाठी.
३. कार्यालय प्रमुख - माहितीसाठी.
४. प्रथम अपीलीय अधिकारी - माहितीसाठी.
५. कार्यालयीन प्रत.`
  },
  BLANK: {
    id: 'blank',
    name: 'Blank Document',
    content: ''
  },
  LETTER: {
    id: 'letter',
    name: 'Formal Letter',
    content: `[Your Name]
[Your Address]
[City, State ZIP Code]
[Email Address]
[Phone Number]

[Date]

[Recipient Name]
[Title]
[Company/Organization]
[Address]
[City, State ZIP Code]

Dear [Recipient Name],

[Opening paragraph - State the purpose of your letter]

[Body paragraphs - Provide details and supporting information]

[Closing paragraph - Summarize and indicate next steps]

Sincerely,

[Your Name]
[Your Title]`
  },
  REPORT: {
    id: 'report',
    name: 'Report Template',
    content: `# [Report Title]

## Executive Summary
[Brief overview of the report's key findings and recommendations]

## Table of Contents
1. Introduction
2. Methodology
3. Findings
4. Analysis
5. Recommendations
6. Conclusion
7. References

## 1. Introduction
[Background information and objectives]

## 2. Methodology
[Description of research methods used]

## 3. Findings
[Present your research findings]

## 4. Analysis
[Interpret and analyze the findings]

## 5. Recommendations
[Provide actionable recommendations]

## 6. Conclusion
[Summarize the main points]

## 7. References
[List all sources cited]`
  }
}

export const FONT_FAMILIES = [
  'Arial',
  'Times New Roman',
  'Georgia',
  'Verdana',
  'Helvetica',
  'Calibri',
  'Cambria',
  'Tahoma',
  'Trebuchet MS',
  'Comic Sans MS',
  'Courier New',
  'Noto Sans Devanagari', // For Marathi support
  'Mangal', // For Marathi support
]

export const FONT_SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72]

export const DEFAULT_DOCUMENT_STYLES = {
  fontFamily: 'Arial',
  fontSize: 11,
  lineHeight: 1.5,
  marginTop: '1in',
  marginBottom: '1in',
  marginLeft: '1in',
  marginRight: '1in',
  pageSize: 'A4'
}