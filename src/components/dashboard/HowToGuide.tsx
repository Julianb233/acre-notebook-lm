'use client';

import { useState } from 'react';
import { Sparkles, MessageSquare, FileText, X, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function HowToGuide() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const steps = [
        {
            icon: FileText,
            title: 'Add Sources',
            description: 'Upload PDF, text, or markdown files to create your knowledge base.',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            action: 'Upload now',
            href: '/documents?upload=true',
        },
        {
            icon: MessageSquare,
            title: 'Chat with Data',
            description: 'Ask questions and get answers grounded in your uploaded sources.',
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            action: 'Start chat',
            href: '/chat',
        },
        {
            icon: Sparkles,
            title: 'Generate Insights',
            description: 'Create briefings, summaries, and reports instantly.',
            color: 'text-orange-600',
            bg: 'bg-orange-50',
            action: 'Try it out',
            href: '/generate',
        },
    ];

    return (
        <section id="guide" className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                    Getting Started
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-gray-900"
                    onClick={() => setIsVisible(false)}
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Dismiss</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {steps.map((step, index) => (
                    <Card key={index} className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className={`w-10 h-10 rounded-lg ${step.bg} flex items-center justify-center mb-4`}>
                                <step.icon className={`h-5 w-5 ${step.color}`} />
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                            <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                                {step.description}
                            </p>
                            <Button asChild variant="link" className={`p-0 h-auto font-medium ${step.color}`}>
                                <Link href={step.href} className="flex items-center gap-1">
                                    {step.action} <ArrowRight className="h-3 w-3" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
