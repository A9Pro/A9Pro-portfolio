import { AnimatePresence, motion } from "framer-motion";

export default function ProjectPane({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <motion.aside
          initial={{ x: 420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 420, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
          className="project-pane hacker-scanlines"
        >
          <button
            onClick={onClose}
            className="close-btn"
          >
            ✕
          </button>

          <h2 className="pane-title">{project.title}</h2>

          <p className="pane-desc">{project.desc}</p>

          <img
            src={project.image}
            alt={project.title}
            className="pane-image"
          />

          <div className="pane-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="pane-tag">
                {tag}
              </span>
            ))}
          </div>

          <a
            href={project.url}
            target="_blank"
            className="pane-link"
          >
            Launch Project →
          </a>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
