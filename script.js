const menuButton = document.getElementById("menu-button");
const mobileMenu = document.getElementById("menu-mobile");
const yearElement = document.getElementById("year");
const revealElements = document.querySelectorAll(".reveal");
const testimonialTrack = document.getElementById("testimonial-track");
const testimonialDots = document.querySelectorAll("#testimonial-dots button");
const counters = document.querySelectorAll(".count-up");

if (menuButton && mobileMenu) {
  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("show"));
}

if (testimonialTrack && testimonialDots.length > 0) {
  let activeIndex = 0;
  let sliderTimer = null;

  const renderSlide = (index) => {
    testimonialTrack.style.transform = `translateX(-${index * 100}%)`;
    testimonialDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("dot-active", dotIndex === index);
      dot.classList.toggle("w-8", dotIndex === index);
      dot.classList.toggle("bg-cyan-600", dotIndex === index);
      dot.classList.toggle("w-2.5", dotIndex !== index);
      dot.classList.toggle("bg-slate-300", dotIndex !== index);
    });
    activeIndex = index;
  };

  const startSlider = () => {
    sliderTimer = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % testimonialDots.length;
      renderSlide(nextIndex);
    }, 4000);
  };

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      renderSlide(index);
      if (sliderTimer) {
        window.clearInterval(sliderTimer);
      }
      startSlider();
    });
  });

  renderSlide(0);
  startSlider();
}

const formatCountValue = (value, format, suffix) => {
  const rounded = Math.round(value);
  const displayValue =
    format === "dot" ? rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : rounded.toString();
  return `${displayValue}${suffix || ""}`;
};

const animateCounter = (element) => {
  if (!element || element.dataset.done === "true") {
    return;
  }

  const target = Number(element.dataset.target || "0");
  const duration = 1200;
  const startAt = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = target * eased;
    element.textContent = formatCountValue(currentValue, element.dataset.format, element.dataset.suffix);

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.dataset.done = "true";
      element.textContent = formatCountValue(target, element.dataset.format, element.dataset.suffix);
    }
  };

  requestAnimationFrame(tick);
};

if (counters.length > 0) {
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => animateCounter(counter));
  }
}
