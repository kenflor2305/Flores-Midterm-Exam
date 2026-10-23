
/* ========================================
   COCA-COLA WEBSITE JAVASCRIPT
======================================== */

document.addEventListener("DOMContentLoaded", () => {
  // FOOTER YEAR
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // DARK MODE
  const darkModeToggle = document.getElementById("darkModeToggle");
  const themeIcon = document.getElementById("themeIcon");

  function updateThemeButton() {
    const isDark = document.documentElement.classList.contains("dark");

    if (themeIcon) {
      themeIcon.textContent = isDark ? "Light Mode" : "Dark Mode";
    }

    if (darkModeToggle) {
      darkModeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
      );
    }
  }

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("coke-theme");
  } catch (error) {
    savedTheme = null;
  }

  if (
    savedTheme === "dark" ||
    (!savedTheme &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  }

  updateThemeButton();

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");

      try {
        localStorage.setItem("coke-theme", isDark ? "dark" : "light");
      } catch (error) {
        // The theme still works if storage is unavailable.
      }

      updateThemeButton();
    });
  }


  // CONTACT FORM
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("name").value.trim();

      formStatus.textContent =
        `Thank you, ${name}! Your demo message has been received.`;

      formStatus.classList.remove("text-red-600");
      formStatus.classList.add("text-green-600");

      contactForm.reset();
    });
  }


  // GSAP ANIMATIONS
  if (typeof gsap === "undefined") {
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }


  // HERO INTRO ANIMATION
  const introTimeline = gsap.timeline({
    defaults: {
      duration: 0.8,
      ease: "power3.out"
    }
  });

  introTimeline
    .from("#heroText p", {
      y: 25,
      opacity: 0
    })
    .from("#heroText h1", {
      y: 45,
      opacity: 0
    }, "-=0.45")
    .from("#heroText > p:nth-of-type(2)", {
      y: 25,
      opacity: 0
    }, "-=0.45")
    .from("#heroText a", {
      y: 20,
      opacity: 0
    }, "-=0.4")
    .from("#heroImage img", {
      scale: 0.9,
      opacity: 0,
      duration: 1
    }, "-=0.65");


  // REPLAY INTRO ANIMATION
  const replayBtn = document.getElementById("replayBtn");

  if (replayBtn) {
    replayBtn.addEventListener("click", () => {
      introTimeline.restart();
    });
  }


  // SCROLL REVEAL ANIMATIONS
  if (typeof ScrollTrigger !== "undefined") {
    const motionSettings = gsap.matchMedia();

    motionSettings.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        normalMotion: "(prefers-reduced-motion: no-preference)"
      },
      (context) => {
        const { reduceMotion } = context.conditions;

        if (reduceMotion) {
          gsap.set(".reveal", {
            clearProps: "all"
          });

          gsap.set("#heroText, #heroImage img", {
            clearProps: "all"
          });

          return;
        }

        gsap.utils.toArray(".reveal").forEach((element) => {
          gsap.from(element, {
            y: 45,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",

            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"

              // Add markers: true to show ScrollTrigger start/end markers.
            }
          });
        });

        // SCROLL PROGRESS BAR
        gsap.to("#progressBar", {
          width: "100%",
          ease: "none",

          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
          }
        });

        return () => {
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
      }
    );
  }

});
