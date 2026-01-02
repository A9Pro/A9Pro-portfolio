import React, { useState } from "react";
import ProjectsPage from "./components/ProjectsPage";
import ProjectPane from "./components/ProjectPane";

export default function HackerUIProfile() {
  const [activeProject, setActiveProject] = useState(null);

  const projects = [
    {
      id: 1,
      title: "IkeOluwa Grills and Chops",
      desc: "Delivery-only restaurant platform with email order routing.",
      tags: ["Next.js", "React", "TailwindCSS"],
      image: "/projects/ikeoluwa/preview.png",
      url: "https://ikeoluwa-grillz-az.vercel.app/"
    },
    {
      id: 2,
      title: "Aso-Oke",
      desc: "Modern fashion showcase for traditional fabrics.",
      tags: ["Next.js", "React", "TailwindCSS"],
      image: "/projects/aso-oke/preview.png",
      url: "https://aso-oke.vercel.app/"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 p-6">
      <ProjectsPage
        projects={projects}
        onOpen={setActiveProject}
      />

      <ProjectPane
         project={activeProject}
         onClose={() => setActiveProject(null)}
      />
    </div>
  );
}
