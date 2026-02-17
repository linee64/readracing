
export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

export interface BookContext {
    title: string;
    author?: string;
    currentChapter?: string;
    currentPage?: number;
    cfiRange?: string; // Current reading position
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const generateAIResponse = async (
    history: ChatMessage[],
    question: string,
    context: BookContext
): Promise<string> => {
    if (!GEMINI_API_KEY) {
        throw new Error('API key not found');
    }

    const systemPrompt = `You are a helpful and knowledgeable reading assistant for the book "${context.title}"${context.author ? ` by ${context.author}` : ''}.
    
    Current Reading Context:
    - Page: ${context.currentPage || 'Unknown'}
    - Chapter: ${context.currentChapter || 'Unknown'}
    
    Your goals:
    1. Answer the user's questions about the book, its characters, plot, and themes.
    2. Provide concise and relevant explanations for terms or concepts.
    3. Avoid spoilers for future events in the book unless explicitly asked.
    4. Maintain a helpful, encouraging, and literary tone.
    5. Respond in the same language as the user's question (likely Russian or English).
    
    User Question: ${question}`;

    // Format history for Gemini API
    // The API expects 'user' and 'model' roles. 
    // We'll limit history to last 10 messages to save tokens/context window if needed, 
    // but Flash has a large window so it's likely fine.
    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

    // Add current turn
    contents.push({
        role: 'user',
        parts: [{ text: systemPrompt }]
    });

    try {
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: contents,
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to generate response');
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('No response content from AI');
        }
    } catch (error) {
        console.error('Gemini API Error:', error);
        throw error;
    }
};
