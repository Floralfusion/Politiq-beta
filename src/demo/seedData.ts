import type {
  Profile, Organisation, Post, Experience, Education, Job, Group, EventItem,
  ConnectionRequest, Conversation, Message, NotificationItem, VerificationRequest,
  ContactRequest, PricingPlan, Report, PaymentRecord, AdminUser, AuditLogEntry, Subscription,
} from "@/types";

const avatar = (seed: number) => `https://i.pravatar.cc/300?img=${seed}`;

export const CURRENT_PROFILE_ID = "p-01";

export const organisations: Organisation[] = [
  { id: "org-1", name: "Bharat Vikas Party", description: "National political party focused on inclusive development and public policy reform.", category: "Political Party", location: "New Delhi, India", website: "https://example-bvp.org", isVerified: true, memberCount: 4820 },
  { id: "org-2", name: "Jan Shakti Party", description: "Regional political party working on grassroots mobilisation and civic engagement.", category: "Political Party", location: "Bengaluru, India", website: "https://example-jsp.org", isVerified: true, memberCount: 2140 },
  { id: "org-3", name: "Lokniti Research Foundation", description: "Independent research foundation studying political communication and public opinion.", category: "Think Tank", location: "New Delhi, India", website: "https://example-lokniti.org", isVerified: true, memberCount: 340 },
  { id: "org-4", name: "Centre for Public Policy", description: "Policy research and advisory institute working with government and civil society.", category: "Think Tank", location: "Mumbai, India", website: "https://example-cpp.org", isVerified: true, memberCount: 512 },
  { id: "org-5", name: "The Daily Ledger", description: "National news publication covering politics, policy and public affairs.", category: "Media", location: "New Delhi, India", website: "https://example-dailyledger.com", isVerified: true, memberCount: 890 },
  { id: "org-6", name: "CampaignWorks Consulting", description: "Political and public affairs consulting firm serving campaigns across India.", category: "Consulting", location: "Bengaluru, India", website: "https://example-campaignworks.com", isVerified: false, memberCount: 65 },
];

type SeedProfile = Profile;

const names = [
  ["Arjun Sharma", "Political Strategist & Campaign Advisor", "Political Consultant", "New Delhi, India", 10],
  ["Meera Iyer", "Policy Analyst at Centre for Public Policy", "Policy Professional", "Mumbai, India", 6],
  ["Rohit Verma", "Political Consultant", "Political Consultant", "Bengaluru, India", 8],
  ["Neha Kapoor", "Media Professional & Communications Lead", "Journalist", "New Delhi, India", 7],
  ["Siddharth Rao", "Researcher, Public Opinion & Elections", "Researcher", "Chennai, India", 5],
  ["Aisha Khan", "Political Analyst", "Political Professional", "Lucknow, India", 4],
  ["Karan Mehta", "Campaign Manager", "Campaign Professional", "Jaipur, India", 9],
  ["Priya Nair", "Public Affairs Lead, CampaignWorks", "Public Affairs", "Kochi, India", 6],
  ["Vikram Singh", "Party Spokesperson", "Party Professional", "Chandigarh, India", 12],
  ["Ananya Desai", "Political Staff — Legislative Office", "Political Staff", "New Delhi, India", 3],
  ["Farhan Ali", "Senior Correspondent, The Daily Ledger", "Journalist", "Mumbai, India", 11],
  ["Divya Menon", "Election Data Analyst", "Researcher", "Bengaluru, India", 5],
  ["Rajeev Kulkarni", "State Secretary, Jan Shakti Party", "Party Professional", "Pune, India", 15],
  ["Sneha Iyer", "Public Policy Researcher", "Policy Professional", "Hyderabad, India", 4],
  ["Aditya Bhatt", "Campaign Field Director", "Campaign Professional", "Ahmedabad, India", 7],
  ["Ritu Chawla", "Public Affairs Consultant", "Public Affairs", "New Delhi, India", 9],
  ["Manish Tiwari", "Political Advisor to Cabinet Office", "Political Professional", "New Delhi, India", 18],
  ["Kavita Reddy", "Editor, Politics Desk", "Journalist", "Hyderabad, India", 13],
  ["Naveen Joshi", "Digital Campaign Strategist", "Campaign Professional", "Dehradun, India", 6],
  ["Ishita Sen", "Legislative Researcher", "Researcher", "Kolkata, India", 3],
  ["Devansh Kapoor", "Party Membership Coordinator", "Party Professional", "Indore, India", 5],
  ["Tanvi Rane", "Communications & Public Relations", "Public Affairs", "Nagpur, India", 8],
  ["Omkar Patil", "Political Consultant", "Political Consultant", "Nashik, India", 10],
  ["Zara Ahmed", "Policy Advisor, Urban Governance", "Policy Professional", "Bhopal, India", 7],
] as const;

