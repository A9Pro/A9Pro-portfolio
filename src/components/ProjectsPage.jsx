import ProjectCard from "./ProjectCard";

export default function ProjectsPage({ projects }) {
  return (
    <section className="projects-page">
      <header className="projects-header">
        <h2>&lt;&gt; Projects</h2>
        <p>Selected works — web, mobile & automation</p>
      </header>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
