import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const allowedRoles = ["admissions_officer", "admin", "super_admin"];
  if (!allowedRoles.includes(user.role)) {
    redirect("/dashboard");
  }

  // Map roles for cleaner display
  const roleDisplay: Record<string, string> = {
    admissions_officer: "Admissions Officer",
    admin: "System Admin",
    super_admin: "Super Administrator"
  };

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Admin Header */}
      <header className="main-header" style={{ position: 'static', background: 'var(--primary-deep)', borderBottom: 'none' }}>
        <div className="container nav-container" style={{ height: '70px' }}>
          <Link href="/" className="logo-link">
            <div className="logo-icon" style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--primary-blue))' }}>A</div>
            <div className="logo-text">
              <h1 style={{ color: 'white' }}>BORABU TTC</h1>
              <div className="logo-tagline" style={{ color: 'rgba(255,255,255,0.6)' }}>Admissions Control Panel</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
              Logged in as: <strong>{user.fullName}</strong> ({roleDisplay[user.role] || user.role})
            </span>
            <Link href="/" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
              College Site
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin layout */}
      <div className="container" style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '250px 1fr', gap: '30px', padding: '30px 20px' }}>
        {/* Sidebar Nav */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '10px 14px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '1px' }}>
            Admin Menu
          </div>
          
          <Link 
            href="/admin" 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              padding: '12px 16px', 
              fontSize: '14px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dark)',
              textAlign: 'left'
            }}
          >
            📋 Applications Queue
          </Link>

          <Link 
            href="/admin/rules" 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              padding: '12px 16px', 
              fontSize: '14px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dark)',
              textAlign: 'left'
            }}
          >
            ⚙️ Manage Entry Rules
          </Link>

          <Link 
            href="/admin/logs" 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              padding: '12px 16px', 
              fontSize: '14px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dark)',
              textAlign: 'left'
            }}
          >
            📜 Audit Logs & Alerts
          </Link>

          <Link 
            href="/admin/tickets" 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              padding: '12px 16px', 
              fontSize: '14px',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dark)',
              textAlign: 'left'
            }}
          >
            💬 Support Ticket Inbox
          </Link>

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
            <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-gold)' }}>Security Status</div>
              <div style={{ fontSize: '11px', color: 'var(--text-light)', marginTop: '4px' }}>
                All actions are cryptographically signed and logged for audit tracking.
              </div>
            </div>
          </div>
        </aside>

        {/* Content body */}
        <main style={{ minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
