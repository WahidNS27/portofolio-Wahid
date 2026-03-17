import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, MessageSquare, Cpu, Clock3, TrendingUp, Eye } from 'lucide-react';
import { getProjects, getMessageStats, getSkills, getExperiences } from '../../api';

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card p-6 flex items-center gap-5"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-black text-white">{value ?? '—'}</p>
      <p className="text-gray-400 text-sm mt-0.5">{label}</p>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getMessageStats(), getSkills(), getExperiences()])
      .then(([proj, msgs, skills, exp]) => {
        setStats({
          projects:       proj.data.length,
          totalMessages:  msgs.data.total_messages,
          unreadMessages: msgs.data.unread_messages,
          skills:         skills.data.length,
          experiences:    exp.data.length,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      icon: <FolderKanban size={24} className="text-accent" />,
      label: 'Total Proyek',
      value: stats.projects,
      color: 'bg-accent/10',
      delay: 0.1,
    },
    {
      icon: <MessageSquare size={24} className="text-cyber-blue" />,
      label: 'Pesan Belum Dibaca',
      value: stats.unreadMessages,
      color: 'bg-cyber-blue/10',
      delay: 0.15,
    },
    {
      icon: <Cpu size={24} className="text-cyber-green" />,
      label: 'Total Skills',
      value: stats.skills,
      color: 'bg-cyber-green/10',
      delay: 0.2,
    },
    {
      icon: <Clock3 size={24} className="text-cyber-purple" />,
      label: 'Pengalaman/Pendidikan',
      value: stats.experiences,
      color: 'bg-cyber-purple/10',
      delay: 0.25,
    },
    {
      icon: <TrendingUp size={24} className="text-cyber-pink" />,
      label: 'Total Pesan Masuk',
      value: stats.totalMessages,
      color: 'bg-cyber-pink/10',
      delay: 0.3,
    },
  ];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-black text-white mb-1">Dashboard</h1>
        <p className="text-gray-400">Selamat datang di Admin Panel Portfolio CMS</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {cards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <Eye size={18} className="text-accent" />
          Aksi Cepat
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Tambah Proyek',      href: '/admin/projects',     color: 'from-accent to-accent-dark' },
            { label: 'Tambah Skill',       href: '/admin/skills',       color: 'from-cyber-blue/60 to-cyber-purple/60' },
            { label: 'Lihat Pesan',        href: '/admin/messages',     color: 'from-cyber-pink/60 to-red-500/60' },
            { label: 'Buka Portfolio',     href: '/',                   color: 'from-cyber-green/60 to-teal-600/60' },
          ].map(action => (
            <a
              key={action.label}
              href={action.href}
              className={`px-4 py-3 rounded-xl bg-gradient-to-r ${action.color} text-white text-sm font-medium text-center hover:opacity-90 transition-opacity`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
