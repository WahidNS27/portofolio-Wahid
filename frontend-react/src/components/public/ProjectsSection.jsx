import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Star } from 'lucide-react';
import { getProjects } from '../../api';

const techColors = {
  'React.js': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  'Laravel':  'bg-red-500/10 text-red-400 border-red-500/20',
  'Tailwind CSS': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'ESP32':    'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'MySQL':    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Node.js':  'bg-green-500/10 text-green-400 border-green-500/20',
};

const defaultTech = 'bg-accent/10 text-accent-light border-accent/20';

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then(res => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="py-32 bg-dark-800/50 relative overflow-hidden">
      {/* Bg elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyber-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-accent text-sm font-mono mb-3 tracking-widest uppercase">Portofolio</p>
          <h2 className="section-title gradient-text">Proyek Unggulan</h2>
          <p className="section-subtitle">
            Koleksi karya terbaik saya — dari aplikasi web hingga sistem IoT terintegrasi
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-cyber-blue rounded-full mx-auto" />
        </motion.div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card p-6 animate-pulse h-80">
                <div className="h-40 bg-white/5 rounded-xl mb-4" />
                <div className="h-4 bg-white/5 rounded mb-2 w-3/4" />
                <div className="h-3 bg-white/5 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ staggerChildren: 0.12 }}
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="glass-card group overflow-hidden flex flex-col"
                whileHover={{ y: -6 }}
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden rounded-t-2xl bg-dark-600">
                  {project.image_url ? (
                    <img
                      src={`http://localhost:8000/storage/${project.image_url}`}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-600 to-dark-700">
                      <div className="text-6xl font-black gradient-text opacity-20">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Featured badge */}
                  {project.is_featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                      <Star size={10} fill="currentColor" />
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-light transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  {project.tech_stack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tech_stack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className={`px-2 py-0.5 rounded-md text-xs font-medium border ${techColors[tech] || defaultTech}`}
                        >
                          {tech}
                        </span>
                      ))}
                      {project.tech_stack.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md text-xs font-medium border border-white/10 text-gray-400">
                          +{project.tech_stack.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex gap-3">
                    {project.live_url && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark transition-colors text-white text-sm font-medium flex-1 justify-center"
                      >
                        <ExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-gray-300 text-sm font-medium flex-1 justify-center"
                      >
                        <Github size={14} />
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
