import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Github, Linkedin, Mail, CheckCircle } from 'lucide-react';
import { sendContact } from '../../api';
import toast from 'react-hot-toast';

const inputClass = 'form-input';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama wajib diisi.';
    if (!form.email.trim()) errs.email = 'Email wajib diisi.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Format email tidak valid.';
    if (!form.message.trim()) errs.message = 'Pesan wajib diisi.';
    else if (form.message.length < 10) errs.message = 'Pesan minimal 10 karakter.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await sendContact(form);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      toast.success('Pesan berhasil dikirim! Terima kasih 🎉');
    } catch (err) {
      toast.error('Gagal mengirim pesan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-32 bg-dark-800/50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-accent text-sm font-mono mb-3 tracking-widest uppercase">Hubungi</p>
          <h2 className="section-title gradient-text">Let's Work Together</h2>
          <p className="section-subtitle">
            Punya proyek menarik? Jangan ragu untuk menghubungi saya. Saya selalu terbuka untuk kolaborasi baru!
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-accent to-cyber-blue rounded-full mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Informasi Kontak</h3>
              <p className="text-gray-400 leading-relaxed">
                Saya merespons pesan dalam 1–2 hari kerja. Untuk urgensi, hubungi via LinkedIn.
              </p>
            </div>

            {[
              {
                icon: <Mail size={20} />,
                label: 'Email',
                value: 'wahidsptr27@gmail.com',
                href: '',
                color: 'text-accent',
              },
              {
                icon: <Github size={20} />,
                label: 'GitHub',
                value: 'WahidNS27',
                href: 'https://github.com/WahidNS27',
                color: 'text-white',
              },
              {
                icon: <Linkedin size={20} />,
                label: 'LinkedIn',
                value: 'Wahid Narenda Saputra',
                href: 'https://www.linkedin.com/in/wahidnarendasaputra/',
                color: 'text-cyber-blue',
              },
            ].map(contact => (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 glass-card group"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${contact.color} group-hover:bg-accent/10 transition-colors`}>
                  {contact.icon}
                </div>
                <div>
                  <p className="text-gray-400 text-xs">{contact.label}</p>
                  <p className="text-white font-medium">{contact.value}</p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-12 text-center"
              >
                <CheckCircle size={56} className="text-cyber-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Pesan Terkirim! 🎉</h3>
                <p className="text-gray-400">Terima kasih telah menghubungi. Saya akan segera merespons.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 btn-outline py-2 px-6 text-sm"
                >
                  Kirim Pesan Lain
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">Nama Lengkap</label>
                  <input
                    type="text"
                    placeholder="nama anda"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className={inputClass}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="tes@example.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className={inputClass}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2 font-medium">Pesan</label>
                  <textarea
                    rows={5}
                    placeholder="Ceritakan proyek atau ide yang ingin kita kerjakan bersama..."
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className={`${inputClass} resize-none`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Kirim Pesan
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
