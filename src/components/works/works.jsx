import { useCallback, useEffect, useState } from "react";
import { projects } from "../../data/projects";
import ProjectCard from "./ProjectCard";
import ProjectViewer from "./ProjectViewer";
import "./works.css";

const Works = () => {
  const [activeProject, setActiveProject] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [touchStart, setTouchStart] = useState(null);

  const openProject = (project) => {
    setActiveProject(project);
    setActiveImage(0);
    setDirection(1);
  };

  const closeProject = () => {
    setActiveProject(null);
    setActiveImage(0);
  };

  const nextImage = useCallback(() => {
    if (!activeProject) return;
    setDirection(1);
    setActiveImage((current) =>
      current === activeProject.images.length - 1 ? 0 : current + 1
    );
  }, [activeProject]);

  const previousImage = useCallback(() => {
    if (!activeProject) return;
    setDirection(-1);
    setActiveImage((current) =>
      current === 0 ? activeProject.images.length - 1 : current - 1
    );
  }, [activeProject]);

  const selectImage = (index) => {
    if (index === activeImage) return;
    setDirection(index > activeImage ? 1 : -1);
    setActiveImage(index);
  };

  useEffect(() => {
    if (!activeProject) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeProject();
      if (event.key === "ArrowRight") nextImage();
      if (event.key === "ArrowLeft") previousImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProject, activeImage, nextImage, previousImage]);

  const handleTouchStart = (event) => {
    setTouchStart(event.touches[0].clientX);
  };

  const handleTouchEnd = (event) => {
    if (touchStart === null) return;
    const distance = touchStart - event.changedTouches[0].clientX;
    if (Math.abs(distance) > 50) {
      if (distance > 0) nextImage();
      else previousImage();
    }
    setTouchStart(null);
  };

  return (
    <section className="works" id="works" aria-labelledby="works-title">
      <div className="works__grid-lines" aria-hidden="true" />

      <header className="works__header">
        <div className="works__label">
          <span>02</span>
          <span className="works__label-line" />
          <span>WORKS</span>
        </div>

        <div className="works__header-main">
          <h2 className="works__title" id="works-title">
            SELECTED
            <br />
            <span>WORKS</span>
          </h2>
          <p className="works__description">
            A selection of digital experiences,
            <br />
            interfaces and visual identities.
          </p>
        </div>

        <div className="works__header-mark">
          <span>ALL PROJECTS</span>
          <i />
        </div>
      </header>

      <div className="works__projects">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.number}
            project={project}
            total={projects.length}
            index={index}
            onOpen={openProject}
          />
        ))}
      </div>

      <footer className="works__footer">
        <span>SELECTED PROJECTS</span>
        <span className="works__footer-line" />
        <span>{String(projects.length).padStart(2, "0")}</span>
      </footer>

      <div className="works__decor works__decor--left" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="works__decor works__decor--right" aria-hidden="true">
        <span />
        <span />
      </div>

      {activeProject && (
        <ProjectViewer
          project={activeProject}
          activeImage={activeImage}
          direction={direction}
          onClose={closeProject}
          onPrev={previousImage}
          onNext={nextImage}
          onSelect={selectImage}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        />
      )}
    </section>
  );
};

export default Works;