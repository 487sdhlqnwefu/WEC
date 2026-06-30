import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Navigate } from "react-router";
import {
  Users,
  Trophy,
  Mail,
  ShoppingCart,
  Shield,
  BarChart3,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Admin() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "registrations" | "sponsors" | "contacts" | "products" | "news">("overview");

  // Redirect non-admin users
  if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1410] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1410]">
      {/* Admin Header */}
      <div className="bg-[#140f0b] border-b border-[#3a2a1f]">
        <div className="wec-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-gold" />
              <h1 className="text-lg font-semibold text-sand-100">
                Admin Dashboard
              </h1>
            </div>
            <span className="text-xs text-sand-500">
              Logged in as {user?.name || user?.email}
            </span>
          </div>
        </div>
      </div>

      <div className="wec-container py-6">
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "overview" as const, label: "Overview", icon: BarChart3 },
            { id: "registrations" as const, label: "Registrations", icon: Users },
            { id: "sponsors" as const, label: "Sponsors", icon: Trophy },
            { id: "contacts" as const, label: "Contacts", icon: Mail },
            { id: "products" as const, label: "Products", icon: ShoppingCart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-cinnamon-600 text-sand-100"
                  : "bg-[#231a14] text-sand-400 hover:text-sand-200 border border-[#3a2a1f]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "registrations" && <RegistrationsTab />}
        {activeTab === "sponsors" && <SponsorsTab />}
        {activeTab === "contacts" && <ContactsTab />}
        {activeTab === "products" && <ProductsTab />}
      </div>
    </div>
  );
}

