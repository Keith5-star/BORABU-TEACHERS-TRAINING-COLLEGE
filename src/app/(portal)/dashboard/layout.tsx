import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import NotificationBell from "@/components/NotificationBell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  if (user.role !== "applicant") {
    redirect("/admin");
  }

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Portal Header */}
      <header className="main-header" style={{ position: 'static' }}>
        <div className="container nav-container" style={{ minHeight: '65px', height: 'auto', padding: '12px 16px', flexWrap: 'wrap', gap: '10px' }}>
          <Link href="/" className="logo-link">
            <div className="logo-icon">B</div>
            <div className="logo-text">
              <h1>BORABU TTC</h1>
              <div className="logo-tagline">Applicant Portal</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <NotificationBell />
            <span style={{ fontSize: '13px', color: 'var(--text-light)' }}>
              Welcome, <strong>{user.fullName}</strong>
            </span>
            <Link href="/" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
              Back to Website
            </Link>
          </div>
        </div>
      </header>


      {/* Main Panel layout */}
      <div className="container dashboard-grid" style={{ flexGrow: 1, display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px', padding: '24px 16px' }}>
        {/* Sidebar Nav */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '1px' }}>
            Navigation
          </div>
          <Link 
            href="/dashboard" 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              padding: '10px 14px', 
              fontSize: '14px',
              border: 'none',
              background: 'var(--bg-card)',
              color: 'var(--text-dark)',
            }}
          >
            📊 Portal Dashboard
          </Link>
          <Link 
            href="/dashboard/apply" 
            className="btn btn-primary" 
            style={{ 
              justifyContent: 'center', 
              padding: '10px 14px', 
              fontSize: '14px',
              marginTop: '4px',
              marginBottom: '4px',
            }}
          >
            ➕ Apply For a Course
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              padding: '10px 14px', 
              fontSize: '14px',
              border: 'none',
              background: 'var(--bg-card)',
              color: 'var(--text-dark)',
            }}
          >
            ⚙️ Account Settings
          </Link>
          <Link 
            href="/dashboard/tickets" 
            className="btn" 
            style={{ 
              justifyContent: 'flex-start', 
              padding: '10px 14px', 
              fontSize: '14px',
              border: 'none',
              background: 'var(--bg-card)',
              color: 'var(--text-dark)',
            }}
          >
            💬 Support Tickets
          </Link>
          
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
            <div style={{ padding: '8px 12px', background: 'rgba(37, 99, 235, 0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
              <h5 style={{ fontSize: '12px', color: 'var(--primary-blue)', marginBottom: '4px' }}>Need Help?</h5>
              <p style={{ fontSize: '11px', color: 'var(--text-light)' }}>
                Contact Admissions: <br />
                <strong>0746 211 764</strong>
              </p>
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
