import { motion } from "framer-motion";

export default function ProjectCard({ project, index }) {
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
    >
      <div className="project-image">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
        />
      </div>

      <div className="project-body">
        <h3>{project.title}</h3>
        <p>{project.desc}</p>

        <div className="project-tags">
          {project.tags.map((tag, i) => (
            <span key={i}>{tag}</span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}
