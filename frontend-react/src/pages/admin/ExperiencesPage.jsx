import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Briefcase, GraduationCap } from 'lucide-react';
import { getExperiences, createExperience, updateExperience, deleteExperience } from '../../api';
import toast from 'react-hot-toast';

const emptyForm = {
  role: '', company: '', start_date: '', end_date: '', description: '', type: 'work',
};

export default function ExperiencesPage() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const load = () => getExperiences().then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (item) => {
    setEditing(item.id);
    setForm({
      ...item,
      start_date: item.start_date?.split('T')[0] || '',
      end_date: item.end_date?.split('T')[0] || '',
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, end_date: form.end_date || null };
      if (editing) {
        await updateExperience(editing, payload);
        toast.success('Pengalaman diperbarui!');
      } else {
        await createExperience(payload);
        toast.success('Pengalaman ditambahkan!');
      }
      setOpen(false);
      load();
    } catch { toast.error('Gagal menyimpan.'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus entri ini?')) return;
    try { await deleteExperience(id); toast.success('Dihapus.'); load(); }
    catch { toast.error('Gagal.'); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' }) : 'Sekarang';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Pengalaman & Pendidikan</h1>
          <p className="text-gray-400 mt-1">{items.length} entri</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Tambah Entri
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Role', 'Perusahaan/Institusi', 'Periode', 'Tipe', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{item.role}</td>
                  <td className="px-6 py-4 text-gray-300">{item.company}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs font-mono">
                    {fmt(item.start_date)} — {fmt(item.end_date)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      item.type === 'work'
                        ? 'bg-accent/10 text-accent border-accent/20'
                        : 'bg-cyber-blue/10 text-cyber-blue border-cyber-blue/20'
                    }`}>
                      {item.type === 'work' ? <Briefcase size={11} /> : <GraduationCap size={11} />}
                      {item.type === 'work' ? 'Kerja' : 'Pendidikan'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-accent/10 hover:text-accent transition-all text-gray-400"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all text-gray-400"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-16 text-gray-500">Belum ada data. Tambahkan pengalaman atau pendidikan.</div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg p-7 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit Entri' : 'Tambah Entri Baru'}</h2>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">Role/Jabatan *</label>
                    <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      required className="form-input" placeholder="Full-Stack Developer" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">Tipe</label>
                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                      className="form-input">
                      <option value="work">Pekerjaan</option>
                      <option value="education">Pendidikan</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Perusahaan/Institusi *</label>
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    required className="form-input" placeholder="PT. Nama Perusahaan" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">Tanggal Mulai *</label>
                    <input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))}
                      required className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">Tanggal Selesai</label>
                    <input type="date" value={form.end_date || ''} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                      className="form-input" placeholder="Kosongi jika masih berlangsung" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Deskripsi *</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    required rows={3} className="form-input resize-none" placeholder="Deskripsi peran dan tanggung jawab..." />
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
