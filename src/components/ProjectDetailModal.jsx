import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { projects } from '../data/projects'; 
import { useEffect } from 'react';

export default function ProjectDetailModal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const project = projects.find(p => p.id === id);
  if (!project) return null;

  const handleClose = () => navigate(-1);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-lg"
      onClick={handleClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-[95%] max-w-6xl bg-[#01161a]/90 border border-[#0f0]/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,255,153,0.2)] backdrop-blur-md"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-[#0f0]/20 transition-all duration-300"
        >
          <X size={28} className="text-[#0f0] drop-shadow-[0_0_8px_rgba(0,255,153,0.8)]" />
        </button>

        <div className="relative aspect-video bg-black overflow-hidden border-b border-[#0f0]/40">
          <img
            src={project.preview || '/projects/placeholder.png'}
            alt={`${project.title} preview`}
            className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            onError={(e) => { e.target.src = '/projects/placeholder.png'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#01161a] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        <div className="p-6 md:p-10 font-mono">
          <h1 className="text-2xl md:text-4xl font-bold text-[#0f0] mb-4 tracking-wide drop-shadow-[0_0_10px_rgba(0,255,153,0.6)]">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {(project.tags || []).map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-xs rounded-full bg-[#0f0]/10 border border-[#0f0]/50 text-[#0f0] shadow-[0_0_8px_rgba(0,255,153,0.3)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-[#c9f3ff] mb-8 leading-relaxed text-base md:text-lg">
            {project.desc}  
          </p>

          {project.url !== "#" && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#0f0]/15 border-2 border-[#0f0]/60 rounded-lg text-[#0f0] font-medium text-lg hover:bg-[#0f0]/25 hover:border-[#0f0] transition-all duration-300 shadow-[0_0_20px_rgba(0,255,153,0.4)] hover:shadow-[0_0_30px_rgba(0,255,153,0.6)]"
            >
              Launch Project <span className="text-xl">→</span>
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}