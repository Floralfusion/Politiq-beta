// ── Core domain types shared across the app ────────────────────────────────

export type ProfessionalCategory =
  | "Political Professional"
  | "Political Staff"
  | "Campaign Professional"
  | "Political Consultant"
  | "Party Professional"
  | "Public Affairs"
  | "Policy Professional"
  | "Journalist"
  | "Researcher"
  | "Organisation";

export type VerificationType = "IDENTITY" | "PROFESSIONAL" | "ORGANISATION" | "EXPERIENCE";

export type VerificationStatus =
  | "NOT_STARTED"
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED"
  | "NEEDS_MORE_INFORMATION"
  | "EXPIRED";

export type ConnectionStatus = "NONE" | "PENDING_OUTGOING" | "PENDING_INCOMING" | "CONNECTED";

export type ContactRequestStatus =
  | "REQUESTED"
  | "APPROVED"
  | "DECLINED"
  | "EXPIRED"
  | "CANCELLED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "CONTACT_UNLOCKED";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "VERIFICATION_REVIEWER" | "MODERATOR" | "SUPPORT";

export interface Profile {
  id: string;
  username: string;
  fullName: string;
  headline: string;
  category: ProfessionalCategory;
  organisationName?: string;
  organisationId?: string;
  location: string;
  avatarUrl?: string;
  coverUrl?: string;
  about?: string;
  yearsExperience?: number;
  nationality?: string;
  languages?: string[];
  isVerified: boolean;
  verifications: VerificationType[];
  connectionsCount: number;
  followersCount: number;
  followingCount: number;
  memberSince: string;
  connectionStatus: ConnectionStatus;
  isFollowing: boolean;
}

export interface Experience {
  id: string;
  profileId: string;
  organisation: string;
  role: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  verified: boolean;
}

export interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  field?: string;
  startYear: number;
  endYear?: number;
}

export interface Organisation {
  id: string;
  name: string;
  logoUrl?: string;
  description: string;
  category: string;
  location: string;
  website?: string;
  isVerified: boolean;
  memberCount: number;
}

export interface Post {
  id: string;
  authorId: string;
  author: Pick<Profile, "id" | "fullName" | "headline" | "avatarUrl" | "isVerified" | "username">;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  likedByMe: boolean;
  savedByMe: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  createdAt: string;
}

export interface ConnectionRequest {
  id: string;
  fromProfile: Pick<Profile, "id" | "fullName" | "headline" | "avatarUrl" | "isVerified" | "username">;
  toProfileId: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
}

export interface Conversation {
  id: string;
  participant: Pick<Profile, "id" | "fullName" | "avatarUrl" | "isVerified" | "username">;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface VerificationRequest {
  id: string;
  type: VerificationType;
  status: VerificationStatus;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  documents: { id: string; fileName: string; uploadedAt: string }[];
}

export interface ContactRequest {
  id: string;
  requesterId: string;
  recipient: Pick<Profile, "id" | "fullName" | "headline" | "avatarUrl" | "username">;
  status: ContactRequestStatus;
  feeInPaise: number;
  createdAt: string;
  message?: string;
}

export interface Job {
  id: string;
  title: string;
  organisationName: string;
  organisationLogoUrl?: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Volunteer";
  category: string;
  description: string;
  postedAt: string;
  applicantCount: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverUrl?: string;
  privacy: "PUBLIC" | "PRIVATE";
  memberCount: number;
  isMember: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  onlineLink?: string;
  organiser: string;
  attendeeCount: number;
  isAttending: boolean;
}

export interface NotificationItem {
  id: string;
  type:
    | "CONNECTION_REQUEST"
    | "CONNECTION_ACCEPTED"
    | "MESSAGE"
    | "FOLLOW"
    | "CONTACT_REQUEST"
    | "CONTACT_APPROVED"
    | "PAYMENT_CONFIRMED"
    | "VERIFICATION_SUBMITTED"
    | "VERIFICATION_APPROVED"
    | "VERIFICATION_REJECTED"
    | "JOB"
    | "EVENT"
    | "GROUP";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  actorAvatarUrl?: string;
}

export interface Subscription {
  id: string;
  profileId: string;
  plan: "POLITIQ_VERIFIED";
  status: "ACTIVE" | "CANCELLED" | "EXPIRED" | "PAST_DUE";
  startedAt: string;
  renewsAt: string;
  priceInPaise: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  priceInPaise: number;
  billingPeriod: "month" | "year";
  benefits: string[];
  isActive: boolean;
}

export interface Report {
  id: string;
  targetType: "PROFILE" | "POST" | "COMMENT" | "MESSAGE" | "GROUP" | "JOB" | "EVENT";
  targetId: string;
  targetLabel: string;
  reporterId: string;
  category: "Spam" | "Fake identity" | "Misleading professional information" | "Harassment" | "Abuse" | "Fraud" | "Inappropriate content" | "Other";
  details?: string;
  status: "OPEN" | "RESOLVED" | "DISMISSED";
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  purpose: "CONTACT_ACCESS" | "POLITIQ_VERIFIED_SUBSCRIPTION";
  amountInPaise: number;
  status: PaymentStatus;
  provider: "CASHFREE";
  createdAt: string;
  profileName: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface AuditLogEntry {
  id: string;
  actorName: string;
  action: string;
  targetLabel: string;
  createdAt: string;
}
