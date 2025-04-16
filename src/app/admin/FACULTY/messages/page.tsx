'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Message {
  id: number;
  sender: string;
  text: string;
  timestamp: string;
}

interface ChatGroup {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
}

const chatGroups: ChatGroup[] = [
  { id: 1, name: 'Research Group 1', lastMessage: 'Looking forward to it!', time: '10m' },
  { id: 2, name: 'Faculty Meeting', lastMessage: 'Sounds perfect!', time: '40m' },
  { id: 3, name: 'Project Team', lastMessage: 'See you in 5 minutes!', time: '1d' },
  { id: 4, name: 'Alumni', lastMessage: 'Thanks!', time: 'Yesterday' },
];

interface PageProps {
  params: Promise<{ role: string }>;
}

export default function MessagesPage({ params }: PageProps) {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');

  // Resolve params promise (client-side handling)
  const [resolvedParams, setResolvedParams] = useState<{ role: string } | null>(null);
  
  // Resolve params when component mounts
  useState(() => {
    params.then(p => setResolvedParams(p));
  });

  // Load messages based on selected chat (static for now)
  const loadMessages = (chatId: number) => {
    const staticMessages: Record<number, Message[]> = {
      1: [
        { id: 1, sender: 'Researcher A', text: 'Hello everyone!', timestamp: '09:00' },
        { id: 2, sender: 'Researcher B', text: 'Good morning!', timestamp: '09:05' },
      ],
      2: [
        { id: 3, sender: 'Faculty', text: 'Meeting at 3 PM.', timestamp: '10:00' },
        { id: 4, sender: 'Faculty', text: 'Please prepare reports.', timestamp: '10:15' },
      ],
      3: [
        { id: 5, sender: 'Team Member', text: 'Ready for the call?', timestamp: '11:00' },
        { id: 6, sender: 'You', text: 'Yes, joining now.', timestamp: '11:05' },
      ],
      4: [
        { id: 7, sender: 'Alumni', text: 'Thanks for the support!', timestamp: 'Yesterday' },
      ],
    };

    setMessages(staticMessages[chatId] || []);
  };

  const handleSelectChat = (chatId: number) => {
    setSelectedChatId(chatId);
    loadMessages(chatId);
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedChatId) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: 'You',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  // Filter chat groups based on search
  const filteredGroups = chatGroups.filter(group =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateChat = () => {
    alert('Create new chat (functionality to be implemented)');
  };

  if (!resolvedParams) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-background p-4 space-x-4">
      {/* Sidebar with chat groups */}
      <div className="w-1/4 bg-background rounded-lg shadow-lg overflow-y-auto max-h-full flex flex-col">
        {/* Search and + icon */}
        <div className="flex items-center gap-2 p-4 pb-2">
          <Input
            placeholder="Search chats..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleCreateChat}
            aria-label="Create new chat"
            className="ml-2"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        {/* Chat list */}
        <div className="flex-1 flex flex-col gap-1 px-2 pb-2">
          {filteredGroups.length === 0 ? (
            <div className="text-muted-foreground text-sm text-center mt-8">
              No chats found
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div
                key={group.id}
                className={`p-4 cursor-pointer hover:bg-accent rounded-lg ${
                  selectedChatId === group.id ? 'bg-accent' : ''
                }`}
                onClick={() => handleSelectChat(group.id)}
              >
                <div className="font-semibold">{group.name}</div>
                <div className="text-sm text-muted-foreground">{group.lastMessage}</div>
                <div className="text-xs text-gray-500">{group.time}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 bg-card rounded-lg shadow-lg flex flex-col">
      {selectedChatId && (
        <div className="flex items-center gap-4 border-b border-border px-6 py-4">
        {/* Optionally add an avatar/icon here */}
        <div>
            <div className="font-bold text-lg">
            {chatGroups.find(g => g.id === selectedChatId)?.name}
            </div>
            <div className="text-xs text-muted-foreground">
            {/* You can add more info here, e.g., "Group chat" or participant count */}
            Group chat
            </div>
        </div>
        {/* Optionally, add actions (call, info, etc.) on the right */}
        </div>
    )}

        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground mt-20">Select a chat to start messaging</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'You' ? 'items-end' : 'items-start'
                } mb-2`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%] ${
                    msg.sender === 'You'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent text-accent-foreground'
                  }`}
                >
                  <div className="font-semibold">{msg.sender}</div>
                  <div>{msg.text}</div>
                  <div className="text-xs text-gray-400 mt-1">{msg.timestamp}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input box */}
        <div className="p-4 flex gap-2 border-t border-border">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && sendMessage()}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}
