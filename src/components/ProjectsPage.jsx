import ProjectCard from "./ProjectCard";

export default function ProjectsPage({ projects, onOpen }) {
  return (
    <section className="projects-page">
      <h1 className="projects-title">&lt;&gt; Projects</h1>

      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={onOpen}
          />
        ))}
      </div>
    </section>
  );
}
