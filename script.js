/* =====================================================
   LUMIX — script.js — Core JavaScript
   ===================================================== */

"use strict";

/* ===== Loading Screen ===== */
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      document.body.style.overflow = "";
    }, 1600);
    document.body.style.overflow = "hidden";
  }
  initAll();
});

function initAll() {
  initNavbar();
  initScrollReveal();
  initRippleButtons();
  initToast();
  if (document.querySelector(".hero-slider")) initHeroSlider();
  if (document.querySelector(".testimonial-track")) initTestimonialSlider();
  if (document.querySelector(".accordion-item")) initAccordion();
  if (document.querySelector("#lightbox")) initLightbox();
  if (document.querySelector(".stats-grid")) initCountUp();
  if (document.querySelector(".masonry-grid")) initMasonry();
  if (document.querySelector(".gallery-filters")) initGalleryFilters();
  if (document.querySelector("#contact-form")) initContactForm();
  if (document.querySelector("#signin-form")) initSignInForm();
  if (document.querySelector("#signup-form")) initSignUpForm();
  if (document.querySelector(".password-input")) initPasswordToggle();
  if (document.querySelector(".newsletter-form")) initNewsletter();
  if (document.querySelector(".tab-btn")) initTabs();
  initParallax();
  initCardHovers();
  initWishlist();
  createParticles();
}

/* ===== Navbar ===== */
function initNavbar() {
  const navbar = document.querySelector(".navbar");
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  // Active link highlight
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // Scroll behavior
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      mobileNav.classList.toggle("open");
    });
    // Close on link click
    mobileNav.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        mobileNav.classList.remove("open");
      });
    });
  }
}

/* ===== Scroll Reveal ===== */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

  revealEls.forEach(el => observer.observe(el));
}

/* ===== Ripple Effect on Buttons ===== */
function initRippleButtons() {
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
}

/* ===== Toast ===== */
let toastEl = null;
let toastTimeout = null;

function initToast() {
  toastEl = document.createElement("div");
  toastEl.className = "toast";
  document.body.appendChild(toastEl);
}

function showToast(message, icon = "✅", duration = 3000) {
  if (!toastEl) initToast();
  toastEl.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
  toastEl.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toastEl.classList.remove("show"), duration);
}

/* ===== Hero Slider ===== */
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const prevBtn = document.querySelector(".hero-prev");
  const nextBtn = document.querySelector(".hero-next");
  let current = 0;
  let autoInterval;

  function goTo(idx) {
    slides[current].classList.remove("active");
    dots[current]?.classList.remove("active");
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current]?.classList.add("active");
  }

  function startAuto() {
    autoInterval = setInterval(() => goTo(current + 1), 5000);
  }

  function stopAuto() {
    clearInterval(autoInterval);
  }

  if (slides.length > 0) {
    goTo(0);
    startAuto();
    prevBtn?.addEventListener("click", () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn?.addEventListener("click", () => { stopAuto(); goTo(current + 1); startAuto(); });
    dots.forEach((dot, i) => dot.addEventListener("click", () => { stopAuto(); goTo(i); startAuto(); }));
  }
}

/* ===== Testimonial Slider ===== */
function initTestimonialSlider() {
  const track = document.querySelector(".testimonial-track");
  const slides = track.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".testimonial-dot");
  const prevBtn = document.querySelector(".test-prev");
  const nextBtn = document.querySelector(".test-next");
  let current = 0;
  let interval;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  function startAuto() {
    interval = setInterval(() => goTo(current + 1), 4500);
  }

  goTo(0);
  startAuto();
  prevBtn?.addEventListener("click", () => { clearInterval(interval); goTo(current - 1); startAuto(); });
  nextBtn?.addEventListener("click", () => { clearInterval(interval); goTo(current + 1); startAuto(); });
  dots.forEach((d, i) => d.addEventListener("click", () => { clearInterval(interval); goTo(i); startAuto(); }));

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  track.addEventListener("touchend", e => {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      clearInterval(interval);
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });
}

