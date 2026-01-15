/* Minimal JS: mobile nav toggle, active section highlight, footer year */
(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const navbtn = document.getElementById("navbtn");
  const nav = document.getElementById("nav");

  if (navbtn && nav) {
    navbtn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      navbtn.setAttribute("aria-expanded", open ? "true" : "false");
      const icon = navbtn.querySelector("i");
      if (icon) icon.className = open ? "ri-close-line" : "ri-menu-3-line";
    });

    nav.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.classList && t.classList.contains("nav__link")) {
        nav.classList.remove("open");
        navbtn.setAttribute("aria-expanded", "false");
        const icon = navbtn.querySelector("i");
        if (icon) icon.className = "ri-menu-3-line";
      }
    });
  }

  // Active nav highlight on scroll
  const links = Array.from(document.querySelectorAll(".nav__link"));
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  function setActive(id) {
    links.forEach((a) => {
      const isActive = a.getAttribute("href") === "#" + id;
      a.classList.toggle("active", isActive);
    });
  }

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible && visible.target && visible.target.id) setActive(visible.target.id);
    },
    { root: null, threshold: [0.2, 0.35, 0.5] }
  );

  sections.forEach((s) => obs.observe(s));
})();
