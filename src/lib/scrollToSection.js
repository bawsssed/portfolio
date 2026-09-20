const HEADER_OFFSET = 8;

export const scrollToSection = (hash) => {
  const id = hash.replace("#", "");
  const target = document.getElementById(id);

  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

  window.scrollTo({
    top: Math.max(0, top),
    behavior: "smooth",
  });
};