/* ===== Accordion ===== */
function initAccordion() {
  document.querySelectorAll(".accordion-item").forEach(item => {
    const trigger = item.querySelector(".accordion-trigger");
    const body = item.querySelector(".accordion-body");
    const icon = item.querySelector(".accordion-icon");

    trigger.addEventListener("click", () => {
      const isOpen = body.classList.contains("open");
      // Close all
      document.querySelectorAll(".accordion-body.open").forEach(b => b.classList.remove("open"));
      document.querySelectorAll(".accordion-icon.rotated").forEach(i => i.classList.remove("rotated"));
      document.querySelectorAll(".accordion-item.active").forEach(i => i.classList.remove("active"));
      // Open clicked (if was closed)
      if (!isOpen) {
        body.classList.add("open");
        icon?.classList.add("rotated");
        item.classList.add("active");
      }
    });
  });
}

/* ===== Lightbox ===== */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector(".lightbox-img");
  const closeBtn = lightbox.querySelector(".lightbox-close");
  const prevBtn = lightbox.querySelector(".lightbox-prev");
  const nextBtn = lightbox.querySelector(".lightbox-next");
  let images = [];
  let currentIdx = 0;

  function openLightbox(idx) {
    currentIdx = idx;
    lightboxImg.src = images[currentIdx].src;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function navigate(dir) {
    currentIdx = (currentIdx + dir + images.length) % images.length;
    lightboxImg.style.opacity = "0";
    setTimeout(() => {
      lightboxImg.src = images[currentIdx].src;
      lightboxImg.style.opacity = "1";
    }, 200);
  }

  document.querySelectorAll(".gallery-item img, [data-lightbox]").forEach((img, idx) => {
    images.push(img);
    img.parentElement.addEventListener("click", () => openLightbox(idx));
  });

  closeBtn?.addEventListener("click", closeLightbox);
  prevBtn?.addEventListener("click", () => navigate(-1));
  nextBtn?.addEventListener("click", () => navigate(1));
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });
}

/* ===== Count Up (Stats) ===== */
function initCountUp() {
  const stats = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        const prefix = el.getAttribute("data-prefix") || "";
        const decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals")) : 0;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = prefix + current.toFixed(decimals) + suffix;
        }, 16);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(el => observer.observe(el));
}

/* ===== Masonry Layout ===== */
function initMasonry() {
  // CSS columns handles masonry — JS adds lazy loading
  const lazyImages = document.querySelectorAll("img[data-src]");
  if (!lazyImages.length) return;
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute("data-src");
        img.removeAttribute("data-src");
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: "200px" });
  lazyImages.forEach(img => imgObserver.observe(img));
}

