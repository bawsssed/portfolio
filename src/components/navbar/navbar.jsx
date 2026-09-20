import { useEffect, useState } from "react";
import Magnetic from "../ui/Magnetic";
import { navLinks } from "../../data/nav";
import { scrollToSection } from "../../lib/scrollToSection";
import "./navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const ids = ["home", "works", "about", "contact"];
      const current = ids.reduce((acc, id) => {
        const el = document.getElementById(id);
        if (!el) return acc;
        const top = el.getBoundingClientRect().top;
        return top <= 160 ? id : acc;
      }, "home");

      setActive(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const goTo = (event, href) => {
    event.preventDefault();
    setMenuOpen(false);
    scrollToSection(href);
  };

  return (
    <header
      className={`navbar ${scrolled ? "navbar--scrolled" : ""} ${
        menuOpen ? "navbar--open" : ""
      }`}
    >
      <a
        href="#home"
        className="navbar__logo"
        data-cursor="hover"
        onClick={(event) => goTo(event, "#home")}
      >
        BAWSED
      </a>

      <div className="navbar__end">
        <nav className="navbar__links" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`navbar__link ${
                active === link.id ? "navbar__link--active" : ""
              }`}
              data-cursor="hover"
              onClick={(event) => goTo(event, link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Magnetic>
          <button
            className="navbar__menu"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            data-cursor="hover"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
          </button>
        </Magnetic>
      </div>

      <div className="navbar__mobile" id="mobile-nav">
        {navLinks.map((link) => (
          <a
            key={link.id}
            href={link.href}
            data-cursor="hover"
            onClick={(event) => goTo(event, link.href)}
          >
            {link.label}
          </a>
        ))}

        <div className="navbar__mobile-line" />
        <span className="navbar__mobile-caption">FRONTEND DEVELOPER</span>
      </div>
    </header>
  );
};

export default Navbar;
