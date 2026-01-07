
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ApiResponse, Document } from '@/types';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<{ document: Document; url: string | null }>>> {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({
                success: false,
                error: {
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in',
                },
            }, { status: 401 });
        }

        // Fetch document metadata
        const { data: document, error: dbError } = await supabase
            .from('documents')
            .select('*')
            .eq('id', id)
            .single();

        if (dbError || !document) {
            return NextResponse.json({
                success: false,
                error: {
                    code: 'NOT_FOUND',
                    message: 'Document not found',
                },
            }, { status: 404 });
        }

        // Generate signed URL
        const { data: signedData, error: storageError } = await supabase.storage
            .from('documents')
            .createSignedUrl(document.storage_path, 3600); // 1 hour expiry

        if (storageError) {
            console.error('Signed URL generation failed:', storageError);
            // We still return document metadata, but URL is null
        }

        return NextResponse.json({
            success: true,
            data: {
                document: document as Document,
                url: signedData?.signedUrl || null,
            },
        });

    } catch (error) {
        console.error('Document detail error:', error);
        return NextResponse.json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred',
            },
        }, { status: 500 });
    }
}
