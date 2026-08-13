import { useParams } from "react-router";
import { trpc } from "@/providers/trpc";

export default function AuditLogPage() {
  const { eventId = "" } = useParams();
  const { data, error } = trpc.throwdown.auditLog.useQuery({ eventId });
  if (error) return <p className="p-8 text-sand-400">{error.message}</p>;
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-sand-100">Audit log</h1>
      <p className="mt-2 text-sm text-sand-500">Append-only. Cup codes are never written here.</p>
      <ol className="mt-8 space-y-3">
        {data?.map((row) => (
          <li key={row.id} className="wec-card p-4 text-sm">
            <p className="font-medium text-sand-100">{row.action.replaceAll("_", " ")}</p>
            <p className="text-xs text-sand-500">
              {row.entityType} {row.entityId} · {new Date(row.createdAt).toISOString()}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
