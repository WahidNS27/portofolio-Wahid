import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Image, Star, ExternalLink, Github } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject } from '../../api';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '', description: '', github_url: '', live_url: '',
  is_featured: false, tech_stack: '', image: null,
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const load = () => getProjects().then(r => setProjects(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setPreview(null); setOpen(true); };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({ ...p, tech_stack: (p.tech_stack || []).join(', '), image: null });
    setPreview(p.image_url ? `http://localhost:8000/storage/${p.image_url}` : null);
    setOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('github_url', form.github_url || '');
      fd.append('live_url', form.live_url || '');
      fd.append('is_featured', form.is_featured ? 1 : 0);
      const techArr = form.tech_stack.split(',').map(s => s.trim()).filter(Boolean);
      techArr.forEach((t, i) => fd.append(`tech_stack[${i}]`, t));
      if (form.image) fd.append('image', form.image);

      if (editing) {
        fd.append('_method', 'PUT');
        await updateProject(editing, fd);
        toast.success('Proyek diperbarui!');
      } else {
        await createProject(fd);
        toast.success('Proyek ditambahkan!');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error('Gagal menyimpan proyek.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus proyek ini?')) return;
    try {
      await deleteProject(id);
      toast.success('Proyek dihapus.');
      load();
    } catch { toast.error('Gagal menghapus.'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Manajemen Proyek</h1>
          <p className="text-gray-400 mt-1">{projects.length} proyek tersedia</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Tambah Proyek
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Proyek', 'Tech Stack', 'Featured', 'Links', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={`http://localhost:8000/storage/${p.image_url}`}
                          className="w-10 h-10 rounded-lg object-cover" alt="" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-dark-600 flex items-center justify-center">
                          <Image size={16} className="text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="text-white font-medium">{p.title}</p>
                        <p className="text-gray-500 text-xs line-clamp-1 mt-0.5 max-w-xs">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(p.tech_stack || []).slice(0, 3).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-xs bg-accent/10 text-accent border border-accent/20">{t}</span>
                      ))}
                      {(p.tech_stack?.length || 0) > 3 && <span className="px-2 py-0.5 rounded text-xs bg-white/5 text-gray-400">+{p.tech_stack.length - 3}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p.is_featured ? <Star size={16} fill="currentColor" className="text-yellow-400" /> : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white"><Github size={16} /></a>}
                      {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent"><ExternalLink size={16} /></a>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-white/5 hover:bg-accent/10 hover:text-accent transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && (
            <div className="text-center py-16 text-gray-500">Belum ada proyek. Klik "Tambah Proyek" untuk mulai.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editing ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                </h2>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Judul *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    required className="form-input" placeholder="Nama proyek" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Deskripsi *</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    required rows={3} className="form-input resize-none" placeholder="Deskripsi singkat proyek..." />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Tech Stack (pisahkan dengan koma)</label>
                  <input value={form.tech_stack} onChange={e => setForm(f => ({ ...f, tech_stack: e.target.value }))}
                    className="form-input" placeholder="React.js, Laravel, MySQL" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">GitHub URL</label>
                    <input value={form.github_url || ''} onChange={e => setForm(f => ({ ...f, github_url: e.target.value }))}
                      className="form-input" placeholder="https://github.com/..." />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">Live URL</label>
                    <input value={form.live_url || ''} onChange={e => setForm(f => ({ ...f, live_url: e.target.value }))}
                      className="form-input" placeholder="https://..." />
                  </div>
                </div>
                {/* Image upload */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Gambar Thumbnail</label>
                  <div
                    onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-accent/40 transition-colors"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-28 w-full object-cover rounded-lg" />
                    ) : (
                      <div className="py-4 text-gray-500 flex flex-col items-center gap-2">
                        <Image size={24} />
                        <span className="text-sm">Klik untuk upload gambar</span>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>
                {/* Featured */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))}
                    className={`w-10 h-6 rounded-full transition-colors ${form.is_featured ? 'bg-accent' : 'bg-white/10'} flex items-center px-0.5`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_featured ? 'translate-x-4' : ''}`} />
                  </div>
                  <span className="text-gray-300 text-sm">Tandai sebagai Featured</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="btn-outline flex-1">Batal</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                    {editing ? 'Simpan Perubahan' : 'Tambah Proyek'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
