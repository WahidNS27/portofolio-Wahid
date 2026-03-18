import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', icon_url: '', category: 'Frontend', image: null };
const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Hardware', 'General'];

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const load = () => getSkills().then(r => setSkills(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setPreview(null); setOpen(true); };
  const openEdit = (s) => { 
    setEditing(s.id); 
    setForm({ ...s, image: null }); 
    setPreview(s.icon_url ? (s.icon_url.startsWith('http') ? s.icon_url : `http://localhost:8000/storage/${s.icon_url}`) : null); 
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
      fd.append('name', form.name);
      fd.append('category', form.category);
      if (form.icon_url) fd.append('icon_url', form.icon_url);
      if (form.image) fd.append('icon_image', form.image);

      if (editing) {
        fd.append('_method', 'PUT');
        await updateSkill(editing, fd);
        toast.success('Skill diperbarui!');
      } else {
        await createSkill(fd);
        toast.success('Skill ditambahkan!');
      }
      setOpen(false);
      load();
    } catch (err) { 
      toast.error('Gagal menyimpan skill.'); 
      console.error(err.response?.data || err.message);
    }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus skill ini?')) return;
    try { await deleteSkill(id); toast.success('Skill dihapus.'); load(); }
    catch { toast.error('Gagal.'); }
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Manajemen Skills</h1>
          <p className="text-gray-400 mt-1">{skills.length} skill terdaftar</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Tambah Skill
        </button>
      </div>

      {/* By category */}
      <div className="space-y-6">
        {CATEGORIES.map(cat => grouped[cat]?.length > 0 && (
          <div key={cat} className="glass-card p-6">
            <h3 className="font-semibold text-gray-300 mb-4 text-sm uppercase tracking-wider">{cat}</h3>
            <div className="space-y-3">
              {grouped[cat].map(skill => (
                <div key={skill.id} className="flex items-center justify-between gap-4 p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-dark-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {skill.icon_url ? (
                        <img 
                          src={skill.icon_url.startsWith('http') || skill.icon_url.startsWith('data:') ? skill.icon_url : `http://localhost:8000/storage/${skill.icon_url}`} 
                          alt={skill.name} 
                          className="w-full h-full object-contain p-2" 
                        />
                      ) : (
                        <ImageIcon size={16} className="text-gray-500" />
                      )}
                    </div>
                    <span className="text-white font-medium">{skill.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(skill)} className="p-2 rounded-lg hover:bg-accent/10 hover:text-accent transition-all text-gray-400">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(skill.id)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all text-gray-400">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
              className="glass-card w-full max-w-md p-7"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit Skill' : 'Tambah Skill'}</h2>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Nama Skill *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required className="form-input" placeholder="React.js" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Kategori</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="form-input">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Icon Gambar (Upload)</label>
                  <div
                    onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-accent/40 transition-colors"
                  >
                    {preview ? (
                      <div className="flex justify-center"><img src={preview} alt="Preview" className="h-16 w-16 object-contain" /></div>
                    ) : (
                      <div className="py-2 text-gray-500 flex flex-col items-center gap-2">
                        <ImageIcon size={20} />
                        <span className="text-xs">Klik untuk upload icon (PNG/SVG/Webp)</span>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Atau Icon URL (CDN/Link external)</label>
                  <input value={form.icon_url || ''} onChange={e => setForm(f => ({ ...f, icon_url: e.target.value }))}
                    className="form-input" placeholder="https://cdn.devicons.../..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="btn-outline flex-1">Batal</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                    {editing ? 'Simpan' : 'Tambah'}
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
