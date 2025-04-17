'use client';

import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input/input';
import { Buttons } from '@/components/ui/buttons';
import { Plus, Paperclip, Mic, StopCircle } from 'lucide-react';

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
  const [recording, setRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if ((!input.trim() && !selectedFile) || !selectedChatId) return;

    if (input.trim()) {
      const newMsg: Message = {
        id: Date.now(),
        sender: 'You',
        text: input,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      setInput('');
    }

    if (selectedFile) {
      // For demo: just show file name as a message
      const newMsg: Message = {
        id: Date.now() + 1,
        sender: 'You',
        text: `[File] ${selectedFile.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMsg]);
      setSelectedFile(null);
    }
  };

  // Filter chat groups based on search
  const filteredGroups = chatGroups.filter(group =>
    group.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handler for creating a new chat (placeholder)
  const handleCreateChat = () => {
    alert('Create new chat (functionality to be implemented)');
  };

  // File attachment handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Voice recording handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setRecording(true);

      mediaRecorder.current.ondataavailable = (e) => {
        // For demo: log the blob
        console.log('Audio blob:', e.data);
        // You can upload or process the audio blob here
      };
    } catch (err) {
      alert('Microphone access denied or not supported.');
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex h-screen bg-background space-x-3">
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
          <Buttons
            variant="outline"
            size="icon"
            onClick={handleCreateChat}
            aria-label="Create new chat"
            className="ml-2"
          >
            <Plus className="w-5 h-5" />
          </Buttons>
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
        {/* Chat header */}
        {selectedChatId && (
          <div className="flex items-center gap-4 border-b border-border px-6 py-4">
            <div>
              <div className="font-bold text-lg">
                {chatGroups.find(g => g.id === selectedChatId)?.name}
              </div>
              <div className="text-xs text-muted-foreground">
                Group chat
              </div>
            </div>
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

        {/* Input box with attach, voice, and send */}
        <div className="p-4 flex items-center gap-2 border-t border-border">
          {/* File Attachment */}
          

          {/* Message Input */}
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />

          {/* File preview */}
          {selectedFile && (
            <span className="text-xs text-muted-foreground ml-2 truncate max-w-[100px]">
              {selectedFile.name}
            </span>
          )}

<Buttons
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Buttons>

          {/* Voice Recording */}
          <Buttons
            variant={recording ? "destructive" : "ghost"}
            size="icon"
            onClick={recording ? stopRecording : startRecording}
          >
            {recording ? (
              <StopCircle className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </Buttons>

          {/* Send Button */}
          <Buttons onClick={sendMessage}>
            Send
          </Buttons>
        </div>
      </div>
    </div>
  );
}
