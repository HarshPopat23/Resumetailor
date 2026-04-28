import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateTailoredResume(cv: string, jobDescription: string) {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `You are an expert resume writer and ATS optimization specialist.
Your goal is to generate a highly tailored, professional resume based on the user's CV and a target job description.

GUIDELINES:
1. Optimize for ATS: Use keywords from the job description naturally.
2. Focus on Relevance: Highlight skills, projects, and experiences that directly match the job requirements.
3. Quantifiable Impact: Use strong action verbs and include metrics (numbers, %, $) wherever possible.
4. Professional Formatting: Return the output in TWO formats: Markdown and Printable HTML.
5. HTML Requirements:
   - Use clean, semantic HTML5.
   - Use inline CSS (style tags).
   - Optimized for A4 paper size and professional typography.
   - ATS-friendly (no SVG icons or non-standard fonts that might break parsing).
   - Use standard professional fonts (Arial, Helvetica, or Georgia).

OUTPUT STRUCTURE:
---MARKDOWN START---
[Markdown content here]
---MARKDOWN END---

---HTML START---
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Helvetica', 'Arial', sans-serif; line-height: 1.5; color: #333; margin: 0; padding: 0.5in; }
  h1 { text-align: center; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
  .contact { text-align: center; font-size: 11px; color: #666; margin-bottom: 20px; }
  h2 { border-bottom: 2px solid #333; padding-bottom: 3px; margin-top: 25px; margin-bottom: 10px; font-size: 16px; text-transform: uppercase; }
  .job { margin-bottom: 15px; }
  .job-header { display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; }
  .job-sub { font-style: italic; font-size: 13px; color: #555; margin-bottom: 5px; }
  ul { padding-left: 20px; margin: 5px 0; }
  li { font-size: 12px; margin-bottom: 3px; }
  .skills-list { font-size: 12px; }
  @media print {
    body { padding: 0; }
    @page { size: A4; margin: 0.5in; }
  }
</style>
</head>
<body>
 [HTML body content here]
</body>
</html>
---HTML END---`;

  const prompt = `--- USER CV ---
${cv}

--- JOB DESCRIPTION ---
${jobDescription}

Please generate the tailored resume in both Markdown and Printable HTML formats as specified.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const text = response.text;
    
    // Simple parsing for the two formats
    const markdownMatch = text.match(/---MARKDOWN START---([\s\S]*?)---MARKDOWN END---/);
    const htmlMatch = text.match(/---HTML START---([\s\S]*?)---HTML END---/);
    
    return {
      markdown: markdownMatch ? markdownMatch[1].trim() : text,
      html: htmlMatch ? htmlMatch[1].trim() : ""
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate resume. Please check your connectivity and try again.");
  }
}
