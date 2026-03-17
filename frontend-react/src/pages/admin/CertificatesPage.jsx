import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, ExternalLink, Award } from 'lucide-react';
import { getCertificates, createCertificate, updateCertificate, deleteCertificate } from '../../api';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '', issuer: '', issue_date: '', credential_url: '', image: null,
};

export default function CertificatesPage() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const load = () => getCertificates().then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setPreview(null); setOpen(true); };
  const openEdit = (item) => {
    setEditing(item.id);
    setForm({ ...item, image: null, issue_date: item.issue_date?.split('T')[0] || '' });
    setPreview(item.image_url ? `http://localhost:8000/storage/${item.image_url}` : null);
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
      fd.append('issuer', form.issuer);
      fd.append('issue_date', form.issue_date);
      if (form.credential_url) fd.append('credential_url', form.credential_url);
      if (form.image) fd.append('image', form.image);

      if (editing) {
        fd.append('_method', 'PUT');
        await updateCertificate(editing, fd);
        toast.success('Sertifikat diperbarui!');
      } else {
        await createCertificate(fd);
        toast.success('Sertifikat ditambahkan!');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error('Gagal menyimpan sertifikat.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus sertifikat ini? Gambar juga akan terhapus dari server.')) return;
    try {
      await deleteCertificate(id);
      toast.success('Sertifikat dihapus.');
      load();
    } catch { toast.error('Gagal menghapus.'); }
  };

  const fmt = (d) => new Date(d).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Manajemen Sertifikat</h1>
          <p className="text-gray-400 mt-1">{items.length} sertifikat</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Tambah Sertifikat
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {['Sertifikat', 'Penerbit', 'Tanggal', 'Link', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-gray-400 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img src={`http://localhost:8000/storage/${item.image_url}`}
                          className="w-12 h-10 rounded-lg object-cover" alt="" />
                      ) : (
                        <div className="w-12 h-10 rounded-lg bg-dark-600 flex items-center justify-center">
                          <Award size={16} className="text-gray-600" />
                        </div>
                      )}
                      <p className="text-white font-medium break-all max-w-[200px] line-clamp-2">{item.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{item.issuer}</td>
                  <td className="px-6 py-4 text-gray-400">{fmt(item.issue_date)}</td>
                  <td className="px-6 py-4">
                    {item.credential_url ? (
                      <a href={item.credential_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent flex items-center gap-1">
                        <ExternalLink size={16} /> <span className="text-xs">Lihat</span>
                      </a>
                    ) : <span className="text-gray-600">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(item)} className="p-2 rounded-lg bg-white/5 hover:bg-accent/10 hover:text-accent transition-all">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-16 text-gray-500 flex flex-col items-center gap-3">
              <Award size={48} className="opacity-20" />
              <p>Belum ada sertifikat terdaftar.</p>
            </div>
          )}
        </div>
      </div>

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
                  {editing ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
                </h2>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Judul Sertifikat *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    required className="form-input" placeholder="Google Data Analytics Professional" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">Penerbit *</label>
                    <input value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))}
                      required className="form-input" placeholder="Coursera / Google" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1.5 font-medium">Tanggal Terbit *</label>
                    <input type="date" value={form.issue_date} onChange={e => setForm(f => ({ ...f, issue_date: e.target.value }))}
                      required className="form-input" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">URL Sertifikat (Kredensial) Asli</label>
                  <input value={form.credential_url || ''} onChange={e => setForm(f => ({ ...f, credential_url: e.target.value }))}
                    className="form-input" placeholder="https://coursera.org/verify/..." />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1.5 font-medium">Scan Sertifikat / Thumbnail (Lokal)</label>
                  <div
                    onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:border-accent/40 transition-colors"
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-32 w-full object-contain bg-white/5 rounded-lg" />
                    ) : (
                      <div className="py-6 text-gray-500 flex flex-col items-center gap-2">
                        <ImageIcon size={24} />
                        <span className="text-sm">Upload gambar sertifikat (PNG/JPG)</span>
                      </div>
                    )}
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="btn-outline flex-1">Batal</button>
                  <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50">
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                    {editing ? 'Simpan Perubahan' : 'Tambah Sertifikat'}
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
