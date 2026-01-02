export default function ProjectCard({ project, onOpen }) {
  return (
    <div
      className="project-card cursor-pointer"
      onClick={() => onOpen(project)}
    >
      <h3 className="project-title">{project.title}</h3>
      <p className="project-desc">{project.desc}</p>

      <div className="project-tags">
        {project.tags.map((tag, i) => (
          <span key={i} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
