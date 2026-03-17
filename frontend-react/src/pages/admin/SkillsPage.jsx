import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../api';
import toast from 'react-hot-toast';

const emptyForm = { name: '', icon_url: '', proficiency_level: 80, category: 'Frontend' };
const CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Hardware', 'General'];

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = () => getSkills().then(r => setSkills(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (s) => { setEditing(s.id); setForm(s); setOpen(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await updateSkill(editing, form);
        toast.success('Skill diperbarui!');
      } else {
        await createSkill(form);
        toast.success('Skill ditambahkan!');
      }
      setOpen(false);
      load();
    } catch { toast.error('Gagal menyimpan skill.'); }
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
                <div key={skill.id} className="flex items-center gap-4">
                  <div className="flex items-center gap-3 w-48 flex-shrink-0">
                    {skill.icon_url && <img src={skill.icon_url} alt={skill.name} className="w-5 h-5 object-contain" />}
                    <span className="text-white text-sm font-medium">{skill.name}</span>
                  </div>
                  <div className="flex-1">
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.proficiency_level}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-accent to-cyber-blue rounded-full"
                      />
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs w-10 text-right font-mono">{skill.proficiency_level}%</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg hover:bg-accent/10 hover:text-accent transition-all text-gray-400">
                      <Pencil size={13} />
                    </button>
                    <button onClick={() => handleDelete(skill.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all text-gray-400">
                      <Trash2 size={13} />
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
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Proficiency ({form.proficiency_level}%)</label>
                  <input type="range" min={0} max={100} value={form.proficiency_level}
                    onChange={e => setForm(f => ({ ...f, proficiency_level: parseInt(e.target.value) }))}
                    className="w-full accent-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Icon URL</label>
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
