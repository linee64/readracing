
import { useState, useCallback, useRef } from 'react';
import { generateAIResponse, ChatMessage, BookContext, UserContext } from '@/services/geminiService';

export const useAIChat = (context: BookContext | UserContext, language: string = 'Russian') => {
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
            const responseText = await generateAIResponse(messages, text, context, language);

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
    }, [messages, context, language]);

    const clearHistory = useCallback(() => {
        setMessages([]);
        setError(null);
    }, []);

    return {
        messages,
        setMessages,
        isLoading,
        error,
        sendMessage,
        clearHistory
    };
};
