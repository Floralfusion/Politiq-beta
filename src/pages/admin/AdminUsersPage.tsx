import { useState } from "react";
import { Link } from "react-router-dom";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { SearchBar, Avatar, Badge, VerificationBadge } from "@/components/ui";
import { profiles } from "@/demo/seedData";

export function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const filtered = profiles.filter((p) => `${p.fullName} ${p.username}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div>
      <AdminPageHeader title="Users" description={`${profiles.length} total users`} />
      <SearchBar value={query} onChange={setQuery} placeholder="Search users" className="max-w-sm mb-4" />
      <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-card">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-100 text-left text-xs text-ink-500">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-ink-50">
                <td className="px-4 py-3">
                  <Link to={`/admin/users/${p.id}`} className="flex items-center gap-2.5">
                    <Avatar src={p.avatarUrl} name={p.fullName} size="sm" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 font-medium text-navy-800">{p.fullName} {p.isVerified && <VerificationBadge size={12} />}</p>
                      <p className="text-xs text-ink-500">@{p.username}</p>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-600">{p.category}</td>
                <td className="px-4 py-3 text-ink-600">{p.location}</td>
                <td className="px-4 py-3">
                  <Badge tone={p.isVerified ? "success" : "neutral"}>{p.isVerified ? "Verified" : "Unverified"}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
