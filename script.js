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


// Background network canvas (subtle)
(function () {
  const c = document.getElementById("bg-net");
  if (!c) return;
  const ctx = c.getContext("2d", { alpha: true });
  let w = 0, h = 0, dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));

  function resize(){
    w = c.width = Math.floor(window.innerWidth * dpr);
    h = c.height = Math.floor(window.innerHeight * dpr);
    c.style.width = window.innerWidth + "px";
    c.style.height = window.innerHeight + "px";
  }
  resize();
  window.addEventListener("resize", resize);

  const N = Math.round((window.innerWidth * window.innerHeight) / 45000);
  const pts = Array.from({length: Math.max(28, Math.min(90, N))}, () => ({
    x: Math.random()*w,
    y: Math.random()*h,
    vx: (Math.random()*0.35 + 0.10) * (Math.random()<0.5?-1:1),
    vy: (Math.random()*0.35 + 0.10) * (Math.random()<0.5?-1:1),
    r: Math.random()*1.4 + 0.6
  }));

  function draw(){
    ctx.clearRect(0,0,w,h);

    // vignette
    const g = ctx.createRadialGradient(w*0.5,h*0.6, 0, w*0.5,h*0.6, Math.max(w,h)*0.65);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    // links
    for (let i=0;i<pts.length;i++){
      const a = pts[i];
      for (let j=i+1;j<pts.length;j++){
        const b = pts[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist2 = dx*dx+dy*dy;
        const maxD = 180*dpr;
        if (dist2 < maxD*maxD){
          const dist = Math.sqrt(dist2);
          const alpha = (1 - dist/maxD) * 0.22;
          ctx.strokeStyle = `rgba(255,45,45,${alpha})`;
          ctx.lineWidth = 1*dpr;
          ctx.beginPath();
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    // nodes + sparkle
    for (const p of pts){
      p.x += p.vx*dpr;
      p.y += p.vy*dpr;
      if (p.x<0 || p.x>w) p.vx *= -1;
      if (p.y<0 || p.y>h) p.vy *= -1;

      const sparkle = Math.random() < 0.008;
      ctx.fillStyle = sparkle ? "rgba(255,90,90,0.9)" : "rgba(233,233,240,0.22)";
      ctx.beginPath();
      ctx.arc(p.x,p.y, (sparkle?2.2:1.4)*dpr, 0, Math.PI*2);
      ctx.fill();

      if (sparkle){
        ctx.fillStyle = "rgba(255,45,45,0.10)";
        ctx.beginPath();
        ctx.arc(p.x,p.y, 10*dpr, 0, Math.PI*2);
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

// Lead check toggle
(function(){
  const btn = document.getElementById("leadToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const checked = btn.classList.toggle("lead--checked");
    btn.setAttribute("aria-pressed", checked ? "true" : "false");
  });
})();
