const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: content,
  });
  console.log(response.text);
  return response.text;
}

async function generateVector(content) {
  try {
    const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents:
      {
        parts: [{ text: content }]
      }
  ,
    config: {
      outputDimensionality: 768
    }
  });

      return response.embeddings[0].values;
  } catch (err) {
    console.error('Error generating vector:', err);
    return null;
  }
}

module.exports = { generateResponse, generateVector };