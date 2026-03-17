import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSkills } from '../../api';
import { User, MapPin, Coffee } from 'lucide-react';

const categoryColors = {
  Frontend: 'border-cyber-blue/40 hover:border-cyber-blue text-cyber-blue',
  Backend: 'border-cyber-purple/40 hover:border-cyber-purple text-cyber-purple',
  Database: 'border-cyber-green/40 hover:border-cyber-green text-cyber-green',
  DevOps: 'border-accent/40 hover:border-accent text-accent-light',
  Hardware: 'border-cyber-pink/40 hover:border-cyber-pink text-cyber-pink',
  General: 'border-white/20 hover:border-white/50 text-gray-300',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
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
          <p className="text-accent text-sm font-mono mb-3 tracking-widest uppercase">Tentang Saya</p>
          <h2 className="section-title gradient-text">Who Am I?</h2>
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
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-accent via-cyber-purple to-cyber-blue p-[2px]">
                <div className="w-full h-full rounded-2xl bg-dark-700 flex items-center justify-center">
                  <img
                    src="/assets/img/profile.png"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  {/* <User size={64} className="text-accent-light/60" /> */}
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 glass-card px-4 py-2 animate-float">
                <div className="flex items-center gap-2 text-sm">
                  <Coffee size={14} className="text-accent" />
                  <span className="text-white font-medium">10+ Projects</span>
                </div>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">
              Saya adalah <span className="gradient-text">Junior Web Developer</span>
            </h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Seorang pengembang perangkat lunak yang bersemangat dengan pengalaman dalam membangun
              aplikasi web modern dan sistem IoT. Saya percaya bahwa kode yang baik adalah seni —
              fungsional, elegan, dan dapat dipelihara.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Selain coding, saya aktif dalam riset sistem tertanam (ESP32, Arduino) dan
              selalu antusias mengeksplorasi teknologi baru untuk menyelesaikan masalah nyata.
            </p>

            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <MapPin size={14} className="text-accent" />
              <span>Indonesia</span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { value: '3+', label: 'Tahun Pengalaman' },
                { value: '20+', label: 'Proyek Selesai' },
                { value: '5+', label: 'Tech Stack' },
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
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-3"
            >
              {filtered.map(skill => (
                <motion.div
                  key={skill.id}
                  variants={badgeVariants}
                  className={`skill-badge border ${categoryColors[skill.category] || categoryColors.General}`}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-2">
                    {skill.icon_url && (
                      <img src={skill.icon_url} alt={skill.name} className="w-4 h-4 object-contain" />
                    )}
                    <span>{skill.name}</span>
                    <span className="text-xs opacity-60 font-mono">{skill.proficiency_level}%</span>
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <p className="text-gray-500">Memuat skill...</p>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
