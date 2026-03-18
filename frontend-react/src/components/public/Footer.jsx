import { Code2, Github, Linkedin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 bg-dark-900">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold gradient-text">Portfolio</span>
        </div>

        {/* <p className="text-gray-500 text-sm flex items-center gap-1">
          Dibuat dengan <Heart size={12} className="text-red-400 fill-red-400" /> menggunakan React.js & Laravel
        </p> */}

        <div className="flex items-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
            className="text-gray-500 hover:text-white transition-colors">
            <Github size={18} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
            className="text-gray-500 hover:text-cyber-blue transition-colors">
            <Linkedin size={18} />
          </a>
        </div>
      </div>
      <div className="text-center mt-6 text-gray-600 text-xs">
        © {new Date().getFullYear()} Portfolio. All rights reserved.
      </div>
    </footer>
  );
}
