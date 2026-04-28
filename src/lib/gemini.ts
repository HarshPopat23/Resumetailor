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
4. Professional Formatting: Return the output in clean, structured Markdown.
5. Conciseness: Keep it to a maximum of 2 pages (in equivalent text length).
6. HONESTY: Do NOT fabricate experiences. Enhance wording and focus on relevant parts, but stay truthful.

OUTPUT STRUCTURE (Markdown):
# FULL NAME
[Location, Email, LinkedIn, Portfolio/Phone]

## Professional Summary
[A 3-4 sentence paragraph tailored to the specific role and company]

## Skills
- [Categorized relevant skills, e.g., Technical, Soft, Tools]

## Experience
**[Job Title] | [Company Name] | [Date Range]**
- [Bullet points with measurable impact, starting with action verbs]

## Projects
**[Project Name] | [Link/Tech Stack]**
- [Description highlighting relevance to the job]

## Education
**[Degree] | [University Name] | [Graduation Year]**

[Optional: Certifications/Awards if highly relevant]`;

  const prompt = `--- USER CV ---
${cv}

--- JOB DESCRIPTION ---
${jobDescription}

Please generate the tailored resume based on these inputs. Ensure it is directly optimized for the provided Job Description.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate resume. Please check your connectivity and try again.");
  }
}
