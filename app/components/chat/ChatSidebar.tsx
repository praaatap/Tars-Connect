"use client";

import { useState } from "react";

type ChatItem = {
  name: string;
  message: string;
  time: string;
  active?: boolean;
  unreadCount?: number;
  conversationId?: string;
  isOnline?: boolean;
  imageUrl?: string;
  isGroup?: boolean;
  memberCount?: number;
};

type SearchHistoryItem = {
  _id: string;
  query: string;
  createdAt: number;
};

type ChatSidebarProps = {
  userName: string;
  userStatus: string;
  imageUrl?: string;
  sectionTitle: string;
  searchPlaceholder: string;
  chats: ChatItem[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  searchHistory: SearchHistoryItem[];
  onHistorySelect: (value: string) => void;
  onChatSelect: (conversationId: string) => void;
  onCreateGroup?: () => void;
  suggestedUsers?: any[];
  onUserSelect?: (userId: string) => void;
  onSendChatInvite?: (userId: string) => void;
  pendingChatInvites?: any[];
  onAcceptChatInvite?: (inviteId: string) => void;
  onRejectChatInvite?: (inviteId: string) => void;
  onOpenSettings?: () => void;
};

export function ChatSidebar({
  userName,
  userStatus,
  imageUrl,
  sectionTitle,
  searchPlaceholder,
  chats,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchHistory,
  onHistorySelect,
  onChatSelect,
  onCreateGroup,
  suggestedUsers,
  onUserSelect,
  onSendChatInvite,
  pendingChatInvites,
  onAcceptChatInvite,
  onRejectChatInvite,
  onOpenSettings,
}: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'dms' | 'groups'>('all');

  // Filter chats based on active tab
  const filteredChats = chats.filter(chat => {
    if (activeTab === 'all') return true;
    if (activeTab === 'dms') return !chat.isGroup;
    if (activeTab === 'groups') return chat.isGroup;
    return true;
  });

  const dmCount = chats.filter(c => !c.isGroup).length;
  const groupCount = chats.filter(c => c.isGroup).length;

  return (
    <aside className="flex h-full w-full flex-col bg-white border-zinc-200">

      <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 bg-zinc-50/50">
        <div className="flex items-center gap-3">
          {imageUrl ? (
            <img src={imageUrl} alt={userName} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-200 text-sm font-bold text-indigo-800">
              {userName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-zinc-900">{userName}</p>
            <p className="text-xs text-emerald-500">{userStatus}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateGroup}
            className="p-1.5 text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors cursor-pointer"
            title="Create Group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <button
            onClick={onOpenSettings}
            className="rounded-full bg-zinc-100 p-1.5 text-zinc-500 hover:bg-zinc-200 transition-colors cursor-pointer"
            title="UI Settings"
          >
            âš™
          </button>
        </div>
      </div>

      <div className="px-4 py-3">
        <input
          className="w-full rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-700 outline-none focus:border-indigo-400 text-[14px] placeholder-zinc-400"
          placeholder={searchPlaceholder}
          aria-label="Search conversations"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearchSubmit();
            }
          }}
        />
      </div>

      {/* Filter Tabs */}
      {!searchValue.trim() && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 p-1 bg-zinc-100 rounded-full ">
            <button
              onClick={() => setActiveTab('all')}
              className={`cursor-pointer flex-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'all'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
                }`}
            >
              All {chats.length > 0 && `(${chats.length})`}
            </button>
            <button
              onClick={() => setActiveTab('dms')}
              className={`cursor-pointer flex-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'dms'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
                }`}
            >
              DMs {dmCount > 0 && `(${dmCount})`}
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`cursor-pointer flex-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'groups'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700'
                }`}
            >
              Groups {groupCount > 0 && `(${groupCount})`}
            </button>
          </div>
        </div>
      )}

      {searchHistory.length > 0 ? (
        <div className="px-4 pb-3">
          <p className="pb-2 text-[11px] font-semibold tracking-[0.18em] text-zinc-400">
            RECENT SEARCHES
          </p>
          <div className="flex flex-wrap gap-2" role="list">
            {searchHistory.map((item) => (
              <button
                key={item._id}
                onClick={() => onHistorySelect(item.query)}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
                aria-label={`Search for ${item.query}`}
              >
                {item.query}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <p className="px-4 pb-2 text-[11px] font-semibold tracking-[0.18em] text-zinc-400" id="conversations-heading">
        {sectionTitle}
      </p>

      <div
        className="flex flex-1 flex-col gap-1 overflow-y-auto px-2 pb-4"
        role="list"
        aria-labelledby="conversations-heading"
      >
        {filteredChats.length === 0 ? (
          <div className="flex flex-col">
            <p className="px-2 py-8 text-center text-sm text-zinc-400">
              {searchValue.trim() !== "" ? "No people found" :
                activeTab === 'dms' ? "No direct messages yet" :
                  activeTab === 'groups' ? "No groups yet" :
                    "No conversations yet"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.conversationId}
              onClick={() => chat.conversationId && onChatSelect(chat.conversationId)}
              aria-label={`Chat with ${chat.name}`}
              className={`flex items-start justify-between rounded-xl px-2 py-2 text-left transition cursor-pointer ${chat.active ? "bg-zinc-100" : "hover:bg-zinc-50"
                }`}
            >
              <div className="flex items-start gap-2 flex-1">
                <div className="relative mt-1 shrink-0">
                  {chat.isGroup ? (
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700" aria-hidden="true">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  ) : chat.imageUrl ? (
                    <img src={chat.imageUrl} alt={chat.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-zinc-200" />
                  )}
                  {chat.isOnline && !chat.isGroup && (
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{chat.name}</p>
                    {chat.isGroup && <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1 rounded">Group</span>}
                  </div>
                  <p className="text-xs text-zinc-500 truncate">
                    {chat.isGroup && chat.memberCount ? `${chat.memberCount} members Â· ` : ''}
                    {chat.message}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 pt-1 shrink-0">
                <span className="text-xs text-zinc-400 whitespace-nowrap">{chat.time}</span>
                {chat.unreadCount ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-semibold text-white">
                    {chat.unreadCount}
                  </span>
                ) : null}
              </div>
            </button>
          ))
        )}

        {/* Incoming Chat Requests */}
        {pendingChatInvites && pendingChatInvites.length > 0 && !searchValue.trim() && (
          <div className="mt-4 border-t border-zinc-100 pt-4 px-2">
            <p className="pb-3 text-[11px] font-black tracking-widest text-zinc-400 uppercase flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              Chat Requests
            </p>
            <div className="space-y-2">
              {pendingChatInvites.map((invite: any) => (
                <div
                  key={invite._id}
                  className="flex items-center gap-3 p-4 rounded-2xl border border-indigo-100 bg-indigo-50/40 transition-all hover:bg-indigo-50/70"
                >
                  <div className="relative shrink-0">
                    {invite.fromUserImage ? (
                      <img
                        src={invite.fromUserImage}
                        alt={invite.fromUserName}
                        className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-white shadow-sm">
                        {(invite.fromUserName || "U")[0].toUpperCase()}
                      </div>
                    )}
                    {invite.fromUserOnline && (
                      <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-zinc-900 truncate">{invite.fromUserName}</p>
                    {invite.message ? (
                      <p className="text-[10px] text-zinc-500 truncate italic">"{invite.message}"</p>
                    ) : (
                      <p className="text-[10px] text-zinc-500">wants to chat</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onAcceptChatInvite?.(invite._id)}
                      className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-700 transition-colors cursor-pointer active:scale-95 shadow-sm"
                      title="Accept"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onRejectChatInvite?.(invite._id)}
                      className="h-7 w-7 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors cursor-pointer active:scale-95"
                      title="Decline"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>


  );
}
