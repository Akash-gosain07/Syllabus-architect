import { GoogleGenAI, Schema, Type } from "@google/genai";
import { SyllabusItem } from '../types';

// The extracted data structure from Gemini
interface ExtractedData {
  course_name: string;
  course_code?: string;
  items: {
    type: string;
    title: string;
    due_date: string;
    weightage: number | null;
    notes: string;
  }[];
}

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    course_name: { type: Type.STRING, description: "The full name of the course" },
    course_code: { type: Type.STRING, description: "The course code (e.g. CS101)" },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, enum: ["assignment", "exam", "quiz", "reading", "project"], description: "The type of assessment" },
          title: { type: Type.STRING, description: "Name of the assignment or exam" },
          due_date: { type: Type.STRING, description: "Due date in YYYY-MM-DD format. If only month/day provided, assume current/next year based on logical semester progression." },
          weightage: { type: Type.NUMBER, description: "Percentage of total grade (0-100)" },
          notes: { type: Type.STRING, description: "Any extra details, submission method, or specific time" }
        },
        required: ["type", "title", "due_date"]
      }
    }
  },
  required: ["course_name", "items"]
};

export const extractSyllabusData = async (
  base64File: string, 
  mimeType: string, 
  apiKey: string
): Promise<ExtractedData> => {
  
  if (!apiKey) throw new Error("API Key is missing");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an academic assistant. Analyze this syllabus document.
    Extract all assessable items (assignments, exams, quizzes, projects) and required readings.
    
    CRITICAL INSTRUCTIONS:
    1. Extract the Course Name and Course Code.
    2. For each item, identify the exact Due Date (YYYY-MM-DD). If the syllabus uses "Week 1", "Week 2", assume the semester starts on the nearest future Monday to today's date and calculate the date.
    3. Extract the weightage (percentage of grade) if available.
    4. Normalize the 'type' to one of: assignment, exam, quiz, reading, project.
    5. Be precise. Do not hallucinate. If a date is ambiguous, provide the most likely date or flag in notes.
  `;

  try {
    // Fix: Use 'gemini-3-flash-preview' for text tasks as per guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64File
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as ExtractedData;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw error;
  }
};