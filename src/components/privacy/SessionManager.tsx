import { useState, useEffect } from "react";
import { revokeUserSessions } from "@/src/lib/privacyUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Trash2, Clock } from "lucide-react";

interface SessionManagerProps {
  user: any;
}

interface Session {
  id: string;
  device?: string;
  lastActive?: Date;
}

export default function SessionManager({ user }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadSessions();
  }, [user]);

  async function loadSessions() {
    setLoading(true);
    try {
      // Placeholder - would fetch from Firebase
      setSessions([]);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRevokeAll() {
    if (!user) return;
    try {
      await revokeUserSessions(user.uid);
      setSessions([]);
    } catch (error) {
      console.error("Failed to revoke sessions:", error);
    }
  }

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Active Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-slate-500 text-sm">No active sessions found.</p>
        ) : (
          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{s.device || "Unknown"}</Badge>
                  <span className="text-sm text-slate-600">
                    {s.lastActive
                      ? new Date(s.lastActive).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {/* handle revoke single */}}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={handleRevokeAll}
            >
              Revoke All Sessions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
