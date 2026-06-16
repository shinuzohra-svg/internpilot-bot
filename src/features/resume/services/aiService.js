export async function tailorResume(profile, jdText, apiKey) {
  if (!apiKey) {
    throw new Error('OpenRouter API Key is missing');
  }

  const prompt = `
You are an expert HR and ATS-optimization assistant.
I am providing my current resume profile and a target Job Description.
Please rewrite my resume "Experience" bullet points to better match the Job Description, highlighting relevant skills.

Current Profile:
${JSON.stringify(profile.experience, null, 2)}

Target Job Description:
${jdText}

Return ONLY a valid JSON array of the updated experience objects. The array must exactly match the structure:
[
  {
    "id": "1",
    "role": "Role Name",
    "company": "Company Name",
    "date": "Date String",
    "bullets": ["tailored bullet 1", "tailored bullet 2"]
  }
]
No markdown formatting or backticks around the JSON. Just raw JSON.
`;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-4-31b-it:free",
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Strip markdown formatting if the model still includes it
    let jsonString = content;
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/```json\n?/, '').replace(/```\n?$/, '');
    }

    const updatedExperience = JSON.parse(jsonString);
    return updatedExperience;
  } catch (error) {
    console.error("Failed to tailor resume:", error);
    throw error;
  }
}
