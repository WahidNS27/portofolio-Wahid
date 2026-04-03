import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Eye, X, Mail, Clock, CheckCheck } from 'lucide-react';
import { getMessages, readMessage, deleteMessage } from '../../api';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = () => getMessages().then(r => setMessages(r.data)).catch(() => { });
  useEffect(() => { load(); }, []);

  const handleViewMessage = async (msg) => {
    setSelected(msg);
    if (!msg.is_read) {
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      try {
        await readMessage(msg.id);
      } catch (err) {
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: false } : m));
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pesan ini?')) return;
    try { await deleteMessage(id); toast.success('Pesan dihapus.'); load(); setSelected(null); }
    catch { toast.error('Gagal.'); }
  };

  const filtered = filter === 'all' ? messages : messages.filter(m => filter === 'unread' ? !m.is_read : m.is_read);
  const unreadCount = messages.filter(m => !m.is_read).length;

  const fmt = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Pesan Masuk</h1>
          <p className="text-gray-400 mt-1">
            {messages.length} total pesan
            {unreadCount > 0 && <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30">{unreadCount} belum dibaca</span>}
          </p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${filter === f ? 'bg-accent text-white' : 'text-gray-400 hover:text-white'
                }`}>
              {f === 'all' ? 'Semua' : f === 'unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Mail size={40} className="mx-auto mb-3 opacity-30" />
            <p>Tidak ada pesan di kategori ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filtered.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-start gap-4 px-6 py-4 transition-colors cursor-pointer ${!msg.is_read ? 'border-l-2 border-accent bg-white/5 hover:bg-white/10' : 'hover:bg-white/3'}`}
                onClick={() => handleViewMessage(msg)}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-cyber-purple flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm ${!msg.is_read ? 'font-bold text-white' : 'font-normal text-gray-300'}`}>{msg.name}</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <Clock size={10} /> {fmt(msg.created_at)}
                      </span>
                      {msg.is_read && <CheckCheck size={14} className="text-cyber-green" />}
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{msg.email}</p>
                  <p className={`text-sm mt-1 line-clamp-1 ${!msg.is_read ? 'font-semibold text-gray-200' : 'text-gray-400'}`}>{msg.message}</p>
                </div>

                {/* Delete */}
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-all text-gray-600 flex-shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-lg p-7"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-cyber-purple flex items-center justify-center text-white font-bold">
                    {selected.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{selected.name}</p>
                    <a href={`mailto:${selected.email}`} className="text-accent text-sm hover:underline">{selected.email}</a>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>

              <div className="bg-white/3 rounded-xl p-5 mb-6">
                <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="flex items-center justify-between text-gray-500 text-xs">
                <span className="flex items-center gap-1"><Clock size={11} /> {fmt(selected.created_at)}</span>
                <div className="flex gap-3">
                  {/* <a href={`mailto:${selected.email}`} className="btn-primary py-2 px-4 text-sm">Balas via Email</a> */}
                  <button onClick={() => { handleDelete(selected.id); setSelected(null); }}
                    className="px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm transition-all">
                    Hapus
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