/* ===== Gallery Filters ===== */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll(".gallery-filter-btn");
  const items = document.querySelectorAll(".gallery-item");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      items.forEach(item => {
        const cat = item.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          item.style.display = "";
          item.style.animation = "fadeIn 0.4s ease";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

/* ===== Parallax ===== */
function initParallax() {
  const parallaxEls = document.querySelectorAll(".parallax");
  if (!parallaxEls.length) return;
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.getAttribute("data-speed") || "0.3");
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

/* ===== Card hover tilt ===== */
function initCardHovers() {
  document.querySelectorAll(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(10px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

/* ===== Wishlist ===== */
function initWishlist() {
  document.querySelectorAll(".wishlist-btn").forEach(btn => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      this.classList.toggle("active");
      const isActive = this.classList.contains("active");
      this.innerHTML = isActive ? "❤️" : "🤍";
      showToast(isActive ? "Added to Watchlist!" : "Removed from Watchlist", isActive ? "❤️" : "💔");
    });
  });
}

/* ===== Particles ===== */
function createParticles() {
  const hero = document.querySelector(".hero-section, .auth-bg");
  if (!hero) return;
  for (let i = 0; i < 15; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-delay: ${Math.random() * 4}s;
      animation-duration: ${3 + Math.random() * 4}s;
      width: ${2 + Math.random() * 4}px;
      height: ${2 + Math.random() * 4}px;
      opacity: ${0.3 + Math.random() * 0.5};
    `;
    hero.appendChild(p);
  }
}

/* ===== Tabs ===== */
function initTabs() {
  document.querySelectorAll(".tabs").forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll(".tab-btn");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.getAttribute("data-target");
        if (target) {
          document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
          document.getElementById(target)?.classList.add("active");
        }
      });
    });
  });
}

/* ===== Password Toggle ===== */
function initPasswordToggle() {
  document.querySelectorAll(".input-toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {
      const input = toggle.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        toggle.textContent = "🙈";
      } else {
        input.type = "password";
        toggle.textContent = "👁";
      }
    });
  });
}

/* ===== Contact Form ===== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll("[required]").forEach(field => {
      if (!field.value.trim()) {
        field.classList.add("error");
        valid = false;
      } else {
        field.classList.remove("error");
      }
    });
    if (valid) {
      const btn = form.querySelector("button[type=submit]");
      btn.textContent = "Sending...";
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.textContent = "Send Message";
        btn.disabled = false;
        showToast("Message sent! We'll get back to you soon.", "📧");
      }, 1500);
    }
  });
}

/* ===== Sign In Form ===== */
function initSignInForm() {
  const form = document.getElementById("signin-form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;
    const email = form.querySelector("#signin-email");
    const password = form.querySelector("#signin-password");
    const emailError = form.querySelector("#signin-email-error");
    const passError = form.querySelector("#signin-pass-error");

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      email.classList.add("error");
      emailError?.classList.add("visible");
      valid = false;
    } else {
      email.classList.remove("error");
      emailError?.classList.remove("visible");
    }

    if (!password.value || password.value.length < 6) {
      password.classList.add("error");
      passError?.classList.add("visible");
      valid = false;
    } else {
      password.classList.remove("error");
      passError?.classList.remove("visible");
    }

    if (valid) {
      const btn = form.querySelector(".btn-primary");
      btn.textContent = "Signing In...";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "Sign In";
        btn.disabled = false;
        showToast("Welcome back to LUMIX! 🎬", "✨");
        setTimeout(() => { window.location.href = "index.html"; }, 1500);
      }, 1500);
    }
  });
}

/* ===== Sign Up Form ===== */
function initSignUpForm() {
  const form = document.getElementById("signup-form");
  const passwordStrengthBar = document.getElementById("strength-bar");
  const passwordInput = form.querySelector("#signup-password");

  passwordInput?.addEventListener("input", () => {
    const val = passwordInput.value;
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    const pct = (strength / 4) * 100;
    if (passwordStrengthBar) {
      passwordStrengthBar.style.width = pct + "%";
      passwordStrengthBar.style.background = strength <= 1 ? "#ef4444" : strength <= 2 ? "#f59e0b" : strength <= 3 ? "#06b6d4" : "#10b981";
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;
    const fields = form.querySelectorAll("[required]");
    fields.forEach(f => {
      if (!f.value.trim()) {
        f.classList.add("error");
        valid = false;
      } else {
        f.classList.remove("error");
      }
    });

    const pass = form.querySelector("#signup-password")?.value;
    const confirm = form.querySelector("#signup-confirm")?.value;
    const confirmErr = form.querySelector("#confirm-error");
    if (pass && confirm && pass !== confirm) {
      form.querySelector("#signup-confirm").classList.add("error");
      confirmErr?.classList.add("visible");
      valid = false;
    } else {
      confirmErr?.classList.remove("visible");
    }

    const terms = form.querySelector("#terms");
    if (terms && !terms.checked) {
      showToast("Please accept the Terms & Conditions", "⚠️");
      valid = false;
    }

    if (valid) {
      const btn = form.querySelector(".btn-primary");
      btn.textContent = "Creating Account...";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "Create Account";
        btn.disabled = false;
        showToast("Account created! Welcome to LUMIX 🎬", "🎉");
        setTimeout(() => { window.location.href = "signin.html"; }, 1500);
      }, 1800);
    }
  });
}

/* ===== Newsletter ===== */
function initNewsletter() {
  document.querySelectorAll(".newsletter-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const input = form.querySelector(".newsletter-input");
      if (input.value && /\S+@\S+\.\S+/.test(input.value)) {
        showToast("Subscribed! Welcome to LUMIX Insider 🎬", "🎉");
        input.value = "";
      } else {
        showToast("Please enter a valid email address", "⚠️");
      }
    });
  });
}

/* ===== Quick View ===== */
function openQuickView(title, price, rating) {
  showToast(`Quick View: ${title} — ${price}`, "🎬");
}

/* ===== Search functionality ===== */
function initSearch() {
  const searchOverlay = document.getElementById("search-overlay");
  const searchBtn = document.querySelector(".nav-search-btn");
  const searchClose = document.querySelector(".search-close");
  const searchInput = document.querySelector(".search-input");

  searchBtn?.addEventListener("click", () => {
    searchOverlay?.classList.add("open");
    searchInput?.focus();
  });
  searchClose?.addEventListener("click", () => searchOverlay?.classList.remove("open"));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") searchOverlay?.classList.remove("open");
  });
}