const orgAssign = ["org-1", "org-4", "org-6", "org-5", "org-3", undefined, "org-6", "org-6", "org-1", "org-1", "org-5", "org-3", "org-2", "org-4", "org-2", "org-6", "org-1", "org-5", "org-6", "org-3", "org-2", "org-6", "org-6", "org-4"] as const;

export const profiles: SeedProfile[] = names.map((n, i) => {
  const [fullName, headline, category, location, years] = n;
  const verified = i % 3 !== 2; // most verified, some not
  return {
    id: `p-${String(i + 1).padStart(2, "0")}`,
    username: fullName.toLowerCase().replace(/\s+/g, "-") + (i > 0 ? "" : ""),
    fullName,
    headline,
    category: category as Profile["category"],
    organisationId: orgAssign[i],
    organisationName: orgAssign[i] ? organisations.find((o) => o.id === orgAssign[i])?.name : undefined,
    location,
    avatarUrl: avatar((i % 70) + 1),
    coverUrl: undefined,
    about: `${fullName.split(" ")[0]} works across politics and public life with a focus on ${headline.toLowerCase()}. Based in ${location}, with ${years}+ years of professional experience.`,
    yearsExperience: years,
    nationality: "Indian",
    languages: ["English", "Hindi"],
    isVerified: verified,
    verifications: verified ? (i % 2 === 0 ? ["IDENTITY", "PROFESSIONAL", "EXPERIENCE"] : ["IDENTITY", "PROFESSIONAL"]) : [],
    connectionsCount: 200 + i * 37,
    followersCount: 300 + i * 51,
    followingCount: 80 + i * 11,
    memberSince: `202${1 + (i % 5)}-0${1 + (i % 9)}-01`,
    connectionStatus: i === 0 ? "NONE" : (["NONE", "PENDING_OUTGOING", "PENDING_INCOMING", "CONNECTED"] as const)[i % 4],
    isFollowing: i % 3 === 0,
  };
});

export const currentProfile = profiles[0];

export const experiences: Experience[] = [
  { id: "exp-1", profileId: "p-01", organisation: "Bharat Vikas Party", role: "Senior Campaign Advisor", startDate: "2021-01-01", location: "New Delhi, India", description: "Leading campaign strategy, voter outreach, data analytics and communication for state and national level elections.", verified: true },
  { id: "exp-2", profileId: "p-01", organisation: "Jan Shakti Party", role: "Campaign Manager", startDate: "2018-03-01", endDate: "2020-12-01", location: "Karnataka, India", description: "Managed end-to-end election campaigns, booth strategy, volunteer management and constituency analytics.", verified: true },
  { id: "exp-3", profileId: "p-01", organisation: "Lokniti Research Foundation", role: "Research & Strategy Lead", startDate: "2015-07-01", endDate: "2018-02-01", location: "New Delhi, India", description: "Conducted political research, opinion analysis and policy recommendations for parties and public representatives.", verified: true },
  { id: "exp-4", profileId: "p-01", organisation: "Independent", role: "Political Research Fellow", startDate: "2013-06-01", endDate: "2015-06-01", location: "New Delhi, India", description: "Fellowship focused on electoral behaviour research.", verified: false },
  { id: "exp-5", profileId: "p-01", organisation: "Delhi University", role: "Teaching Assistant, Political Science", startDate: "2012-07-01", endDate: "2013-05-01", location: "New Delhi, India", description: "Assisted coursework in comparative politics.", verified: false },
];

