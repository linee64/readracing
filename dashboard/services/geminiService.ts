// import { ChatMessage, BookContext, UserContext } from './types'; // Removed to avoid build error as they are defined below

// Re-exporting interfaces if they are not in a separate file yet, 
// but based on previous read they were defined in this file.
// I will keep them here for now to avoid breaking imports.

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

export interface UserContext {
    username: string;
    library: any[]; 
    availableBooks?: any[];
}

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const generateAIResponse = async (
    history: ChatMessage[],
    question: string,
    context: BookContext | UserContext,
    language: string = 'Russian' 
): Promise<string> => {
    if (!GEMINI_API_KEY) {
        throw new Error('API key not found');
    }

    let systemPrompt = '';
    const languageInstruction = `Respond in ${language}.`;

    if ('library' in context) {
        // User Context (General Chat)
        const librarySummary = context.library.map((b: any) => 
            `- "${b.title}" by ${b.author} (Page ${b.currentPage}/${b.totalPages}, Status: ${b.currentPage === b.totalPages ? 'Finished' : b.currentPage > 0 ? 'Reading' : 'Not Started'})`
        ).join('\n');
        
        systemPrompt = `You are a smart and personalized reading assistant for ${context.username}.
        
        User's Library:
        ${librarySummary}
        
        Your capabilities:
        1. **Reading Plan**: Create personalized reading plans based on user's pace (e.g., pages per day, best time to read).
        2. **Analysis**: Analyze reading habits based on progress (e.g., getting stuck, reading speed). Suggest easier books if stuck.
        3. **Recommendations**: Suggest books from the library or general knowledge based on reading history.
        4. **General Support**: Answer questions about literature, reading techniques, etc.

        Guidelines:
        - Be encouraging and insightful.
        - If the user asks for a plan, ask for their preferred pace if not known.
        - If the user is stuck on a book (e.g., no progress for a while), suggest a "fast-paced" alternative.
        - Use the provided library data to give specific advice.
        - ${languageInstruction}
        
        User Question: ${question}`;

    } else {
        // Book Context (Specific Book Chat)
        systemPrompt = `You are a helpful and knowledgeable reading assistant for the book "${context.title}"${context.author ? ` by ${context.author}` : ''}.
    
        Current Reading Context:
        - Page: ${context.currentPage || 'Unknown'}
        - Chapter: ${context.currentChapter || 'Unknown'}
        
        Your goals:
        1. Answer the user's questions about the book, its characters, plot, and themes.
        2. Provide concise and relevant explanations for terms or concepts.
        3. Avoid spoilers for future events in the book unless explicitly asked.
        4. Maintain a helpful, encouraging, and literary tone.
        5. ${languageInstruction}
        
        User Question: ${question}`;
    }

    const contents = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));

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
                    maxOutputTokens: 8192,
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

export const explainText = async (
    text: string,
    bookContext: { title: string; author?: string },
    language: string = 'Russian'
): Promise<string> => {
    if (!GEMINI_API_KEY) {
        throw new Error('API key not found');
    }

    const prompt = `
    You are a literary assistant. 
    The user is reading "${bookContext.title}"${bookContext.author ? ` by ${bookContext.author}` : ''}.
    
    Please explain the following text from the book in ${language}:
    "${text}"
    
    Provide a VERY concise explanation of the meaning, context, or significance of this text.
    If it contains difficult words, define them briefly.
    If it refers to a specific concept, explain it simply.
    Keep the explanation short and helpful (max 2-3 sentences).
    Respond in Russian.
    `;

    try {
        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 1024,
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to generate explanation');
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('No response content from AI');
        }
    } catch (error) {
        console.error('Gemini API Error (Explain):', error);
        throw error;
    }
};
