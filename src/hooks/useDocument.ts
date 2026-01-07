
import { useState, useEffect } from 'react';
import type { Document, ApiResponse } from '@/types';

interface UseDocumentResult {
    document: Document | null;
    url: string | null;
    isLoading: boolean;
    error: string | null;
}

export function useDocument(documentId: string): UseDocumentResult {
    const [document, setDocument] = useState<Document | null>(null);
    const [url, setUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!documentId) {
            setIsLoading(false);
            return;
        }

        async function fetchDocument() {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/documents/${documentId}`);
                const result: ApiResponse<{ document: Document; url: string | null }> = await response.json();

                if (!result.success) {
                    throw new Error(result.error?.message || 'Failed to fetch document');
                }

                if (result.data) {
                    setDocument(result.data.document);
                    setUrl(result.data.url);
                }
            } catch (err) {
                console.error('Error fetching document:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        }

        fetchDocument();
    }, [documentId]);

    return { document, url, isLoading, error };
}