export const education: Education[] = [
  { id: "edu-1", profileId: "p-01", institution: "Delhi University", degree: "M.A. Political Science", startYear: 2011, endYear: 2013 },
  { id: "edu-2", profileId: "p-01", institution: "St. Stephen's College", degree: "B.A. (Hons) History", startYear: 2008, endYear: 2011 },
];

const postSeeds: { authorId: string; content: string; likes: number; comments: number; shares: number; hoursAgo: number }[] = [
  { authorId: "p-02", content: "Interesting discussion at the roundtable on youth participation in politics. The new generation brings perspective, energy and the willingness to question the status quo. We need more spaces for meaningful engagement.", likes: 124, comments: 18, shares: 7, hoursAgo: 2 },
  { authorId: "p-03", content: "Honoured to have contributed to the campaign strategy workshop in Bengaluru. Grateful for the insightful conversations with professionals from across the country.", likes: 98, comments: 16, shares: 4, hoursAgo: 5 },
  { authorId: "p-13", content: "We just released our latest report on the state of political communication in India. Analysis covers digital outreach trends and public engagement patterns across the last election cycle.", likes: 156, comments: 22, shares: 12, hoursAgo: 6 },
  { authorId: "p-04", content: "Covered the state assembly session today — a detailed breakdown of the policy debate will be out tomorrow. Public discourse on this issue has shifted noticeably over the last year.", likes: 87, comments: 14, shares: 9, hoursAgo: 9 },
  { authorId: "p-09", content: "Proud to see our constituency outreach programme cross 50,000 direct conversations this quarter. Grassroots engagement remains the most reliable signal we have.", likes: 210, comments: 31, shares: 18, hoursAgo: 14 },
  { authorId: "p-17", content: "Spent the week reviewing policy submissions ahead of the budget session. The quality of civic-sector input this year has been genuinely encouraging.", likes: 143, comments: 12, shares: 5, hoursAgo: 20 },
  { authorId: "p-05", content: "New working paper on voter turnout patterns in urban constituencies is now available. Happy to discuss methodology with anyone working in this space.", likes: 76, comments: 9, shares: 3, hoursAgo: 26 },
];

export const posts: Post[] = postSeeds.map((s, i) => {
  const author = profiles.find((p) => p.id === s.authorId)!;
  return {
    id: `post-${i + 1}`,
    authorId: author.id,
    author: { id: author.id, fullName: author.fullName, headline: author.headline, avatarUrl: author.avatarUrl, isVerified: author.isVerified, username: author.username },
    content: s.content,
    createdAt: new Date(Date.now() - s.hoursAgo * 3600_000).toISOString(),
    likeCount: s.likes,
    commentCount: s.comments,
    shareCount: s.shares,
    likedByMe: false,
    savedByMe: false,
  };
});

export const jobs: Job[] = [
  { id: "job-1", title: "Campaign Field Coordinator", organisationName: "Bharat Vikas Party", location: "New Delhi, India", type: "Full-time", category: "Campaign", description: "Coordinate ground operations for constituency-level campaigns, manage volunteer teams, and report on field metrics to the campaign strategy office.", postedAt: "2026-08-20", applicantCount: 34 },
  { id: "job-2", title: "Policy Research Associate", organisationName: "Centre for Public Policy", location: "Mumbai, India", type: "Full-time", category: "Research", description: "Support senior researchers in drafting policy briefs, literature reviews and stakeholder consultations on urban governance topics.", postedAt: "2026-08-18", applicantCount: 51 },
  { id: "job-3", title: "Public Affairs Consultant", organisationName: "CampaignWorks Consulting", location: "Bengaluru, India", type: "Contract", category: "Consulting", description: "Advise client organisations on regulatory engagement strategy and public affairs positioning across state-level policy issues.", postedAt: "2026-08-25", applicantCount: 19 },
  { id: "job-4", title: "Political Correspondent", organisationName: "The Daily Ledger", location: "New Delhi, India", type: "Full-time", category: "Media", description: "Cover national politics, parliamentary proceedings and election reporting for our politics desk.", postedAt: "2026-08-15", applicantCount: 62 },
  { id: "job-5", title: "Data Analyst — Elections", organisationName: "Lokniti Research Foundation", location: "Remote, India", type: "Part-time", category: "Research", description: "Analyse public opinion survey data and build dashboards tracking electoral trends across states.", postedAt: "2026-08-22", applicantCount: 27 },
  { id: "job-6", title: "Volunteer Coordinator", organisationName: "Jan Shakti Party", location: "Pune, India", type: "Volunteer", category: "Campaign", description: "Recruit, onboard and manage grassroots volunteers ahead of the upcoming municipal elections.", postedAt: "2026-08-27", applicantCount: 12 },
];

