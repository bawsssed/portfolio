import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import SocialIcon from "../ui/SocialIcon";
import FormField from "./FormField";
import contactImage from "../../assets/contact.png";
import "./contact.css";

const emptyForm = {
  name: "",
  email: "",
  projectType: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const projectTypes = ["Website", "Landing Page", "UI / UX Design", "Frontend Development", "Other"];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const Contact = () => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const close = (event) => {
      if (!event.target.closest(".contact__field--select")) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Please enter your name.";
    if (!emailPattern.test(form.email.trim())) next.email = "Enter a valid email.";
    if (!form.projectType) next.projectType = "Select a project type.";
    if (form.message.trim().length < 12) next.message = "Tell me a little more about the project.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:3001"}/api/send-email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setForm(emptyForm);
        setOpen(false);
      } else {
        setErrors({ form: data.error || "Ошибка отправки" });
      }
    } catch {
      setErrors({ form: "Ошибка сети. Проверь соединение." });
    }
  };

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="contact__noise" />

      <div className="contact__index">
        <span>04</span>
        <i />
        <span>/ 04</span>
      </div>

      <motion.div
        className="contact__content"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.14 } },
        }}
      >
        <motion.div className="contact__form-area" variants={fadeUp}>
          <div className="contact__form-box">
            <span className="contact__corner contact__corner--tl" />
            <span className="contact__corner contact__corner--br" />

            <div className="contact__form-top">
              <div>
                <span>START A PROJECT</span>
                <h2>LET'S CREATE</h2>
              </div>
              <span>01 / 04</span>
            </div>

            {submitted ? (
              <div className="contact__success" role="status">
                <span>MESSAGE READY</span>
                <p>Thanks - your request is noted. I will get back within 24 hours.</p>
                <button
                  type="button"
                  className="contact__submit"
                  onClick={() => setSubmitted(false)}
                  data-cursor="hover"
                >
                  <span>SEND ANOTHER</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact__form" noValidate>
                <FormField
                  index="01"
                  label="NAME"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={update("name")}
                  error={errors.name}
                />

                <FormField
                  index="02"
                  label="EMAIL"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={update("email")}
                  error={errors.email}
                />

                <div
                  className={`contact__field contact__field--select ${
                    open ? "is-open" : ""
                  } ${errors.projectType ? "contact__field--error" : ""}`}
                >
                  <span className="contact__field-index">03</span>
                  <span className="contact__field-label">PROJECT</span>
                  <span className="contact__field-control">
                    <button
                      type="button"
                      className="contact__select"
                      onClick={() => setOpen((value) => !value)}
                      aria-expanded={open}
                      data-cursor="hover"
                    >
                      <span className={!form.projectType ? "placeholder" : ""}>
                        {form.projectType || "Select project type"}
                      </span>
                      <svg viewBox="0 0 24 24">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    {open && (
                      <div className="contact__dropdown" role="listbox">
                        {(Array.isArray(projectTypes) ? projectTypes : []).map(
                          (type, index) => (
                            <button
                              type="button"
                              key={type}
                              data-cursor="hover"
                              onClick={() => {
                                setForm((current) => ({
                                  ...current,
                                  projectType: type,
                                }));
                                setErrors((current) => ({
                                  ...current,
                                  projectType: "",
                                }));
                                setOpen(false);
                              }}
                            >
                              <span>0{index + 1}</span>
                              {type}
                            </button>
                          )
                        )}
                      </div>
                    )}
                    {errors.projectType && (
                      <span className="contact__error" role="alert">
                        {errors.projectType}
                      </span>
                    )}
                  </span>
                </div>

                <FormField
                  index="04"
                  label="MESSAGE"
                  name="message"
                  as="textarea"
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={update("message")}
                  error={errors.message}
                />

                {errors.form && (
                  <span className="contact__error" role="alert">
                    {errors.form}
                  </span>
                )}
                <button className="contact__submit" type="submit" data-cursor="hover">
                  <span>SEND MESSAGE</span>
                  <svg viewBox="0 0 24 24">
                    <path d="M5 19L19 5" />
                    <path d="M8 5h11v11" />
                  </svg>
                </button>
              </form>
            )}
          </div>

          <div className="contact__availability">
            <span>
              <i />
              AVAILABLE FOR PROJECTS
            </span>
            <div />
            <span>USUALLY REPLIES WITHIN 24H</span>
          </div>
        </motion.div>

        <motion.div className="contact__intro" variants={fadeUp}>
          <div className="contact__title" id="contact-title">
            <span>CREATE</span>
            <span>TOGETHER</span>
            <div className="contact__plus">
              <i />
              <i />
            </div>
          </div>

          <div className="contact__lower">
            <div className="contact__visual">
              <div className="contact__image-frame">
                <span className="contact__image-corner contact__image-corner--tl" />
                <span className="contact__image-corner contact__image-corner--br" />
                <img
                  src={contactImage}
                  alt="Architectural detail"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="contact__visual-text">
                <span>GOOD DESIGN</span>
                <span>BUILDS</span>
                <span>BETTER FUTURES</span>
                <i />
              </div>
            </div>

            <div className="contact__description">
              <span>HAVE A PROJECT IN MIND?</span>
              <p>Have an idea, a question,{`\n`}or simply want to talk?{`\n`}<br />Let's create something meaningful.</p>
            </div>

            <div className="contact__contacts">
              <a href="mailto:bawsed16@gmail.com" data-cursor="hover">
                <SocialIcon name="mail" />
                <span>
                  <small>EMAIL</small>
                  bawsed16@gmail.com
                </span>
                <b>↗</b>
              </a>
              <a
                href="https://t.me/ebawsed"
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
              >
                <SocialIcon name="telegram" />
                <span>
                  <small>TELEGRAM</small>
                  ebawsed
                </span>
                <b>↗</b>
              </a>
              <a
                href="https://instagram.com/bawssed"
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
              >
                <SocialIcon name="instagram" />
                <span>
                  <small>INSTAGRAM</small>
                  bawssed
                </span>
                <b>↗</b>
              </a>
              <a href="tel:+998700326101" data-cursor="hover">
                <SocialIcon name="phone" />
                <span>
                  <small>PHONE</small>
                  +998 70 032 61 01
                </span>
                <b>↗</b>
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <div className="contact__bottom">
        <span>BAWSED</span>
        <i />
        <span>FRONTEND DEVELOPER / UI UX DESIGNER</span>
        <span>© 2026</span>
      </div>
    </section>
  );
};

export default Contact;