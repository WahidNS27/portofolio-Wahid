import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { getExperiences } from '../../api';

export default function TimelineSection() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getExperiences()
      .then(res => setItems(res.data))
      .catch(() => {});
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sekarang';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="experience" className="py-32 relative overflow-hidden">
      <div className="absolute left-0 top-1/3 w-72 h-72 bg-cyber-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm font-mono mb-3 tracking-widest uppercase">Perjalanan</p>
          <h2 className="section-title gradient-text">Pengalaman & Pendidikan</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-cyber-blue rounded-full mx-auto mt-4 mb-6" />

          {/* Filter tabs */}
          <div className="inline-flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
            {[
              { key: 'all', label: 'Semua' },
              { key: 'work', label: '💼 Kerja' },
              { key: 'education', label: '🎓 Pendidikan' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === tab.key
                    ? 'bg-accent text-white shadow-lg shadow-accent/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-cyber-blue/50 to-transparent" />

          <div className="space-y-10">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="w-5 h-5 rounded-full border-2 border-accent bg-dark-800 flex items-center justify-center shadow-lg shadow-accent/40">
                    {item.type === 'work'
                      ? <Briefcase size={9} className="text-accent" />
                      : <GraduationCap size={9} className="text-cyber-blue" />
                    }
                  </div>
                </div>

                {/* Empty space for alignment */}
                <div className="hidden md:block w-1/2" />

                {/* Card */}
                <div className="ml-14 md:ml-0 md:w-1/2">
                  <motion.div
                    className="glass-card p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="font-bold text-white text-lg leading-tight">{item.role}</h3>
                        <p className="text-accent-light text-sm font-medium mt-0.5">{item.company}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium flex-shrink-0 ${
                        item.type === 'work'
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/20'
                      }`}>
                        {item.type === 'work' ? 'Kerja' : 'Pendidikan'}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-4">
                      <Calendar size={12} />
                      <span>{formatDate(item.start_date)} — {formatDate(item.end_date)}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-gray-500 py-12">Memuat data...</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
