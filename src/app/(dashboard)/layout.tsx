import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard">
      <aside className="dashboard__sidebar" id="dashboard-sidebar">
        <nav className="dashboard__nav">
          <Link href="/library" className="dashboard__nav-link" id="sidebar-library">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            My Library
          </Link>
          <Link href="/history" className="dashboard__nav-link" id="sidebar-history">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>
            Watch History
          </Link>
          <Link href="/" className="dashboard__nav-link" id="sidebar-home">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Home
          </Link>
        </nav>
      </aside>
      <div className="dashboard__main">{children}</div>
    </div>
  );
}