export const groups: Group[] = [
  { id: "grp-1", name: "Political Communication Professionals", description: "A community for practitioners working in political communication, messaging and public engagement.", privacy: "PUBLIC", memberCount: 1840, isMember: true },
  { id: "grp-2", name: "Election Data & Analytics", description: "Discussion group for researchers and analysts working on electoral data.", privacy: "PUBLIC", memberCount: 920, isMember: false },
  { id: "grp-3", name: "Public Policy Fellows Network", description: "Private group for alumni of public policy fellowship programmes.", privacy: "PRIVATE", memberCount: 214, isMember: false },
  { id: "grp-4", name: "Campaign Managers India", description: "Peer network for campaign managers to exchange strategy, tools and field experience.", privacy: "PUBLIC", memberCount: 1120, isMember: true },
];

export const events: EventItem[] = [
  { id: "evt-1", title: "Public Policy Forum 2026", description: "Annual forum bringing together policymakers, researchers and civil society on emerging governance challenges.", date: "2026-09-24", time: "10:00 AM", location: "New Delhi, India", organiser: "Centre for Public Policy", attendeeCount: 412, isAttending: false },
  { id: "evt-2", title: "Youth in Politics Summit", description: "A summit for young professionals entering political and public affairs careers.", date: "2026-09-31".replace("09-31","10-01"), time: "11:00 AM", location: "Mumbai, India", organiser: "Lokniti Research Foundation", attendeeCount: 268, isAttending: true },
  { id: "evt-3", title: "Political Communication Workshop", description: "Hands-on workshop covering modern campaign messaging and digital outreach techniques.", date: "2026-10-07", time: "09:30 AM", location: "Bengaluru, India", organiser: "CampaignWorks Consulting", attendeeCount: 95, isAttending: false },
  { id: "evt-4", title: "Election Data Symposium", description: "A symposium on the use of data science in electoral forecasting and voter analysis.", date: "2026-10-14", time: "02:00 PM", location: "Online", onlineLink: "https://meet.example.com/election-data", organiser: "Lokniti Research Foundation", attendeeCount: 180, isAttending: false },
];

export const connectionRequests: ConnectionRequest[] = [
  { id: "cr-1", fromProfile: { id: "p-06", fullName: profiles[5].fullName, headline: profiles[5].headline, avatarUrl: profiles[5].avatarUrl, isVerified: profiles[5].isVerified, username: profiles[5].username }, toProfileId: CURRENT_PROFILE_ID, status: "PENDING", createdAt: new Date(Date.now() - 3600_000 * 4).toISOString() },
  { id: "cr-2", fromProfile: { id: "p-10", fullName: profiles[9].fullName, headline: profiles[9].headline, avatarUrl: profiles[9].avatarUrl, isVerified: profiles[9].isVerified, username: profiles[9].username }, toProfileId: CURRENT_PROFILE_ID, status: "PENDING", createdAt: new Date(Date.now() - 3600_000 * 26).toISOString() },
  { id: "cr-3", fromProfile: { id: "p-19", fullName: profiles[18].fullName, headline: profiles[18].headline, avatarUrl: profiles[18].avatarUrl, isVerified: profiles[18].isVerified, username: profiles[18].username }, toProfileId: CURRENT_PROFILE_ID, status: "PENDING", createdAt: new Date(Date.now() - 3600_000 * 50).toISOString() },
];

