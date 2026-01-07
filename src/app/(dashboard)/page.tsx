'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  Plus,
  ArrowRight,
  MoreVertical,
  Clock,
  Search,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { HowToGuide } from '@/components/dashboard/HowToGuide';
import { formatRelativeTime, formatFileSize } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { recentDocuments, recentChats, isLoading, error } = useDashboardData();

  const filteredDocuments = recentDocuments.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChats = recentChats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-10 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-6">
        <div>
          <h1 className="text-4xl font-serif font-medium text-gray-900 tracking-tight">My Notebook</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your sources and discover insights.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <Input
              placeholder="Search sources & chats..."
              className="pl-10 h-11 bg-white/50 backdrop-blur-sm border-gray-200 focus:bg-white transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-11 px-6 shadow-md shadow-blue-600/20 transition-all hover:scale-105" asChild>
            <Link href="/documents?upload=true">
              <Plus className="h-5 w-5 mr-2" />
              Add Source
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading your notebook...</p>
        </div>
      ) : (
        <>
          {/* How-to Guide */}
          <HowToGuide />

          {/* Sources Grid */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                Recent Sources
              </h2>
              {recentDocuments.length > 0 && (
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium -mr-2" asChild>
                  <Link href="/documents">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>

            {recentDocuments.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-white shadow-sm mb-4">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No sources yet</h3>
                  <p className="text-gray-500 mt-1 mb-6 max-w-sm">Upload documents to start generating insights and chatting with your data.</p>
                  <Button variant="outline" onClick={() => document.getElementById('add-source-btn')?.click()} asChild>
                    <Link href="/documents?upload=true">Upload Document</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* 'Add New' Card */}
                <Link href="/documents?upload=true" className="group">
                  <Card className="h-full border-dashed border-2 border-gray-200 bg-transparent hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px]">
                    <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-blue-600 transition-colors">
                      <div className="p-3 rounded-full bg-white border border-gray-200 shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <Plus className="h-6 w-6" />
                      </div>
                      <span className="font-medium">Add New Source</span>
                    </div>
                  </Card>
                </Link>

                {filteredDocuments.map((source) => (
                  <Card key={source.id} className="group hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border-gray-100 bg-white/80 backdrop-blur-sm cursor-pointer overflow-hidden">
                    <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-xl transition-colors ${source.type === 'pdf' ? 'bg-rose-50 text-rose-500 group-hover:bg-rose-100' :
                            source.type === 'docx' ? 'bg-blue-50 text-blue-500 group-hover:bg-blue-100' :
                              'bg-gray-50 text-gray-500 group-hover:bg-gray-100'
                          }`}>
                          <FileText className="h-6 w-6" />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/documents`}>View</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div>
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 leading-snug group-hover:text-blue-600 transition-colors" title={source.name}>
                          {source.name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge variant="secondary" className="px-1.5 py-0.5 font-medium uppercase tracking-wider text-[10px] bg-gray-100 text-gray-500 border-0 group-hover:bg-white/80">
                            {source.type}
                          </Badge>
                          <span>•</span>
                          <span>{formatFileSize(source.metadata?.size || 0)}</span>
                          <span>•</span>
                          <span>{formatRelativeTime(source.created_at)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Recent Activity / Chats */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                Recent Chats
              </h2>
              {recentChats.length > 0 && (
                <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium -mr-2" asChild>
                  <Link href="/chat">
                    View all <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>

            {recentChats.length === 0 ? (
              <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="p-3 rounded-full bg-white shadow-sm mb-3">
                    <Sparkles className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="font-medium text-gray-900">No chats yet</h3>
                  <Button variant="link" className="text-purple-600 mt-1" asChild>
                    <Link href="/chat">Start a new conversation</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredChats.map((chat) => (
                  <Link key={chat.id} href={`/chat?id=${chat.id}`} className="group block h-full">
                    <div className="flex flex-col h-full p-5 rounded-2xl border border-gray-200 bg-white hover:border-purple-200 hover:shadow-md hover:shadow-purple-500/5 transition-all duration-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors">
                          <MessageSquare className="h-5 w-5" />
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(chat.created_at)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1 group-hover:text-purple-600 transition-colors">
                          {chat.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                          {/* We don't have preview text in the basic conversation type yet, so we use a placeholder or check if extended type has it */}
                          Continue your conversation...
                        </p>
                      </div>

                      <div className="mt-4 flex items-center text-sm font-medium text-purple-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Continue Chat <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