function OverviewTab() {
  const utils = trpc.useUtils();
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Competitor Registrations", value: stats?.competitors ?? 0, icon: Users, color: "text-cinnamon-400" },
    { label: "Judge Registrations", value: stats?.judges ?? 0, icon: Shield, color: "text-gold" },
    { label: "Volunteer Registrations", value: stats?.volunteers ?? 0, icon: Users, color: "text-[#8a9b5c]" },
    { label: "Sponsor Inquiries", value: stats?.sponsors ?? 0, icon: Trophy, color: "text-cinnamon-400" },
    { label: "Orders", value: stats?.orders ?? 0, icon: ShoppingCart, color: "text-gold" },
    { label: "Contact Messages", value: stats?.contacts ?? 0, icon: Mail, color: "text-sand-400" },
    { label: "Users", value: stats?.users ?? 0, icon: Users, color: "text-cinnamon-400" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-sand-100">Dashboard Overview</h2>
        <Button
          size="sm"
          variant="outline"
          className="border-[#3a2a1f] text-sand-400"
          onClick={() => utils.admin.stats.invalidate()}
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="wec-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-2xl font-bold text-sand-100">{stat.value}</span>
            </div>
            <p className="text-sm text-sand-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegistrationsTab() {
  const utils = trpc.useUtils();
  const { data: registrations, isLoading } = trpc.admin.registrations.useQuery();
  const updateMutation = trpc.admin.updateRegistration.useMutation({
    onSuccess: () => utils.admin.registrations.invalidate(),
  });

  if (isLoading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-sand-100 mb-4">All Registrations</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3a2a1f]">
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Email</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Country</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {registrations?.map((reg) => (
              <tr key={reg.id} className="border-b border-[#3a2a1f]/50 hover:bg-white/[0.02]">
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                    reg.type === "competitor" ? "bg-cinnamon-900/30 text-cinnamon-400" :
                    reg.type === "judge" ? "bg-gold/10 text-gold" :
                    "bg-[#3E3F24]/30 text-[#8a9b5c]"
                  }`}>
                    {reg.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sand-300">{reg.fullName}</td>
                <td className="py-3 px-4 text-sand-500">{reg.email}</td>
                <td className="py-3 px-4 text-sand-500">{reg.country}</td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1 text-xs ${
                    reg.status === "approved" ? "text-green-400" :
                    reg.status === "rejected" ? "text-red-400" :
                    reg.status === "waitlist" ? "text-yellow-400" :
                    "text-sand-500"
                  }`}>
                    {reg.status === "approved" ? <CheckCircle className="w-3 h-3" /> :
                     reg.status === "rejected" ? <XCircle className="w-3 h-3" /> :
                     <Clock className="w-3 h-3" />}
                    {reg.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sand-600">
                  {reg.createdAt ? new Date(reg.createdAt).toLocaleDateString() : "N/A"}
                </td>
                <td className="py-3 px-4">
                  <select
                    value={reg.status ?? "pending"}
                    onChange={(e) => updateMutation.mutate({ id: reg.id, status: e.target.value as "pending" | "approved" | "rejected" | "waitlist" })}
                    className="wec-input text-xs px-2 py-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="waitlist">Waitlist</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SponsorsTab() {
  const utils = trpc.useUtils();
  const { data: sponsors, isLoading } = trpc.admin.sponsors.useQuery();
  const updateMutation = trpc.admin.updateSponsor.useMutation({
    onSuccess: () => utils.admin.sponsors.invalidate(),
  });

  if (isLoading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-sand-100 mb-4">Sponsor Inquiries</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3a2a1f]">
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Company</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Contact</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Tier</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Date</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sponsors?.map((s) => (
              <tr key={s.id} className="border-b border-[#3a2a1f]/50 hover:bg-white/[0.02]">
                <td className="py-3 px-4 text-sand-300">{s.companyName}</td>
                <td className="py-3 px-4 text-sand-500">{s.contactName}<br/><span className="text-xs">{s.email}</span></td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gold/10 text-gold capitalize">
                    {s.tier}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs capitalize ${
                    s.status === "closed" ? "text-green-400" :
                    s.status === "lost" ? "text-red-400" :
                    s.status === "negotiating" ? "text-cinnamon-400" :
                    "text-sand-500"
                  }`}>{s.status}</span>
                </td>
                <td className="py-3 px-4 text-sand-600">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "N/A"}</td>
                <td className="py-3 px-4">
                  <select
                    value={s.status ?? "new"}
                    onChange={(e) => updateMutation.mutate({ id: s.id, status: e.target.value as "new" | "contacted" | "negotiating" | "closed" | "lost" })}
                    className="wec-input text-xs px-2 py-1 rounded"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="closed">Closed</option>
                    <option value="lost">Lost</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ContactsTab() {
  const utils = trpc.useUtils();
  const { data: contacts, isLoading } = trpc.admin.contacts.useQuery();
  const updateMutation = trpc.admin.updateContact.useMutation({
    onSuccess: () => utils.admin.contacts.invalidate(),
  });

  if (isLoading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-sand-100 mb-4">Contact Submissions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3a2a1f]">
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Type</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Subject</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Message</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts?.map((c) => (
              <tr key={c.id} className="border-b border-[#3a2a1f]/50 hover:bg-white/[0.02]">
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-cinnamon-950/50 text-cinnamon-400 capitalize">
                    {c.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sand-300">{c.name}<br/><span className="text-xs text-sand-500">{c.email}</span></td>
                <td className="py-3 px-4 text-sand-500">{c.subject || "N/A"}</td>
                <td className="py-3 px-4 text-sand-500 max-w-xs truncate">{c.message}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs capitalize ${
                    c.status === "replied" ? "text-green-400" :
                    c.status === "archived" ? "text-sand-600" :
                    c.status === "read" ? "text-cinnamon-400" :
                    "text-yellow-400"
                  }`}>{c.status}</span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={c.status ?? "new"}
                    onChange={(e) => updateMutation.mutate({ id: c.id, status: e.target.value as "new" | "read" | "replied" | "archived" })}
                    className="wec-input text-xs px-2 py-1 rounded"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="archived">Archived</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductsTab() {
  const utils = trpc.useUtils();
  const { data: products, isLoading } = trpc.admin.products.useQuery();
  const updateMutation = trpc.admin.updateProduct.useMutation({
    onSuccess: () => utils.admin.products.invalidate(),
  });

  if (isLoading) return <div className="text-center py-20"><div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <h2 className="text-lg font-semibold text-sand-100 mb-4">Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#3a2a1f]">
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Name</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Champion</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Price</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Stock</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Status</th>
              <th className="text-left py-3 px-4 text-sand-500 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((p) => (
              <tr key={p.id} className="border-b border-[#3a2a1f]/50 hover:bg-white/[0.02]">
                <td className="py-3 px-4 text-sand-300">{p.name}</td>
                <td className="py-3 px-4 text-sand-500">{p.championName || "N/A"}</td>
                <td className="py-3 px-4 text-gold">€{p.price}</td>
                <td className="py-3 px-4 text-sand-500">{p.stock}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs ${p.isActive ? "text-green-400" : "text-red-400"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#3a2a1f] text-sand-400 text-xs"
                    onClick={() => updateMutation.mutate({ id: p.id, data: { isActive: !p.isActive } })}
                  >
                    {p.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
