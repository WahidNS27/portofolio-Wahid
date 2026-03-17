import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Cpu, Clock3, MessageSquare,
  LogOut, Code2, ExternalLink, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin/dashboard',   icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/admin/projects',    icon: <FolderKanban size={18} />,    label: 'Proyek' },
  { to: '/admin/skills',      icon: <Cpu size={18} />,             label: 'Skills' },
  { to: '/admin/experiences', icon: <Clock3 size={18} />,          label: 'Pengalaman' },
  { to: '/admin/messages',    icon: <MessageSquare size={18} />,   label: 'Pesan Masuk' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logout berhasil');
    navigate('/admin/login');
  };

  return (
    <div className="dark min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-dark-800/80 border-r border-white/5 flex flex-col fixed h-full z-40">
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-cyber-blue flex items-center justify-center shadow-lg shadow-accent/30">
              <Code2 size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Portfolio CMS</p>
              <p className="text-gray-500 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/5 space-y-1">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link"
          >
            <ExternalLink size={18} />
            <span>Lihat Portfolio</span>
          </a>
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-left text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-cyber-purple flex items-center justify-center text-xs font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-64">
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 min-h-screen"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
