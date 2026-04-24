const GEMINI_API_URL =
"https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent";

export async function getAIPrioritySuggestion(title, description) {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    console.warn("AI_API_KEY not configured, returning fallback");
    return getFallback(title, description);
  }

  const prompt = `
You are an expert productivity assistant.

Your job is to IMPROVE the given task.

STRICT RULES:
- DO NOT repeat the original title
- ALWAYS rewrite the title with clearer, more specific wording
- Expand vague tasks into meaningful ones
- Description should explain what needs to be done (1–2 short lines)
- Priority must be one of: low, medium, high

INPUT:
Title: ${title}
Description: ${description || "None"}

OUTPUT FORMAT (STRICT JSON ONLY, NO MARKDOWN):
{
  "improvedTitle": "...",
  "description": "...",
  "priority": "low|medium|high"
}

EXAMPLES:

Input:
Title: do assignment
Description: none

Output:
{
  "improvedTitle": "Complete and submit assignment on time",
  "description": "Work on the assignment and ensure submission before deadline.",
  "priority": "high"
}

Now generate the response.
`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status}`);
      return getFallback(title, description);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.warn("Empty Gemini response");
      return getFallback(title, description);
    }

    let jsonStr = content.trim();

    // Remove markdown if present
    jsonStr = jsonStr.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      console.warn("JSON parse failed");
      return getFallback(title, description);
    }

    if (
      !parsed.improvedTitle ||
      !parsed.description ||
      !["low", "medium", "high"].includes(parsed.priority)
    ) {
      return getFallback(title, description);
    }

    return {
      improvedTitle: parsed.improvedTitle.slice(0, 100),
      description: parsed.description.slice(0, 200),
      priority: parsed.priority,
    };
  } catch (error) {
    console.error("AI service error:", error.message);
    return getFallback(title, description);
  }

  console.log("RAW AI:", content);
}

function getFallback(title, description) {
  return {
    improvedTitle: title || "Untitled Task",
    description: description || "No description provided",
    priority: "medium",
  };
}

