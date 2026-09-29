import React, { useState } from 'react';
import { Avatar } from '../components/ui';
import { messages, tutors } from '../data/mockData';

const conversation = [
  { id: 1, from: 'tutor', text: "Good morning, Kwame! Ready for today's session on quadratic equations?", time: '9:45 AM', read: true },
  { id: 2, from: 'student', text: "Good morning Dr. Owusu! Yes, I reviewed the notes you sent. I still have questions about the discriminant.", time: '9:48 AM', read: true },
  { id: 3, from: 'tutor', text: "Great question! The discriminant b²−4ac tells us the nature of the roots. Let's work through some examples in today's session.", time: '9:50 AM', read: true },
  { id: 4, from: 'student', text: "That makes sense! Should I prepare any specific problems before we meet?", time: '9:52 AM', read: true },
  { id: 5, from: 'tutor', text: "Try WASSCE 2022 Paper 1, questions 7-10. Those are excellent practice problems for the discriminant.", time: '9:55 AM', read: true },
  { id: 6, from: 'student', text: "Perfect! I'll do those now. See you at 10 AM. 📚", time: '9:57 AM', read: true },
  { id: 7, from: 'tutor', text: "Great work on today's quadratic equations! You've improved significantly. See you Thursday.", time: '10:32 AM', read: false },
];

export default function MessagingPage() {
  const [selectedContact, setSelectedContact] = useState(messages[0]);
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState(conversation);
  const [search, setSearch] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setLocalMessages(prev => [...prev, { id: Date.now(), from: 'student', text: input.trim(), time: 'Just now', read: false }]);
    setInput('');
  };

  return (
    <div className="fade-in flex h-full" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Contacts list */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold font-display text-slate-900 mb-3">Messages</h2>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1b3d7e]/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {messages.filter(m => !search || m.contact.name.toLowerCase().includes(search.toLowerCase())).map(msg => (
            <div
              key={msg.id}
              onClick={() => setSelectedContact(msg)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors ${selectedContact?.id === msg.id ? 'bg-[#eef2fb]' : 'hover:bg-slate-50'}`}
            >
              <Avatar src={msg.contact.avatar} name={msg.contact.name} size={42} online={msg.online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-slate-900 truncate">{msg.contact.name}</span>
                  <span className="text-[10px] text-slate-400 ml-2 flex-shrink-0">{msg.time}</span>
                </div>
                <p className={`text-xs truncate ${msg.unread > 0 ? 'text-slate-700 font-medium' : 'text-slate-500'}`}>{msg.lastMessage}</p>
              </div>
              {msg.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#f07a22] text-white text-xs flex items-center justify-center font-bold flex-shrink-0 mt-1">{msg.unread}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col bg-slate-50">
          {/* Chat header */}
          <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3">
            <Avatar src={selectedContact.contact.avatar} name={selectedContact.contact.name} size={40} online={selectedContact.online} />
            <div>
              <div className="font-semibold text-slate-900 text-sm">{selectedContact.contact.name}</div>
              <div className="text-xs text-slate-500">{selectedContact.online ? '● Online' : 'Last seen recently'} · {selectedContact.contact.subjects[0]}</div>
            </div>
            <div className="ml-auto flex gap-2">
              <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 text-sm">📅</button>
              <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 text-sm">ℹ️</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="text-center text-xs text-slate-400 bg-white/70 rounded-xl py-1.5 px-4 w-fit mx-auto">Today, September 25</div>
            {localMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === 'student' ? 'justify-end' : 'justify-start'} gap-2.5`}>
                {msg.from === 'tutor' && (
                  <Avatar src={selectedContact.contact.avatar} name={selectedContact.contact.name} size={32} />
                )}
                <div className="max-w-xs lg:max-w-md">
                  <div className={`px-4 py-2.5 text-sm leading-relaxed ${msg.from === 'student' ? 'message-bubble-out' : 'message-bubble-in'}`}>
                    {msg.text}
                  </div>
                  <div className={`text-[10px] text-slate-400 mt-1 ${msg.from === 'student' ? 'text-right' : ''}`}>
                    {msg.time} {msg.from === 'student' && (msg.read ? '✓✓' : '✓')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="bg-white border-t border-slate-100 p-4">
            <div className="flex items-end gap-3">
              <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 flex-shrink-0 text-lg">📎</button>
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-2.5 text-sm resize-none outline-none focus:ring-2 focus:ring-[#1b3d7e]/20 focus:border-[#1b3d7e]"
                  style={{ maxHeight: 120 }}
                />
              </div>
              <button
                onClick={send}
                disabled={!input.trim()}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-[#1b3d7e] text-white flex items-center justify-center hover:bg-[#152e61] disabled:opacity-40 transition-all"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 translate-x-0.5">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-center bg-slate-50">
          <div>
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-lg font-bold font-display text-slate-700 mb-2">Select a conversation</h3>
            <p className="text-slate-500 text-sm">Choose a contact to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
