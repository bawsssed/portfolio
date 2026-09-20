import { motion } from "framer-motion";
import "./about.css";

const fade = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const About = () => {
  const skills = [
    "React / Next.js",
    "UI Systems",
    "Motion Design",
    "Responsive Layout",
    "Frontend Architecture",
  ];

  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="about__grid-lines" aria-hidden="true" />

      <motion.div
        className="about__label"
        variants={fade}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
      >
        <span>03</span>
        <span className="about__label-line" />
        <span>ABOUT</span>
      </motion.div>

      <div className="about__layout">
        <motion.h2
          id="about-title"
          className="about__title"
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          MINIMAL
          <br />
          <span>DIGITAL</span>
        </motion.h2>

        <motion.div
          className="about__copy"
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
        >
          <p>
            I'm a frontend developer with a sharp eye for detail and a decade of
            turning complex ideas into clean, fast, and reliable products. Every
            pixel, every interaction — built with intent.
          </p>
          <p>
            I work with modern stacks and a calm design language. My goal is
            simple: earn trust through craft, ship work that lasts, and keep
            pushing what "good" looks like.
          </p>
        </motion.div>
      </div>

      <motion.ul
        className="about__skills"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {skills.map((skill) => (
          <motion.li key={skill} variants={fade}>
            {skill}
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};

export default About;