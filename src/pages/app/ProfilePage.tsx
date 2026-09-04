import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Globe2, Languages, Clock, ShieldCheck, MoreHorizontal, Flag, UserX } from "lucide-react";
import { Avatar, Button, Tabs, VerificationBadge, Dropdown, DropdownItem, Modal, Textarea, EmptyState } from "@/components/ui";
import { RightSidebar } from "@/layouts/AppLayout";
import { ExperienceCard } from "@/components/ExperienceCard";
import { PostCard } from "@/components/PostCard";
import { useDemoStore } from "@/demo/store";
import { useAuth } from "@/hooks/useAuth";
import { experiences as seedExperiences, education as seedEducation, profiles as seedProfiles } from "@/demo/seedData";
import { toast } from "@/components/ui/Toast";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "posts", label: "Posts" },
  { id: "activity", label: "Activity" },
];

export function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const profiles = useDemoStore((s) => s.profiles);
  const posts = useDemoStore((s) => s.posts);
  const sendConnectionRequest = useDemoStore((s) => s.sendConnectionRequest);
  const toggleFollow = useDemoStore((s) => s.toggleFollow);
  const requestContact = useDemoStore((s) => s.requestContact);
  const submitReport = useDemoStore((s) => s.submitReport);

  const isMe = username === "me" || username === user.username;
  const profile = isMe ? profiles.find((p) => p.id === user.id)! : profiles.find((p) => p.username === username);

  const [tab, setTab] = useState("overview");
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  const myExperiences = useMemo(() => (isMe ? seedExperiences : []), [isMe]);
  const myEducation = useMemo(() => (isMe ? seedEducation : []), [isMe]);
  const authoredPosts = useMemo(() => posts.filter((p) => p.authorId === profile?.id), [posts, profile]);
  const mutuals = useMemo(() => seedProfiles.slice(1, 5), []);

  if (!profile) {
    return <EmptyState title="Profile not found" description="This professional's profile isn't available." />;
  }

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
        <div className="h-32 sm:h-44 bg-gradient-to-r from-navy-800 to-navy-600" />
        <div className="px-5 pb-5 sm:px-8 sm:pb-8">
          <div className="-mt-14 sm:-mt-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar src={profile.avatarUrl} name={profile.fullName} size="xl" className="ring-4 ring-white" />
            </div>
            {!isMe && (
              <div className="flex gap-2">
                {profile.connectionStatus === "CONNECTED" ? (
                  <Button variant="secondary" disabled>Connected</Button>
                ) : profile.connectionStatus === "PENDING_OUTGOING" ? (
                  <Button variant="secondary" disabled>Request sent</Button>
                ) : (
                  <Button onClick={() => { sendConnectionRequest(profile.id); toast(`Connection request sent to ${profile.fullName}.`, "success"); }}>Connect</Button>
                )}
                <Button variant="secondary" onClick={() => navigate("/messages")}>Message</Button>
                <Dropdown trigger={<Button variant="secondary" size="icon" aria-label="More options"><MoreHorizontal size={16} /></Button>}>
                  <DropdownItem onClick={() => toggleFollow(profile.id)}>{profile.isFollowing ? "Unfollow" : "Follow"}</DropdownItem>
                  <DropdownItem onClick={() => toast("Profile blocked.", "info")}><UserX size={14} /> Block</DropdownItem>
                  <DropdownItem onClick={() => setReportModalOpen(true)} danger><Flag size={14} /> Report profile</DropdownItem>
                </Dropdown>
              </div>
            )}
            {isMe && <Button variant="secondary" onClick={() => navigate("/profile/edit")}>Edit profile</Button>}
          </div>

          <div className="mt-4 flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-semibold text-navy-800">{profile.fullName}</h1>
            {profile.isVerified && <VerificationBadge size={18} />}
          </div>
          <p className="mt-1 text-ink-700">{profile.headline}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-500"><MapPin size={13} /> {profile.location}</p>
          {profile.about && <p className="mt-3 max-w-2xl text-sm text-ink-600">{profile.about}</p>}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink-100 pt-4 text-sm text-ink-600">
            {profile.yearsExperience !== undefined && <span className="flex items-center gap-1.5"><Clock size={14} /> {profile.yearsExperience}+ years of experience</span>}
            {profile.nationality && <span className="flex items-center gap-1.5"><Globe2 size={14} /> {profile.nationality}</span>}
            {profile.languages && <span className="flex items-center gap-1.5"><Languages size={14} /> {profile.languages.join(", ")}</span>}
          </div>
        </div>
        <Tabs tabs={tabs} active={tab} onChange={setTab} className="px-5 sm:px-8" />
      </div>

      <div className="mt-6 flex gap-6">
        <div className="min-w-0 flex-1 space-y-4">
          {(tab === "overview" || tab === "posts") && (
            authoredPosts.length === 0 ? (
              <EmptyState title="No posts yet." description={`${profile.fullName.split(" ")[0]} hasn't shared any updates.`} />
            ) : (
              authoredPosts.map((p) => <PostCard key={p.id} post={p} />)
            )
          )}
          {(tab === "overview" || tab === "experience") && myExperiences.length > 0 && (
            <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
              <h3 className="mb-4 font-semibold text-navy-800">Experience</h3>
              <div className="space-y-5">{myExperiences.map((e) => <ExperienceCard key={e.id} experience={e} />)}</div>
            </div>
          )}
          {tab === "about" && (
            <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
              <h3 className="mb-2 font-semibold text-navy-800">About</h3>
              <p className="text-sm text-ink-600">{profile.about ?? "No summary added yet."}</p>
            </div>
          )}
          {tab === "education" && (
            <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
              <h3 className="mb-4 font-semibold text-navy-800">Education</h3>
              {myEducation.length === 0 ? <p className="text-sm text-ink-500">No education added yet.</p> : (
                <div className="space-y-4">
                  {myEducation.map((ed) => (
                    <div key={ed.id}>
                      <p className="font-medium text-navy-800 text-sm">{ed.institution}</p>
                      <p className="text-sm text-ink-600">{ed.degree}{ed.field ? `, ${ed.field}` : ""}</p>
                      <p className="text-xs text-ink-400">{ed.startYear} – {ed.endYear ?? "Present"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === "activity" && <EmptyState title="No recent activity" description="Likes, comments and shares will appear here." />}
        </div>

        <RightSidebar>
          {profile.isVerified && (
            <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
              <div className="flex items-center gap-2 text-navy-700"><ShieldCheck size={18} /><p className="font-semibold text-sm">POLITIQ Verified</p></div>
              <p className="mt-1.5 text-xs text-ink-500">This profile is verified</p>
              <div className="mt-3 space-y-1.5 text-xs text-ink-700">
                {profile.verifications.map((v) => (
                  <p key={v} className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-success-500" /> {v.charAt(0) + v.slice(1).toLowerCase()} Verified</p>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink-400">Member since {new Date(profile.memberSince).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
            </div>
          )}

          {!isMe && (
            <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
              <p className="font-semibold text-sm text-navy-800">Contact Access</p>
              <p className="mt-1.5 text-xs text-ink-500">Request direct contact to connect with {profile.fullName.split(" ")[0]}.</p>
              <Button size="sm" className="mt-3 w-full" onClick={() => setContactModalOpen(true)}>Request Contact</Button>
              <p className="mt-2 text-[11px] text-ink-400">Contact requests are reviewed by the recipient. Fees are applicable after approval.</p>
            </div>
          )}

          <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
            <p className="font-semibold text-sm text-navy-800 mb-3">Highlights</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink-500">Years of experience</span><span className="font-medium text-navy-800">{profile.yearsExperience ?? "—"}+</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Connections</span><span className="font-medium text-navy-800">{profile.connectionsCount}+</span></div>
              <div className="flex justify-between"><span className="text-ink-500">Followers</span><span className="font-medium text-navy-800">{profile.followersCount}+</span></div>
            </div>
          </div>

          <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between mb-3"><p className="font-semibold text-sm text-navy-800">Mutual Connections</p></div>
            <div className="flex -space-x-2">
              {mutuals.map((m) => <Avatar key={m.id} src={m.avatarUrl} name={m.fullName} size="sm" className="ring-2 ring-white" />)}
            </div>
            <p className="mt-2 text-xs text-ink-500">and {profile.connectionsCount - mutuals.length} more mutual connections</p>
          </div>
        </RightSidebar>
      </div>

      <Modal open={contactModalOpen} onClose={() => setContactModalOpen(false)} title="Request contact">
        <p className="text-sm text-ink-600 mb-3">Explain why you'd like to connect with {profile.fullName}. They'll review and approve before contact details are shared.</p>
        <Textarea rows={4} placeholder="Add a short message..." value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} />
        <Button
          className="mt-4 w-full"
          onClick={() => {
            requestContact(profile.id, contactMessage);
            setContactModalOpen(false);
            setContactMessage("");
            toast("Contact request sent.", "success");
          }}
        >
          Send request
        </Button>
      </Modal>

      <Modal open={reportModalOpen} onClose={() => setReportModalOpen(false)} title="Report profile">
        <div className="space-y-2">
          {(["Spam", "Fake identity", "Misleading professional information", "Harassment", "Abuse", "Fraud", "Inappropriate content", "Other"] as const).map((c) => (
            <button
              key={c}
              onClick={() => {
                submitReport({ targetType: "PROFILE", targetId: profile.id, targetLabel: profile.fullName, category: c });
                setReportModalOpen(false);
                toast("Report submitted. Our moderation team will review it.", "success");
              }}
              className="block w-full rounded-lg border border-ink-200 px-3 py-2.5 text-left text-sm text-ink-700 hover:border-navy-300 hover:bg-navy-50"
            >
              {c}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
