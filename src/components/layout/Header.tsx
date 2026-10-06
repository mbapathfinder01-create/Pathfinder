import {
  BookOpen,
  Briefcase,
  GraduationCap,
  House,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Shield,
  Sun,
  Target,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/appState';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

const PUBLIC_NAV: NavItem[] = [
  { to: '/', label: 'Home', icon: House },
  { to: '/specializations', label: 'Specializations', icon: BookOpen },
  { to: '/careers', label: 'Careers', icon: Briefcase },
  { to: '/opportunities', label: 'Opportunities', icon: MapPin },
];

const STUDENT_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assessment', label: 'Assessment', icon: Target },
  { to: '/recommendation', label: 'Recommendation', icon: Target },
];

const ADMIN_NAV: NavItem[] = [{ to: '/admin', label: 'Admin', icon: Shield }];

export function Header() {
  const { dark, toggleDark, user, logout } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const items = [
    ...PUBLIC_NAV,
    ...(user?.role === 'student' ? STUDENT_NAV : []),
    ...(user?.role === 'admin' ? ADMIN_NAV : []),
  ];
  // The 7-item student nav needs more room before it can sit inline with the logo.
  const crowded = items.length > 5;
  const inlineNav = crowded ? 'hidden xl:flex' : 'hidden lg:flex';
  const menuToggle = crowded ? 'xl:hidden' : 'lg:hidden';

  const handleLogout = () => {
    // Leave the (possibly protected) page first so its guard doesn't redirect to /login.
    navigate('/');
    logout().catch((err) => console.error('Sign-out failed', err));
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200/60 dark:border-slate-800/60" aria-label="Main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 whitespace-nowrap" aria-label="MBA Pathfinder home">
            <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="h-5 w-5 text-white" aria-hidden />
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white leading-tight">MBA Pathfinder</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Career Guidance System</div>
            </div>
          </Link>

          <div className={`${inlineNav} items-center gap-1`}>
            {items.map((item) => (
              <NavLink key={item.to} item={item} active={pathname === item.to} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleDark}
              className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    title={user.name}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm"
                    title={user.name}
                    aria-hidden
                  >
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn-primary px-4 py-1.5 rounded-lg text-sm font-semibold">
                Sign In
              </Link>
            )}

            <button
              type="button"
              className={`${menuToggle} h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-nav" className={`${menuToggle} py-3 space-y-1 border-t border-slate-200 dark:border-slate-800`}>
            {items.map((item) => (
              <NavLink key={item.to} item={item} active={pathname === item.to} mobile />
            ))}
            {user && (
              <button
                type="button"
                onClick={handleLogout}
                className="sm:hidden w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut className="h-4 w-4" /> Logout ({user.name})
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ item, active, mobile = false }: { item: NavItem; active: boolean; mobile?: boolean }) {
  const Icon = item.icon;
  const base = mobile
    ? 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium'
    : 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition';
  const state = active
    ? `bg-indigo-600 text-white${mobile ? '' : ' shadow-sm'}`
    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
  return (
    <Link to={item.to} className={`${base} ${state}`} aria-current={active ? 'page' : undefined}>
      <Icon className="h-4 w-4" aria-hidden />
      {item.label}
    </Link>
  );
}
