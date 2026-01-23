import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const API_KEY = process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_API_KEY;

const SYSTEM_PROMPT = `You are a History Timeline Generator. Your task is to create educational, historically accurate timelines based on historical topics, documents, or notes provided by users.

CRITICAL RULES:
1. ONLY generate timelines for HISTORICAL topics (history, historical events, historical periods, historical figures, modern history etc.)
2. If the topic is NOT historical (e.g., science, technology, fiction, current events, personal topics), you MUST respond with: {"error": "This topic is not historical. Please provide a historical topic."}
3. Be historically accurate and fact-based
4. Use proper historical dates and chronological order
5. Write in Italian

DETAIL LEVELS:
- "Essenziale": 2-3 macros, 3-5 micros per macro. Focus on key events only. Brief descriptions.
- "Medio": 3-4 macros, 5-8 micros per macro. Balanced coverage with context. Medium-length descriptions.
- "Approfondito": 4-6 macros, 8-12 micros per macro. Comprehensive coverage with detailed context, causes, and consequences. Longer descriptions.

MICRO TYPES:
- "event": Specific historical events with dates
- "focus": Important/key events that deserve emphasis
- "text": Explanatory text without specific dates
- "list": Lists of related items (e.g., countries, treaties, people)

Return ONLY a valid JSON object matching this exact structure:
{
  "id": "kebab-case-id-based-on-title",
  "title": "Main title in Italian",
  "subtitle": "Subtitle describing the period/topic",
  "date": "StartYear–EndYear",
  "description": "2-3 sentence description of the topic",
  "macros": [
    {
      "id": "kebab-case-macro-id",
      "title": "Macro topic title",
      "date": "Year or YearRange",
      "summary": "Brief summary sentence",
      "micros": [
        {
          "type": "event",
          "title": "Event title",
          "date": "Year or YearRange (optional)",
          "content": "Event description"
        },
        {
          "type": "focus",
          "title": "Important event title",
          "date": "Year (optional)",
          "content": "Detailed description"
        },
        {
          "type": "text",
          "title": "Explanatory section title",
          "content": "Explanatory text without dates"
        },
        {
          "type": "list",
          "title": "List title",
          "content": ["Item 1", "Item 2", "Item 3"]
        }
      ]
    }
  ]
}

IMPORTANT:
- Do NOT include any text before or after the JSON
- Ensure all dates are historically accurate
- Use proper Italian grammar and historical terminology
- If topic is not historical, return error JSON only`;

const anthropic = new Anthropic({
  apiKey: API_KEY,
});

export async function POST(request) {
  try {
    const { topic, fileContent, detailLevel } = await request.json();

    // Validate that topic is provided
    if (!topic || topic.trim() === "") {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    if (!API_KEY) {
      return NextResponse.json(
        { error: "API key non configurata. Aggiungi ANTHROPIC_API_KEY o NEXT_PUBLIC_API_KEY nel file .env.local" },
        { status: 500 }
      );
    }

    // Build user message
    let userMessage = `Crea una timeline storica per: "${topic}"\n\n`;
    userMessage += `Livello di dettaglio richiesto: ${detailLevel}\n\n`;

    if (fileContent) {
      userMessage += `Contenuto del file fornito:\n${fileContent}\n\n`;
      userMessage += `Analizza il contenuto del file e usalo per creare una timeline dettagliata e accurata.`;
    } else {
      userMessage += `Crea una timeline basata sulla conoscenza storica del tema.`;
    }

    // Try different model names - adjust based on your API access
    // List of models to try in order (most common first)
    const modelsToTry = [
      process.env.ANTHROPIC_MODEL, // User-specified model first
      "claude-3-5-sonnet-20240620",
      "claude-3-5-haiku-20241022",
      "claude-3-opus-20240229",
      "claude-3-sonnet-20240229",
      "claude-3-haiku-20240307",
    ].filter(Boolean); // Remove undefined values
    
    let response;
    let lastError = null;
    
    // Try each model until one works
    for (const modelName of modelsToTry) {
      try {
        response = await anthropic.messages.create({
          model: modelName,
          max_tokens: 4000,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],
        });
        break; // Success, exit loop
      } catch (apiError) {
        lastError = apiError;
        // If it's a 404, try the next model
        if (apiError.status === 404 || apiError.message?.includes("not_found")) {
          continue;
        }
        // For other errors, throw immediately
        throw apiError;
      }
    }
    
    // If we tried all models and none worked
    if (!response) {
      return NextResponse.json(
        { 
          error: `None of the available models worked. Please check your API access. You can set ANTHROPIC_MODEL in .env.local to specify a model. Common models: claude-3-5-sonnet-20240620, claude-3-5-haiku-20241022, claude-3-opus-20240229, claude-3-sonnet-20240229, claude-3-haiku-20240307`,
          lastError: lastError?.message
        },
        { status: 400 }
      );
    }
    
    // Check if response has content
    if (!response.content || !Array.isArray(response.content) || response.content.length === 0) {
      return NextResponse.json(
        { error: "La risposta dell'API non contiene contenuto valido." },
        { status: 500 }
      );
    }

    const content = response.content[0].text;
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: "Il contenuto della risposta non è valido." },
        { status: 500 }
      );
    }

    try {
      // Try to extract JSON if there's any extra text
      // Look for JSON object that might be wrapped in markdown code blocks
      let jsonString = content;
      
      // Remove markdown code blocks if present
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      // Try to find JSON object
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }

      const timelineData = JSON.parse(jsonString);

      // Check for error response
      if (timelineData.error) {
        return NextResponse.json(
          { error: timelineData.error },
          { status: 400 }
        );
      }

      // Validate structure
      if (!timelineData.id || !timelineData.title || !timelineData.macros || !Array.isArray(timelineData.macros)) {
        return NextResponse.json(
          { error: "Invalid timeline structure: missing required fields. The AI response may be incomplete." },
          { status: 500 }
        );
      }

      // Validate macros
      timelineData.macros.forEach((macro, index) => {
        if (!macro.id || !macro.title || !macro.micros || !Array.isArray(macro.micros)) {
          throw new Error(`Invalid macro structure at index ${index}`);
        }
      });

      return NextResponse.json(timelineData);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      console.log("Full raw response:", content);
      console.log("Response length:", content.length);
      
      // Return more helpful error message
      return NextResponse.json(
        { 
          error: `Failed to parse timeline response: ${parseError.message}. The AI may have returned invalid JSON. Please try again.`,
          debug: process.env.NODE_ENV === 'development' ? content.substring(0, 1000) : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error.message || "Errore nella generazione della timeline" },
      { status: 500 }
    );
  }
}
