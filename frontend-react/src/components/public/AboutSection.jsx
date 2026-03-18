import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSkills } from '../../api';
import { User, MapPin, Coffee, Cpu } from 'lucide-react';

const categoryGlow = {
  Frontend: 'from-cyber-blue/20',
  Backend: 'from-cyber-purple/20',
  Database: 'from-cyber-green/20',
  DevOps: 'from-accent/20',
  Hardware: 'from-cyber-pink/20',
  General: 'from-white/10',
};

const containerVariants = {
  hidden: {},
  // stagger is always driven, not tied to viewport
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 250 } },
  exit: { opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.15 } },
};

export default function AboutSection() {
  const [skills, setSkills] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    getSkills().then(res => {
      setSkills(res.data);
      const cats = ['All', ...new Set(res.data.map(s => s.category))];
      setCategories(cats);
    }).catch(() => { });
  }, []);

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* <p className="text-accent text-sm font-mono mb-3 tracking-widest uppercase">Tentang Saya</p> */}
          <h2 className="section-title gradient-text">Tentang Saya</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-cyber-blue rounded-full mx-auto mt-4" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Avatar + Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Avatar placeholder */}
            <div className="relative inline-block mb-8">
              <div className="w-45 h-45 rounded-2xl bg-gradient-to-br from-accent via-cyber-purple to-cyber-blue p-[2px]">
                <div className="w-full h-full rounded-2xl bg-dark-700 flex items-center justify-center">
                  <img
                    src="/assets/img/wahid.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {/* <User size={64} className="text-accent-light/60" /> */}
                </div>
              </div>
              {/* Floating badge */}
              {/* <div className="absolute -bottom-4 -right-4 glass-card px-4 py-2 animate-float">
                <div className="flex items-center gap-2 text-sm">
                  <Coffee size={14} className="text-accent" />
                  <span className="text-white font-medium">10+ Projects</span>
                </div>
              </div> */}
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">
              Saya adalah <span className="gradient-text">Junior Web Developer</span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Saya merupakan seorang Junior Web Developer yang memiliki pengalaman dalam
              pengembangan aplikasi web menggunakan teknologi seperti PHP, Laravel, dan MySQL.
              Saya terbiasa membangun sistem yang terstruktur, efisien, serta berorientasi
              pada kebutuhan pengguna.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Saya memiliki komitmen untuk terus meningkatkan kemampuan dalam membangun aplikasi
              yang scalable, maintainable, dan sesuai dengan standar industri.
            </p>

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <MapPin size={14} className="text-accent" />
              <span>Indonesia</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: '1+', label: 'Tahun Pengalaman' },
                { value: '3', label: 'Proyek Selesai' },
                { value: '2', label: 'Tech Stack' },
              ].map(stat => (
                <div key={stat.label} className="glass-card p-4 text-center">
                  <p className="gradient-text text-2xl font-black">{stat.value}</p>
                  <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Skills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h4 className="text-xl font-bold text-white mb-6">Tech Stack & Skills</h4>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${activeCategory === cat
                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Skill badges */}
            {/* KEY changes on every category switch → Framer Motion remounts and re-runs stagger */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="grid grid-cols-3 sm:grid-cols-4 gap-4"
              >
                {filtered.map(skill => {
                  const isImageUrl = skill.icon_url && (skill.icon_url.startsWith('http') || skill.icon_url.startsWith('data:'));
                  const imgSrc = isImageUrl ? skill.icon_url : (skill.icon_url ? `http://localhost:8000/storage/${skill.icon_url}` : null);
                  return (
                  <motion.div
                    key={skill.id}
                    variants={badgeVariants}
                    layout
                    className="group relative flex flex-col items-center justify-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm overflow-hidden"
                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  >
                    {/* Hover Glow Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${categoryGlow[skill.category] || categoryGlow.General} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                    
                    <div className="w-10 h-10 mb-3 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={skill.name}
                          className="max-w-full max-h-full object-contain filter drop-shadow-md"
                          onError={e => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <Cpu size={28} className="text-gray-400 group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-gray-300 group-hover:text-white text-center relative z-10 transition-colors uppercase tracking-wider">{skill.name}</span>
                  </motion.div>
                )})}
                {filtered.length === 0 && skills.length > 0 && (
                  <p className="text-gray-500 text-sm py-2">Tidak ada skill di kategori ini.</p>
                )}
                {skills.length === 0 && (
                  <p className="text-gray-500 text-sm py-2">Memuat skill...</p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
