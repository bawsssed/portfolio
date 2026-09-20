import { AnimatePresence, motion } from "framer-motion";

const ProjectViewer = ({
  project,
  activeImage,
  direction,
  onClose,
  onPrev,
  onNext,
  onSelect,
  onTouchStart,
  onTouchEnd,
}) => {
  if (!project) return null;

  const { title, category } = project;

  return (
    <AnimatePresence>
      <motion.div
        className="viewer"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} gallery`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="viewer__grid" />

        <div className="viewer__top">
          <div className="viewer__project">
            <span>{project.number}</span>
            <span className="viewer__line" />
            <span>{title}</span>
          </div>

          <button
            className="viewer__close"
            type="button"
            onClick={onClose}
            aria-label="Close project"
            data-cursor="hover"
          >
            <span />
            <span />
          </button>
        </div>

        <div
          className="viewer__content"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            className="viewer__arrow viewer__arrow--left"
            type="button"
            onClick={onPrev}
            aria-label="Previous image"
            data-cursor="hover"
          >
            <span>←</span>
          </button>

          <div className="viewer__image-container">
            <span className="viewer__image-cross viewer__image-cross--top">
              <i />
              <b />
            </span>

            <img
              key={`${project.number}-${activeImage}-${direction}`}
              src={project.images[activeImage]}
              alt={`${project.title} ${activeImage + 1}`}
              className={`viewer__image viewer__image--${
                direction === 1 ? "next" : "previous"
              }`}
            />
          </div>

          <button
            className="viewer__arrow viewer__arrow--right"
            type="button"
            onClick={onNext}
            aria-label="Next image"
            data-cursor="hover"
          >
            <span>→</span>
          </button>
        </div>

        <div className="viewer__bottom">
          <div className="viewer__meta">
            <span>{String(activeImage + 1).padStart(2, "0")}</span>
            <span className="viewer__meta-line" />
            <span>{String(project.images.length).padStart(2, "0")}</span>
            <span className="viewer__category">{category}</span>
          </div>

          <div className="viewer__thumbnails">
            {project.images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                className={`viewer__thumbnail ${
                  activeImage === index ? "viewer__thumbnail--active" : ""
                }`}
                onClick={() => onSelect(index)}
                data-cursor="hover"
              >
                <img
                  src={image}
                  alt={`${title} preview ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectViewer;
