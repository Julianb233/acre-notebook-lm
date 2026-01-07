import { useState, useEffect, useCallback } from 'react';
import { Document, ApiResponse, Conversation } from '@/types';

interface DashboardData {
    recentDocuments: Document[];
    recentChats: Conversation[];
    isLoading: boolean;
    error: string | null;
    refresh: () => void;
}

export function useDashboardData(): DashboardData {
    const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
    const [recentChats, setRecentChats] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch Documents
            const docsResponse = await fetch('/api/documents/upload');
            const docsResult: ApiResponse<Document[]> = await docsResponse.json();

            if (!docsResult.success) {
                throw new Error(docsResult.error?.message || 'Failed to fetch documents');
            }

            // Sort by created_at desc and take top 5
            const docs = docsResult.data || [];
            const sortedDocs = [...docs].sort((a, b) =>
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            ).slice(0, 5);

            setRecentDocuments(sortedDocs);

            // Fetch Recent Chats
            const chatsResponse = await fetch('/api/chat');
            const chatsResult = await chatsResponse.json();

            if (chatsResult.error) {
                throw new Error(chatsResult.error || 'Failed to fetch chats');
            }

            // Types for chat response are a bit loose in current API implementation, adapt as needed
            const chats = (chatsResult.conversations || []) as Conversation[];
            setRecentChats(chats.slice(0, 3)); // Top 3 chats

        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            // We don't want to break the whole dashboard if one fails, but let's set a generic error state if needed
            // For now, we'll just log it and potentially show empty states
            setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        recentDocuments,
        recentChats,
        isLoading,
        error,
        refresh: fetchData
    };
}
