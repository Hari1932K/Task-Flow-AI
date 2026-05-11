import { useState } from "react";
import { PageHeader } from "@/components/layout/AppShell";
import { activities, members, type Member } from "@/lib/mock-data";
import { Send, Plus } from "lucide-react";

export function TeamPage() {
  const [team, setTeam] = useState<Member[]>(members);
  const [comments, setComments] = useState([
    { id: "c1", member: members[0], text: "Pushed the latest auth flow — please review when you can.", time: "10m ago" },
    { id: "c2", member: members[1], text: "Looks good! I'll wire up the dashboard charts next.", time: "8m ago" },
    { id: "c3", member: members[2], text: "Updated the empty states across the app.", time: "2h ago" },
  ]);
  const [draft, setDraft] = useState("");

  const send = () => {
    if (!draft.trim()) return;
    setComments((c) => [...c, { id: crypto.randomUUID(), member: team[0], text: draft, time: "just now" }]);
    setDraft("");
  };

  const addMember = () => {
    const n = team.length + 1;
    setTeam((t) => [
      ...t,
      { id: String(n), name: `Teammate ${n}`, role: "Member", initials: `T${n}`, online: false, avatarColor: "from-violet-500 to-fuchsia-500" },
    ]);
  };

  return (
    <div>
      <PageHeader
        title="Team"
        subtitle="Avatars, comments, and an activity timeline for context."
        action={
          <button onClick={addMember} className="px-4 py-2.5 rounded-lg bg-gradient-brand text-white text-sm font-semibold flex items-center gap-2 shadow-glow">
            <Plus size={15} /> Add member
          </button>
        }
      />

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-display font-bold text-lg mb-4">Members</h2>
          <ul className="space-y-3">
            {team.map((m) => (
              <li key={m.id} className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${m.avatarColor} flex items-center justify-center text-white text-sm font-semibold`}>
                    {m.initials}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${m.online ? "bg-success" : "bg-muted-foreground/40"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">{m.role}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 flex flex-col">
          <h2 className="font-display font-bold text-lg mb-4">Comments</h2>
          <div className="space-y-4 flex-1">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${c.member.avatarColor} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
                  {c.member.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{c.member.name}</span>
                    <span className="text-[11px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Write a comment…"
              className="flex-1 bg-white/[0.03] border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-primary/60" />
            <button onClick={send} className="px-4 rounded-lg bg-gradient-brand text-white">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 mt-5">
        <h2 className="font-display font-bold text-lg mb-4">Activity timeline</h2>
        <ol className="relative border-l border-border ml-3 space-y-5">
          {activities.map((a) => {
            const m = members.find((x) => x.name === a.user);
            return (
              <li key={a.id} className="ml-5">
                <span className={`absolute -left-[9px] w-4 h-4 rounded-full bg-gradient-to-br ${m?.avatarColor ?? "from-indigo-500 to-purple-500"} ring-4 ring-card`} />
                <p className="text-sm">
                  <span className="font-semibold">{a.user}</span>{" "}
                  <span className="text-muted-foreground">{a.action}</span>{" "}
                  <span className="font-medium">{a.target}</span>
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.time}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