export const conversations: Conversation[] = [
  { id: "conv-1", participant: { id: "p-02", fullName: profiles[1].fullName, avatarUrl: profiles[1].avatarUrl, isVerified: profiles[1].isVerified, username: profiles[1].username }, lastMessage: "Sounds great — let's connect after the forum next week.", lastMessageAt: new Date(Date.now() - 3600_000 * 1).toISOString(), unreadCount: 2 },
  { id: "conv-2", participant: { id: "p-03", fullName: profiles[2].fullName, avatarUrl: profiles[2].avatarUrl, isVerified: profiles[2].isVerified, username: profiles[2].username }, lastMessage: "Thanks for sharing the campaign report, very useful.", lastMessageAt: new Date(Date.now() - 3600_000 * 20).toISOString(), unreadCount: 0 },
  { id: "conv-3", participant: { id: "p-13", fullName: profiles[12].fullName, avatarUrl: profiles[12].avatarUrl, isVerified: profiles[12].isVerified, username: profiles[12].username }, lastMessage: "Happy to introduce you to the state secretary's office.", lastMessageAt: new Date(Date.now() - 3600_000 * 48).toISOString(), unreadCount: 1 },
];

export const messages: Message[] = [
  { id: "m-1", conversationId: "conv-1", senderId: "p-02", content: "Hi Arjun, really enjoyed your post on constituency analytics.", createdAt: new Date(Date.now() - 3600_000 * 3).toISOString(), read: true },
  { id: "m-2", conversationId: "conv-1", senderId: CURRENT_PROFILE_ID, content: "Thank you, Meera! Would love to compare notes sometime.", createdAt: new Date(Date.now() - 3600_000 * 2.5).toISOString(), read: true },
  { id: "m-3", conversationId: "conv-1", senderId: "p-02", content: "Sounds great — let's connect after the forum next week.", createdAt: new Date(Date.now() - 3600_000 * 1).toISOString(), read: false },
];

export const notifications: NotificationItem[] = [
  { id: "n-1", type: "CONNECTION_REQUEST", title: "New connection request", body: `${profiles[5].fullName} wants to connect with you.`, createdAt: new Date(Date.now() - 3600_000 * 4).toISOString(), read: false, actorAvatarUrl: profiles[5].avatarUrl },
  { id: "n-2", type: "MESSAGE", title: "New message", body: `${profiles[1].fullName} sent you a message.`, createdAt: new Date(Date.now() - 3600_000 * 1).toISOString(), read: false, actorAvatarUrl: profiles[1].avatarUrl },
  { id: "n-3", type: "VERIFICATION_APPROVED", title: "Verification approved", body: "Your professional verification has been approved.", createdAt: new Date(Date.now() - 3600_000 * 30).toISOString(), read: true },
  { id: "n-4", type: "CONTACT_REQUEST", title: "Contact request received", body: `${profiles[8].fullName} requested your contact details.`, createdAt: new Date(Date.now() - 3600_000 * 40).toISOString(), read: true, actorAvatarUrl: profiles[8].avatarUrl },
  { id: "n-5", type: "FOLLOW", title: "New follower", body: `${profiles[13].fullName} started following you.`, createdAt: new Date(Date.now() - 3600_000 * 60).toISOString(), read: true, actorAvatarUrl: profiles[13].avatarUrl },
];

export const verificationRequests: VerificationRequest[] = [
  { id: "vr-1", type: "IDENTITY", status: "VERIFIED", submittedAt: "2023-01-10", reviewedAt: "2023-01-14", documents: [{ id: "doc-1", fileName: "govt_id.pdf", uploadedAt: "2023-01-10" }] },
  { id: "vr-2", type: "PROFESSIONAL", status: "VERIFIED", submittedAt: "2023-02-01", reviewedAt: "2023-02-06", documents: [{ id: "doc-2", fileName: "employment_letter.pdf", uploadedAt: "2023-02-01" }] },
  { id: "vr-3", type: "EXPERIENCE", status: "VERIFIED", submittedAt: "2023-03-01", reviewedAt: "2023-03-08", documents: [{ id: "doc-3", fileName: "experience_proof.pdf", uploadedAt: "2023-03-01" }] },
  { id: "vr-4", type: "ORGANISATION", status: "NOT_STARTED", documents: [] },
];

export const contactRequestsIncoming: ContactRequest[] = [
  { id: "creq-1", requesterId: "p-09", recipient: { id: CURRENT_PROFILE_ID, fullName: currentProfile.fullName, headline: currentProfile.headline, avatarUrl: currentProfile.avatarUrl, username: currentProfile.username }, status: "REQUESTED", feeInPaise: 29900, createdAt: new Date(Date.now() - 3600_000 * 40).toISOString(), message: "Would like to discuss a potential campaign advisory engagement." },
];

