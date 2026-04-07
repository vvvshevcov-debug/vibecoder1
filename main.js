(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initRevealSections() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    if (reduce) {
      nodes.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    nodes.forEach(function (el) {
      io.observe(el);
    });
  }

  function splitToWords(el) {
    var text = (el.textContent || "").trim();
    el.textContent = "";

    var frag = document.createDocumentFragment();
    var parts = text.split(/\s+/);
    for (var i = 0; i < parts.length; i += 1) {
      var span = document.createElement("span");
      span.className = "split-word";
      span.textContent = parts[i];
      frag.appendChild(span);
      if (i < parts.length - 1) frag.appendChild(document.createTextNode(" "));
    }

    el.appendChild(frag);
    return el.querySelectorAll(".split-word");
  }

  function initHeroTitleGsap() {
    var title = document.querySelector(".hero__title");
    if (!title) return;
    if (title.dataset.splitAnimated === "true") return;

    // Эквивалент threshold=0.1 + rootMargin=-100px из вашего примера.
    var threshold = 0.1;
    var rootMargin = -100;

    if (reduce || !window.gsap) {
      title.dataset.splitAnimated = "true";
      return;
    }

    if (window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
    }

    var words = splitToWords(title);
    if (!words.length) return;

    window.gsap.fromTo(
      words,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.25,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: {
          trigger: title,
          start: "top " + ((1 - threshold) * 100) + "%+=" + Math.abs(rootMargin) + "px",
          once: true
        },
        onComplete: function () {
          title.dataset.splitAnimated = "true";
          console.log("All letters have animated!");
        }
      }
    );
  }

  initRevealSections();
  initHeroTitleGsap();
})();
