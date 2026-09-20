import { motion, useScroll, useTransform } from "framer-motion";
import Magnetic from "../ui/Magnetic";
import SocialIcon from "../ui/SocialIcon";
import { socials } from "../../data/socials";
import { scrollToSection } from "../../lib/scrollToSection";
import background from "../../assets/background.png";
import "./main.css";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const Main = () => {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 700], [0, 90]);
  const imageScale = useTransform(scrollY, [0, 700], [1, 1.08]);
  const frameY = useTransform(scrollY, [0, 700], [0, 40]);

  return (
    <section className="hero" id="home" aria-label="Introduction">
      <div className="hero__content">
        <motion.div
          className="hero__info"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div className="hero__role" variants={fadeUp}>
            <span>Frontend Developer</span>
            <span>/ UI UX Designer</span>
          </motion.div>

          <motion.div className="hero__small-line" variants={fadeUp} />

          <motion.p variants={fadeUp}>I craft modern, minimal{`\n`}and meaningful digital{`\n`}experiences.</motion.p>
        </motion.div>

        <div className="hero__visual">
          <motion.div className="hero__image-wrap" style={{ y: imageY, scale: imageScale }}>
            <motion.img
              src={background}
              alt="Portrait of BawSed, frontend developer"
              className="hero__image"
              fetchPriority="high"
              decoding="async"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </motion.div>

          <motion.div className="frame frame--one" style={{ y: frameY }} aria-hidden="true">
            <span className="frame__top" />
            <span className="frame__right" />
            <span className="frame__bottom" />
            <span className="frame__left" />
          </motion.div>

          <motion.div className="frame frame--two" style={{ y: frameY }} aria-hidden="true">
            <span className="frame__top" />
            <span className="frame__right" />
            <span className="frame__bottom" />
            <span className="frame__left" />
          </motion.div>

          <span className="plus plus--top" aria-hidden="true">
            <i />
            <b />
          </span>

          <span className="plus plus--right" aria-hidden="true">
            <i />
            <b />
          </span>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 28, scale: 0.94, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.55 }}
          >
            BAWSED
          </motion.h1>
        </div>

        <motion.div
          className="hero__counter"
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.4 }}
        >
          <span>01</span>
          <span className="counter-line" />
          <span>04</span>
        </motion.div>
      </div>

      <motion.ul
        className="hero__socials"
        variants={stagger}
        initial="hidden"
        animate="show"
        aria-label="Social links"
      >
        {socials.map((item) => (
          <motion.li key={item.id} variants={fadeUp}>
            <Magnetic>
              <a
                href={item.href}
                aria-label={item.label}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
              >
                <SocialIcon name={item.icon} />
              </a>
            </Magnetic>
          </motion.li>
        ))}
      </motion.ul>

      <motion.button
        type="button"
        className="hero__scroll"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.6 }}
        onClick={() => scrollToSection("#works")}
        data-cursor="hover"
        aria-label="Scroll to selected works"
      >
        <span>SCROLL</span>
        <div className="scroll-mouse">
          <span />
        </div>
      </motion.button>

      <motion.div
        className="hero__scroll-side"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 1.7 }}
        aria-hidden="true"
      >
        <span>SCROLL</span>
        <div />
      </motion.div>
    </section>
  );
};

export default Main;
