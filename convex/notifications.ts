import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get current user helper
async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q: any) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .unique();
}

// Create a notification
export const createNotification = mutation({
  args: {
    userId: v.id("users"),
    type: v.union(
      v.literal("mention"),
      v.literal("message"),
      v.literal("group_invite"),
      v.literal("chat_invite"),
      v.literal("group_added")
    ),
    title: v.string(),
    body: v.optional(v.string()),
    fromUserId: v.optional(v.id("users")),
    conversationId: v.optional(v.id("conversations")),
    messageId: v.optional(v.id("messages")),
    inviteId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      userId: args.userId,
      type: args.type,
      title: args.title,
      body: args.body,
      fromUserId: args.fromUserId,
      conversationId: args.conversationId,
      messageId: args.messageId,
      inviteId: args.inviteId,
      read: false,
      createdAt: Date.now(),
    });
  },
});

// Get all notifications for current user
export const getNotifications = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return [];

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_createdAt", (q: any) =>
        q.eq("userId", currentUser._id)
      )
      .order("desc")
      .take(50);

    // Enrich with sender info
    const enriched = await Promise.all(
      notifications.map(async (notif: any) => {
        let fromUser = null;
        if (notif.fromUserId) {
          const user = await ctx.db.get(notif.fromUserId);
          if (user) {
            fromUser = {
              _id: user._id,
              name: (user as any).name,
              imageUrl: (user as any).imageUrl,
            };
          }
        }
        return {
          ...notif,
          fromUser,
        };
      })
    );

    return enriched;
  },
});

// Get unread notification count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return 0;

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_read_createdAt", (q: any) =>
        q.eq("userId", currentUser._id).eq("read", false)
      )
      .collect();

    return unreadNotifications.length;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, { read: true });
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getCurrentUser(ctx);
    if (!currentUser) return;

    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_read_createdAt", (q: any) =>
        q.eq("userId", currentUser._id).eq("read", false)
      )
      .collect();

    await Promise.all(
      unreadNotifications.map((notif: any) =>
        ctx.db.patch(notif._id, { read: true })
      )
    );
  },
});

// Delete notification
export const deleteNotification = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.notificationId);
  },
});
