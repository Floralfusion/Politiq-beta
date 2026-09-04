import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as seed from "./seedData";
import type {
  Profile, Post, ConnectionRequest, Conversation, Message, NotificationItem,
  VerificationRequest, ContactRequest, Report, PaymentRecord, Subscription,
  PricingPlan, VerificationType, EventItem, Group,
} from "@/types";

interface DemoState {
  profiles: Profile[];
  posts: Post[];
  connectionRequests: ConnectionRequest[];
  conversations: Conversation[];
  messages: Message[];
  notifications: NotificationItem[];
  verificationRequests: VerificationRequest[];
  contactRequestsIncoming: ContactRequest[];
  contactRequestsOutgoing: ContactRequest[];
  reports: Report[];
  payments: PaymentRecord[];
  subscriptions: Subscription[];
  pricingPlans: PricingPlan[];
  events: EventItem[];
  groups: Group[];
  currentUserSignedIn: boolean;
  onboardingComplete: boolean;

  // actions
  signIn: () => void;
  signOut: () => void;
  completeOnboarding: () => void;
  toggleFollow: (profileId: string) => void;
  sendConnectionRequest: (profileId: string) => void;
  respondToConnectionRequest: (requestId: string, accept: boolean) => void;
  cancelOutgoingConnection: (profileId: string) => void;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  createPost: (content: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markConversationRead: (conversationId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  submitVerification: (type: VerificationType, fileName: string) => void;
  adminReviewVerification: (id: string, approve: boolean, reason?: string) => void;
  requestContact: (recipientId: string, message: string) => void;
  respondToContactRequest: (id: string, approve: boolean) => void;
  markContactPaid: (id: string) => void;
  submitReport: (report: Omit<Report, "id" | "status" | "createdAt" | "reporterId">) => void;
  adminResolveReport: (id: string, action: "RESOLVED" | "DISMISSED") => void;
  createPayment: (payment: Omit<PaymentRecord, "id" | "createdAt">) => PaymentRecord;
  updatePricingPlan: (id: string, priceInPaise: number, benefits: string[]) => void;
  toggleGroupMembership: (groupId: string) => void;
  toggleEventAttendance: (eventId: string) => void;
  resetDemoData: () => void;
}

const initialState = {
  profiles: seed.profiles,
  posts: seed.posts,
  connectionRequests: seed.connectionRequests,
  conversations: seed.conversations,
  messages: seed.messages,
  notifications: seed.notifications,
  verificationRequests: seed.verificationRequests,
  contactRequestsIncoming: seed.contactRequestsIncoming,
  contactRequestsOutgoing: seed.contactRequestsOutgoing,
  reports: seed.reports,
  payments: seed.payments,
  subscriptions: seed.subscriptions,
  pricingPlans: seed.pricingPlans,
  events: seed.events,
  groups: seed.groups,
  currentUserSignedIn: false,
  onboardingComplete: false,
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      ...initialState,

      signIn: () => set({ currentUserSignedIn: true }),
      signOut: () => set({ currentUserSignedIn: false }),
      completeOnboarding: () => set({ onboardingComplete: true }),

      toggleFollow: (profileId) =>
        set((s) => ({
          profiles: s.profiles.map((p) =>
            p.id === profileId
              ? { ...p, isFollowing: !p.isFollowing, followersCount: p.followersCount + (p.isFollowing ? -1 : 1) }
              : p
          ),
        })),

      sendConnectionRequest: (profileId) =>
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === profileId ? { ...p, connectionStatus: "PENDING_OUTGOING" } : p)),
        })),

      cancelOutgoingConnection: (profileId) =>
        set((s) => ({
          profiles: s.profiles.map((p) => (p.id === profileId ? { ...p, connectionStatus: "NONE" } : p)),
        })),

      respondToConnectionRequest: (requestId, accept) =>
        set((s) => {
          const req = s.connectionRequests.find((r) => r.id === requestId);
          if (!req) return {};
          return {
            connectionRequests: s.connectionRequests.map((r) =>
              r.id === requestId ? { ...r, status: accept ? "ACCEPTED" : "DECLINED" } : r
            ),
            profiles: s.profiles.map((p) =>
              p.id === req.fromProfile.id ? { ...p, connectionStatus: accept ? "CONNECTED" : "NONE" } : p
            ),
          };
        }),

      toggleLike: (postId) =>
        set((s) => ({
          posts: s.posts.map((p) =>
            p.id === postId
              ? { ...p, likedByMe: !p.likedByMe, likeCount: p.likeCount + (p.likedByMe ? -1 : 1) }
              : p
          ),
        })),

      toggleSave: (postId) =>
        set((s) => ({
          posts: s.posts.map((p) => (p.id === postId ? { ...p, savedByMe: !p.savedByMe } : p)),
        })),

      createPost: (content) =>
        set((s) => ({
          posts: [
            {
              id: `post-local-${Date.now()}`,
              authorId: seed.CURRENT_PROFILE_ID,
              author: {
                id: seed.currentProfile.id,
                fullName: seed.currentProfile.fullName,
                headline: seed.currentProfile.headline,
                avatarUrl: seed.currentProfile.avatarUrl,
                isVerified: seed.currentProfile.isVerified,
                username: seed.currentProfile.username,
              },
              content,
              createdAt: new Date().toISOString(),
              likeCount: 0,
              commentCount: 0,
              shareCount: 0,
              likedByMe: false,
              savedByMe: false,
            },
            ...s.posts,
          ],
        })),

      sendMessage: (conversationId, content) =>
        set((s) => ({
          messages: [
            ...s.messages,
            { id: `m-local-${Date.now()}`, conversationId, senderId: seed.CURRENT_PROFILE_ID, content, createdAt: new Date().toISOString(), read: true },
          ],
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, lastMessage: content, lastMessageAt: new Date().toISOString() } : c
          ),
        })),

      markConversationRead: (conversationId) =>
        set((s) => ({
          conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
        })),

      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

      markAllNotificationsRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      submitVerification: (type, fileName) =>
        set((s) => ({
          verificationRequests: s.verificationRequests.map((v) =>
            v.type === type
              ? {
                  ...v,
                  status: "UNDER_REVIEW",
                  submittedAt: new Date().toISOString(),
                  documents: [...v.documents, { id: `doc-local-${Date.now()}`, fileName, uploadedAt: new Date().toISOString() }],
                }
              : v
          ),
        })),

      adminReviewVerification: (id, approve, reason) =>
        set((s) => ({
          verificationRequests: s.verificationRequests.map((v) =>
            v.id === id
              ? { ...v, status: approve ? "VERIFIED" : "REJECTED", reviewedAt: new Date().toISOString(), rejectionReason: approve ? undefined : reason }
              : v
          ),
        })),

      requestContact: (recipientId, message) =>
        set((s) => {
          const recipient = s.profiles.find((p) => p.id === recipientId);
          if (!recipient) return {};
          return {
            contactRequestsOutgoing: [
              {
                id: `creq-local-${Date.now()}`,
                requesterId: seed.CURRENT_PROFILE_ID,
                recipient: { id: recipient.id, fullName: recipient.fullName, headline: recipient.headline, avatarUrl: recipient.avatarUrl, username: recipient.username },
                status: "REQUESTED",
                feeInPaise: 29900,
                createdAt: new Date().toISOString(),
                message,
              },
              ...s.contactRequestsOutgoing,
            ],
          };
        }),

      respondToContactRequest: (id, approve) =>
        set((s) => ({
          contactRequestsIncoming: s.contactRequestsIncoming.map((c) =>
            c.id === id ? { ...c, status: approve ? "APPROVED" : "DECLINED" } : c
          ),
        })),

      markContactPaid: (id) =>
        set((s) => ({
          contactRequestsOutgoing: s.contactRequestsOutgoing.map((c) =>
            c.id === id ? { ...c, status: "CONTACT_UNLOCKED" } : c
          ),
        })),

      submitReport: (report) =>
        set((s) => ({
          reports: [
            { ...report, id: `rep-local-${Date.now()}`, status: "OPEN", createdAt: new Date().toISOString(), reporterId: seed.CURRENT_PROFILE_ID },
            ...s.reports,
          ],
        })),

      adminResolveReport: (id, action) =>
        set((s) => ({ reports: s.reports.map((r) => (r.id === id ? { ...r, status: action } : r)) })),

      createPayment: (payment) => {
        const record: PaymentRecord = { ...payment, id: `pay-local-${Date.now()}`, createdAt: new Date().toISOString() };
        set((s) => ({ payments: [record, ...s.payments] }));
        return record;
      },

      updatePricingPlan: (id, priceInPaise, benefits) =>
        set((s) => ({
          pricingPlans: s.pricingPlans.map((pl) => (pl.id === id ? { ...pl, priceInPaise, benefits } : pl)),
        })),

      toggleGroupMembership: (groupId) =>
        set((s) => ({
          groups: s.groups.map((g) =>
            g.id === groupId ? { ...g, isMember: !g.isMember, memberCount: g.memberCount + (g.isMember ? -1 : 1) } : g
          ),
        })),

      toggleEventAttendance: (eventId) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === eventId ? { ...e, isAttending: !e.isAttending, attendeeCount: e.attendeeCount + (e.isAttending ? -1 : 1) } : e
          ),
        })),

      resetDemoData: () => set({ ...initialState }),
    }),
    { name: "politiq-demo-store", version: 1 }
  )
);
