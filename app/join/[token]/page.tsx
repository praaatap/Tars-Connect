"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton } from "@clerk/nextjs";
import { useState } from "react";

export default function JoinGroupPage() {
  return (
    <>
      <Authenticated>
        <JoinGroupContent />
      </Authenticated>
      <Unauthenticated>
        <UnauthenticatedView />
      </Unauthenticated>
    </>
  );
}

function JoinGroupContent() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groupInfo = useQuery(api.messages.getGroupByInviteToken, { token });
  const joinGroup = useMutation(api.messages.joinGroupViaLink);

  const handleJoin = async () => {
    setIsJoining(true);
    setError(null);
    try {
      const conversationId = await joinGroup({ token });
      router.push(`/chat?conversation=${conversationId}`);
    } catch (err: any) {
      setError(err.message || "Failed to join group");
      setIsJoining(false);
    }
  };

  if (groupInfo === undefined) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 dark:border-zinc-800 border-t-indigo-600"></div>
      </div>
    );
  }

  if (groupInfo === null) {
    return (
      <div className="h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-6">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 text-center">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Invalid Invite Link</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            This invite link is invalid or has been disabled.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-center">
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">You're Invited!</h1>
        </div>

        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              {groupInfo.name}
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {groupInfo.memberCount} {groupInfo.memberCount === 1 ? 'member' : 'members'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleJoin}
            disabled={isJoining}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
          >
            {isJoining ? "Joining..." : "Join Group"}
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full py-3 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function UnauthenticatedView() {
  return (
    <div className="h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 text-center">
        <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Sign In Required</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Please sign in to join this group.
        </p>
        <SignInButton mode="modal">
          <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Sign In
          </button>
        </SignInButton>
      </div>
    </div>
  );
}
