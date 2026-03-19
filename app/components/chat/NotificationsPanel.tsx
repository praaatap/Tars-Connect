"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { formatMessageTimestamp } from "../../lib/utils";
import { useRouter } from "next/navigation";

interface NotificationsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onNotificationClick?: (conversationId?: string) => void;
}

export function NotificationsPanel({ isOpen, onClose, onNotificationClick }: NotificationsPanelProps) {
    const notifications = useQuery(api.notifications.getNotifications, {});
    const markAsRead = useMutation(api.notifications.markAsRead);
    const markAllAsRead = useMutation(api.notifications.markAllAsRead);
    const deleteNotification = useMutation(api.notifications.deleteNotification);
    const router = useRouter();

    if (!isOpen) return null;

    const handleNotificationClick = async (notification: any) => {
        // Mark as read
        if (!notification.read) {
            await markAsRead({ notificationId: notification._id });
        }
        
        // Navigate to conversation if applicable
        if (notification.conversationId) {
            if (onNotificationClick) {
                onNotificationClick(notification.conversationId);
            } else {
                // If no callback, navigate to chat page
                router.push('/chat');
            }
        }
        
        onClose();
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'mention':
                return 'ðŸ’¬';
            case 'message':
                return 'ðŸ“©';
            case 'group_invite':
            case 'chat_invite':
                return 'ðŸ‘¥';
            case 'group_added':
                return 'âž•';
            default:
                return 'ðŸ””';
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                onClick={onClose}
            />
            
            {/* Panel */}
            <div className="fixed top-16 right-0 w-full max-w-md h-[calc(100vh-4rem)] bg-white shadow-2xl z-50 flex flex-col border-l border-zinc-200 animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 bg-zinc-50">
                    <h2 className="text-lg font-bold text-zinc-900">Notifications</h2>
                    <div className="flex items-center gap-2">
                        {notifications && notifications.length > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                            >
                                Mark all read
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto">
                    {!notifications || notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8">
                            <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center text-3xl mb-4">
                                ðŸ””
                            </div>
                            <p className="text-zinc-500 font-medium">No notifications yet</p>
                            <p className="text-zinc-400 text-sm mt-1">We'll notify you when something happens</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-zinc-100">
                            {notifications.map((notification: any) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 hover:bg-zinc-50 transition-colors cursor-pointer relative group ${
                                        !notification.read ? 'bg-indigo-50/50' : ''
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    {!notification.read && (
                                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-600 rounded-full" />
                                    )}
                                    
                                    <div className="flex gap-3 ml-4">
                                        {/* Icon/Avatar */}
                                        <div className="shrink-0">
                                            {notification.fromUser?.imageUrl ? (
                                                <img 
                                                    src={notification.fromUser.imageUrl} 
                                                    alt={notification.fromUser.name}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-xl">
                                                    {getNotificationIcon(notification.type)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${
                                                notification.read 
                                                    ? 'text-zinc-700' 
                                                    : 'text-zinc-900'
                                            }`}>
                                                {notification.title}
                                            </p>
                                            {notification.body && (
                                                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                                                    {notification.body}
                                                </p>
                                            )}
                                            <p className="text-xs text-zinc-400 mt-1">
                                                {formatMessageTimestamp(notification.createdAt)}
                                            </p>
                                        </div>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteNotification({ notificationId: notification._id });
                                            }}
                                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-600 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