export const contactRequestsOutgoing: ContactRequest[] = [
  { id: "creq-2", requesterId: CURRENT_PROFILE_ID, recipient: { id: "p-17", fullName: profiles[16].fullName, headline: profiles[16].headline, avatarUrl: profiles[16].avatarUrl, username: profiles[16].username }, status: "APPROVED", feeInPaise: 29900, createdAt: new Date(Date.now() - 3600_000 * 100).toISOString() },
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "plan-verified",
    name: "POLITIQ Verified",
    priceInPaise: 99900,
    billingPeriod: "month",
    isActive: true,
    benefits: [
      "Verified badge on your profile",
      "Priority identity verification review",
      "Priority professional verification review",
      "Verified experience highlighting",
      "Higher visibility in Discover and search",
      "Access to premium profile insights",
    ],
  },
];

export const reports: Report[] = [
  { id: "rep-1", targetType: "PROFILE", targetId: "p-08", targetLabel: "Priya Nair", reporterId: "p-11", category: "Misleading professional information", details: "Organisation listed does not match public records.", status: "OPEN", createdAt: new Date(Date.now() - 3600_000 * 12).toISOString() },
  { id: "rep-2", targetType: "POST", targetId: "post-3", targetLabel: "Post by Rajeev Kulkarni", reporterId: "p-04", category: "Spam", status: "OPEN", createdAt: new Date(Date.now() - 3600_000 * 30).toISOString() },
  { id: "rep-3", targetType: "PROFILE", targetId: "p-21", targetLabel: "Devansh Kapoor", reporterId: "p-02", category: "Fake identity", status: "RESOLVED", createdAt: new Date(Date.now() - 3600_000 * 200).toISOString() },
];

export const payments: PaymentRecord[] = [
  { id: "pay-1", orderId: "order_demo_1001", purpose: "POLITIQ_VERIFIED_SUBSCRIPTION", amountInPaise: 99900, status: "SUCCESS", provider: "CASHFREE", createdAt: new Date(Date.now() - 3600_000 * 300).toISOString(), profileName: "Arjun Sharma" },
  { id: "pay-2", orderId: "order_demo_1002", purpose: "CONTACT_ACCESS", amountInPaise: 29900, status: "SUCCESS", provider: "CASHFREE", createdAt: new Date(Date.now() - 3600_000 * 100).toISOString(), profileName: "Arjun Sharma" },
  { id: "pay-3", orderId: "order_demo_1003", purpose: "CONTACT_ACCESS", amountInPaise: 29900, status: "FAILED", provider: "CASHFREE", createdAt: new Date(Date.now() - 3600_000 * 60).toISOString(), profileName: "Vikram Singh" },
];

export const subscriptions: Subscription[] = [
  { id: "sub-1", profileId: CURRENT_PROFILE_ID, plan: "POLITIQ_VERIFIED", status: "ACTIVE", startedAt: "2026-06-02", renewsAt: "2026-10-02", priceInPaise: 99900 },
];

export const adminUsers: AdminUser[] = [
  { id: "admin-1", name: "Sanya Kapoor", email: "sanya.kapoor@politiq.dev", role: "SUPER_ADMIN" },
  { id: "admin-2", name: "Rahul Bansal", email: "rahul.bansal@politiq.dev", role: "VERIFICATION_REVIEWER" },
  { id: "admin-3", name: "Ipsita Ghosh", email: "ipsita.ghosh@politiq.dev", role: "MODERATOR" },
];

export const auditLogs: AuditLogEntry[] = [
  { id: "log-1", actorName: "Rahul Bansal", action: "Approved verification", targetLabel: "Arjun Sharma — Professional", createdAt: new Date(Date.now() - 3600_000 * 5).toISOString() },
  { id: "log-2", actorName: "Ipsita Ghosh", action: "Resolved report", targetLabel: "Report #rep-3", createdAt: new Date(Date.now() - 3600_000 * 40).toISOString() },
  { id: "log-3", actorName: "Sanya Kapoor", action: "Updated pricing", targetLabel: "POLITIQ Verified — ₹999/month", createdAt: new Date(Date.now() - 3600_000 * 120).toISOString() },
];
