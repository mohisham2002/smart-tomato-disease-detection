import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  Leaf,
  LayoutDashboard,
  Upload,
  History,
  Bell,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  BellRing,
} from 'lucide-react';

interface SidebarProps {
  children?: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Image', href: '/upload', icon: Upload, userOnly: true },
  { name: 'Detection History', href: '/history', icon: History, userOnly: true },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Feedback', href: '/feedback', icon: MessageSquare },
  { name: 'Notices', href: '/notices', icon: BellRing, adminOnly: true },
  { name: 'Users', href: '/users', icon: Users, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ children }: SidebarProps) {
  const location = useLocation();
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-stone-50 flex">
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div className="p-6 border-b border-stone-100">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-forest-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-serif font-bold text-forest-600 text-xl">Crop</span><span className="font-serif font-bold text-stone-800 text-xl">Vision</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            if (item.adminOnly && currentUser?.role !== 'ADMIN') return null;
            if (item.userOnly && currentUser?.role === 'ADMIN') return null;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'bg-forest-50 text-forest-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-800'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-forest-600' : 'text-stone-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-100">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-gradient-to-br from-forest-100 to-earth-100 rounded-full flex items-center justify-center">
              <span className="text-forest-700 font-medium">
                {currentUser?.name?.charAt(0).toUpperCase() || '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-stone-800 truncate">{currentUser?.name || 'Guest'}</p>
              <p className="text-xs text-stone-500 truncate">{currentUser?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
}
