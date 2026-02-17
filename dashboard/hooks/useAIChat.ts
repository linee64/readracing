
import { useState, useCallback, useRef } from 'react';
import { generateAIResponse, ChatMessage, BookContext } from '@/services/geminiService';

export const useAIChat = (bookContext: BookContext) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isProcessingRef = useRef(false);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isProcessingRef.current) return;

        isProcessingRef.current = true;
        setIsLoading(true);
        setError(null);

        const newUserMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: text,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, newUserMessage]);

        try {
            // Pass current history + new message implicitly handled by service or we pass explicit history
            // In service implementation we passed 'history' argument. 
            // We should pass the *current* messages state (before the new user message is fully committed to state potentially? 
            // Actually setMessages is async. So using 'prev' in setMessages is good for UI, but for API call we need the list.
            // Let's rely on the messages passed to the hook? No, state inside hook.
            // We'll pass the *current* messages array + the new one.

            const responseText = await generateAIResponse(messages, text, bookContext);

            const newAIMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, newAIMessage]);
        } catch (err: any) {
            setError(err.message || 'Failed to get response');
            console.error(err);
        } finally {
            setIsLoading(false);
            isProcessingRef.current = false;
        }
    }, [messages, bookContext]);

    const clearHistory = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        isLoading,
        error,
        sendMessage,
        clearHistory
    };
};
