
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useDocument } from '@/hooks/useDocument';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DocumentViewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const { document, url, isLoading, error } = useDocument(id);
    const [textContent, setTextContent] = useState<string | null>(null);

    // Fetch text content if applicable
    useEffect(() => {
        if (document && url && (document.type === 'txt' || document.type === 'md')) {
            fetch(url)
                .then(res => res.text())
                .then(text => setTextContent(text))
                .catch(err => console.error('Failed to fetch text content:', err));
        }
    }, [document, url]);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
                <p className="text-red-600">Failed to load document: {error || 'Document not found'}</p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b bg-white px-4 py-3">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">{document.name}</h1>
                        <p className="text-xs text-muted-foreground uppercase">{document.type} • {document.metadata.size ? (document.metadata.size / 1024 / 1024).toFixed(2) : 0} MB</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {url && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={url} target="_blank" rel="noopener noreferrer" download>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                            </a>
                        </Button>
                    )}
                </div>
            </header>

            {/* Split Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left: Document Viewer */}
                <div className="w-1/2 border-r bg-gray-100 p-4 overflow-hidden flex flex-col">
                    <div className="flex-1 rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col relative">
                        {url ? (
                            <>
                                {document.type === 'pdf' ? (
                                    <iframe src={url} className="h-full w-full border-none" title="PDF Viewer" />
                                ) : document.type === 'txt' || document.type === 'md' ? (
                                    <div className="flex-1 overflow-auto p-8 prose max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-sm">{textContent || 'Loading content...'}</pre>
                                    </div>
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center bg-gray-50">
                                        <div className="rounded-full bg-blue-100 p-4">
                                            <ExternalLink className="h-8 w-8 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">Preview not available</h3>
                                            <p className="text-sm text-gray-500 mt-1">This file type cannot be previewed directly.</p>
                                            <Button variant="link" asChild className="mt-2">
                                                <a href={url} target="_blank" rel="noopener noreferrer">
                                                    Open in new tab
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <p className="text-gray-500">Generating preview...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Chat Interface */}
                <div className="w-1/2 flex flex-col bg-white">
                    <ChatInterface
                        documentIds={[id]} // Contextualize chat to this document
                        initialMessages={[]}
                    />
                </div>
            </div>
        </div>
    );
}
