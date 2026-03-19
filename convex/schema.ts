import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    lastSeenAt: v.number(),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .searchIndex("search_name", {
      searchField: "name",
    }),

  userSearchHistory: defineTable({
    userId: v.id("users"),
    query: v.string(),
    createdAt: v.number(),
  })
    .index("by_user_createdAt", ["userId", "createdAt"])
    .index("by_user_query", ["userId", "query"]),

  conversations: defineTable({
    participants: v.array(v.id("users")),
    isGroup: v.optional(v.boolean()),
    name: v.optional(v.string()),
    lastMessageAt: v.number(),
    lastMessage: v.optional(v.string()),
    lastMessageSenderId: v.optional(v.id("users")),
    typing: v.optional(v.record(v.string(), v.number())),
    lastReadAt: v.optional(v.record(v.string(), v.number())),
    hiddenBy: v.optional(v.array(v.id("users"))),
    inviteToken: v.optional(v.string()),
    inviteEnabled: v.optional(v.boolean()),
  })
    .index("by_participants", ["participants"])
    .index("by_invite_token", ["inviteToken"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    body: v.string(),
    createdAt: v.number(),
    deleted: v.optional(v.boolean()),
    reactions: v.optional(v.record(v.string(), v.string())),
    replyTo: v.optional(v.string()),
    replyToUser: v.optional(v.string()),
    mediaUrl: v.optional(v.string()),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("video"))),
    mediaStorageId: v.optional(v.id("_storage")),
    mentions: v.optional(v.array(v.id("users"))),
    messageType: v.optional(v.union(v.literal("text"), v.literal("poll"))),
    poll: v.optional(
      v.object({
        question: v.string(),
        options: v.array(
          v.object({
            id: v.string(),
            text: v.string(),
          })
        ),
        votes: v.record(v.string(), v.string()),
        allowMultipleVotes: v.optional(v.boolean()),
      })
    ),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_createdAt", ["conversationId", "createdAt"]),

  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("mention"),
      v.literal("message"),
      v.literal("group_invite"),
      v.literal("chat_invite"),
      v.literal("group_added")
    ),
    read: v.boolean(),
    createdAt: v.number(),
    fromUserId: v.optional(v.id("users")),
    conversationId: v.optional(v.id("conversations")),
    messageId: v.optional(v.id("messages")),
    inviteId: v.optional(v.string()),
    title: v.string(),
    body: v.optional(v.string()),
  })
    .index("by_user_read_createdAt", ["userId", "read", "createdAt"])
    .index("by_user_createdAt", ["userId", "createdAt"]),

  groupChatInvites: defineTable({
    conversationId: v.id("conversations"),
    invitedUserId: v.id("users"),
    invitedByUserId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
    message: v.optional(v.string()), // invite messages
    createdAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index("by_invited_user_status", ["invitedUserId", "status"])
    .index("by_conversation_status", ["conversationId", "status"]),

  chatInvites: defineTable({
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("rejected")),
    message: v.optional(v.string()),
    createdAt: v.number(),
    respondedAt: v.optional(v.number()),
  })
    .index("by_to_user_status", ["toUserId", "status"])
    .index("by_from_user_status", ["fromUserId", "status"]),
});