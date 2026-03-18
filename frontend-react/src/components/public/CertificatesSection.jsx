import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ExternalLink, X, Image as ImageIcon } from 'lucide-react';
import { getCertificates } from '../../api';

// Container animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loadingCerts, setLoadingCerts] = useState(true);

  useEffect(() => {
    getCertificates()
      .then(res => setCertificates(res.data))
      .catch(() => {})
      .finally(() => setLoadingCerts(false));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-cyber-pink/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-pink/10 border border-cyber-pink/20 text-cyber-pink text-sm font-medium mb-6"
          >
            <Award size={16} />
            <span>Lisensi & Sertifikasi</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-white mb-6"
          >
            Sertifikat <span className="gradient-text">Kompetensi</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            Bukti pencapaian dan kualifikasi profesional yang mendukung keahlian teknis saya di bidang pengembangan perangkat lunak.
          </motion.p>
        </div>

        {/* Loading Skeleton */}
        {loadingCerts && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-card overflow-hidden animate-pulse">
                <div className="h-48 bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-white/5 rounded-lg w-3/4" />
                  <div className="h-4 bg-white/5 rounded-lg w-1/2" />
                  <div className="h-3 bg-white/5 rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificates Grid */}
        {!loadingCerts && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {certificates.map((cert) => (
              <motion.div
                key={cert.id}
                variants={itemVariants}
                className="glass-card group overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-cyber-pink/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Thumbnail */}
                <div
                  className="relative h-48 sm:h-56 bg-dark-800 overflow-hidden cursor-pointer"
                  onClick={() => cert.image_full_url && setSelectedImage(cert.image_full_url)}
                >
                  {cert.image_full_url ? (
                    <>
                      <img
                        src={cert.image_full_url}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-white/10 text-white px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 flex items-center gap-2 font-medium">
                          <ImageIcon size={18} /> Perbesar
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-2">
                      <Award size={40} className="opacity-20" />
                      <span className="text-sm">Gambar tidak tersedia</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyber-pink transition-colors line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-gray-400 mt-2 font-medium text-sm">
                      {cert.issuer}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      Diterbitkan: {formatDate(cert.issue_date)}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/5">
                    {cert.credential_url ? (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={14} /> Lihat Kredensial Asli
                      </a>
                    ) : (
                      <span className="text-xs font-medium text-gray-600 block">Kredensial offline / tidak ada link</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {certificates.length === 0 && (
              <div className="col-span-full py-20 text-center text-gray-500">
                <Award size={48} className="mx-auto mb-4 opacity-20" />
                <p>Belum ada sertifikat yang ditambahkan.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 hover:text-cyber-pink transition-colors z-[101]"
              onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-5xl w-full max-h-[85vh] flex items-center justify-center rounded-xl overflow-hidden shadow-2xl shadow-cyber-pink/20"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt="Sertifikat Besar"
                className="max-w-full max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
