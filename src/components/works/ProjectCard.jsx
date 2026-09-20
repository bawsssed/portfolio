import { motion } from "framer-motion";

const ProjectCard = ({ project, total, index, onOpen }) => {
  const { title, category } = project;

  return (
    <motion.article
      className={`work-card work-card--${project.mark}`}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: index * 0.08,
      }}
    >
      <span className="work-card__cross work-card__cross--one" aria-hidden="true">
        <i />
        <b />
      </span>
      <span className="work-card__cross work-card__cross--two" aria-hidden="true">
        <i />
        <b />
      </span>

      <span className="work-card__number">
        {project.number} / {String(total).padStart(2, "0")}
      </span>

      <button
        className="work-card__button"
        type="button"
        onClick={() => onOpen(project)}
        data-cursor="hover"
        aria-label={`View project ${title}`}
      >
        <div className="work-card__visual">
          <div className="work-card__image-wrap">
            <img
              src={project.images[0]}
              alt={title}
              className="work-card__image"
              loading="lazy"
              decoding="async"
            />
            <div className="work-card__image-shade" />
            <div className="work-card__overlay">
              <span>VIEW PROJECT</span>
              <span className="work-card__arrow">↗</span>
            </div>
          </div>

          <span className="work-card__corner work-card__corner--tr" />
          <span className="work-card__corner work-card__corner--bl" />
          <span className="work-card__corner work-card__corner--br" />

          <span className="work-card__image-count">
            {String(project.images.length).padStart(2, "0")} IMAGES
          </span>
        </div>

        <div className="work-card__info">
          <div className="work-card__name">
            <span>{project.number}</span>
            <h3>{title}</h3>
          </div>
          <span className="work-card__category">{category}</span>
          <span className="work-card__view">
            VIEW
            <b>↗</b>
          </span>
        </div>
      </button>

      {project.mark === "circle" && <span className="work-card__circle" />}
      {project.mark === "line" && <span className="work-card__vertical-line" />}
      {project.mark === "corner" && <span className="work-card__outside-frame" />}
    </motion.article>
  );
};

export default ProjectCard;
