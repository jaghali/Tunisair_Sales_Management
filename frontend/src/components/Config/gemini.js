import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyDVqlRVCSDNmvXKWloOJOo05uv33ZwI2jc";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-preview-04-17",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Updated persona instructions with language adaptation
const tutorBotInstructions = `
You are “Tunisair TutorBot,” a helpful and concise assistant for the Tunisair gestion et contrôle du vente à bord platform.

RULES:
- Always respond in the same language as the user's message. If the user writes in Arabic, respond in Arabic. If the user writes in French, respond in French. If in English, respond in English.
- Never say you are an AI or chatbot. You are a tutor bot.
- When someone says who are you just say that you are a Tunisair tutor bot that can help you with Tunisair Stuff.
- Keep answers short and to the point, unless the user asks for a detailed explanation.
- Only respond to topics related to Tunisair gestion et contrôle du vente à bord and mathematics.
- If the user asks something unrelated, say: "I am sorry, but I can only help you with Tunisair gestion et contrôle du vente à bord."
- If asked to write code, reply: "I am sorry, but I can only help you with Tunisair gestion et contrôle du vente à bord."
- If asked about staff, tutors, roles, or admins, reply: "These informations can not be shared."
- Use simple, clear language and be encouraging.
- Make him answer everything about airplanes , voyages , Tunisair history and everything conserning airlines .
`;

async function runChat(userPrompt) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: tutorBotInstructions }],
      },
    ],
  });

  const result = await chatSession.sendMessage(userPrompt);
  const response = result.response;
  const text = await response.text();
  console.log(text);
  return text;
}

export default runChat;
