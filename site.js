import SITE_CONFIG from "./config.js";
   import "./extras.js";

function navLink(href, label, activePage) {
  const activeClass = activePage === href ? "is-active" : "";
  return `<li><a class="${activeClass}" href="${href}">${label}</a></li>`;
}

function scrollLink(targetId, label, activePage) {
  // For scroll links (like About, Experience, and Contact on homepage)
  return `<li><a href="#${targetId}" data-scroll="${targetId}">${label}</a></li>`;
}

export function formatDate(dateValue) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
}

export function setStatus(element, message, variant = "") {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.style.display = "block";  // ← Make sure it's visible
  element.classList.remove("status-success", "status-error");
  element.classList.remove("is-hidden");
  
  if (variant === "success") {
    element.classList.add("status-success");
  }
  if (variant === "error") {
    element.classList.add("status-error");
  }
}

export function hideStatus(element) {
  if (element) {
    element.classList.add("is-hidden");
  }
}

export function bindProfileContent() {
  document.querySelectorAll("[data-profile-name]").forEach((node) => {
    node.textContent = SITE_CONFIG.profile.name;
  });
  document.querySelectorAll("[data-profile-role]").forEach((node) => {
    node.textContent = SITE_CONFIG.profile.role;
  });
  document.querySelectorAll("[data-profile-summary]").forEach((node) => {
    node.textContent = SITE_CONFIG.profile.summary;
  });
}

function initMobileMenu() {
  const menuIcon = document.getElementById("menu-icon");
  const navLinks = document.querySelector(".nav-links");

  if (menuIcon && navLinks) {
    const setOpen = (open) => {
      navLinks.classList.toggle("active", open);
      menuIcon.setAttribute("aria-expanded", String(open));
      menuIcon.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    menuIcon.addEventListener("click", () => {
      setOpen(!navLinks.classList.contains("active"));
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setOpen(false));
    });

    // Close with Escape and return focus to the button
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        setOpen(false);
        menuIcon.focus();
      }
    });
  }
}

function addSkipLink() {
  const main = document.querySelector("main");
  if (!main || document.querySelector(".skip-link")) {
    return;
  }
  if (!main.id) {
    main.id = "main-content";
  }
  main.setAttribute("tabindex", "-1");
  const link = document.createElement("a");
  link.className = "skip-link";
  link.href = `#${main.id}`;
  link.textContent = "Skip to main content";
  document.body.prepend(link);
}

function initScrollLinks() {
  // Handle scroll links (About, Experience, Contact) on homepage
  const scrollLinks = document.querySelectorAll('[data-scroll]');
  scrollLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-scroll");
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
    });
  });
}

export function initSite(activePage) {
  if (!document.title) { document.title = SITE_CONFIG.site.title; }

  addSkipLink();

  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (header) {
    header.className = "header";
    
    // Different nav structure based on current page
    let navLinksHtml = "";
    
    if (activePage === "index.html") {
      // On homepage: About, Experience, and Contact scroll to sections
      navLinksHtml = `
        <li><a href="#about" data-scroll="about">About</a></li>
        <li><a href="#experience" data-scroll="experience">Approach</a></li>
        <li><a href="blog.html">Articles</a></li>
        <li><a href="credentials.html">Credentials</a></li>
        <li></li>
        
      `;
    } else {
      // On other pages: all links go to pages
      navLinksHtml = `
        <li><a href="index.html">About</a></li>
        <li><a href="index.html#experience">Approach</a></li>
        <li><a href="index.html#articles">Articles</a></li>
        <li><a href="credentials.html">Credentials</a></li>
        <li></li>
        
      `;
    }
    
    header.innerHTML = `
      <a class="logo" href="index.html">${SITE_CONFIG.profile.name}</a>
      <nav class="main-nav" aria-label="Main">
      <ul class="nav-links" id="primary-nav">
        ${navLinksHtml}
      </ul>
      </nav>
<div class="header-actions"><a class="visit-btn" href="${SITE_CONFIG.membership.pageUrl}">${SITE_CONFIG.membership.label}</a></div>      <button type="button" id="menu-icon" aria-label="Open menu" aria-expanded="false" aria-controls="primary-nav"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
    `;
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize scroll links (only works on homepage)
    if (activePage === "index.html") {
      initScrollLinks();
    }
  }

  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
         <p>&copy; ${new Date().getFullYear()} ${SITE_CONFIG.profile.name}. All rights reserved.</p><p><a class="footer-link" href="accessibility.html">Accessibility statement</a></p>   <p><a class="footer-link" href="privacy.html">Privacy policy</a></p>   <p><a class="footer-link" href="disclaimer.html">Disclaimer</a></p>
<p><a class="footer-link" href="https://www.linkedin.com/in/guy-haik-78b298202/" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>      ${SITE_CONFIG.youtube.channelUrl ? `<p><a class="footer-link" href="${SITE_CONFIG.youtube.channelUrl}" target="_blank" rel="noopener noreferrer">YouTube</a></p>` : ""}
    `;
  }

  bindProfileContent();

  [
    ["[data-email-link]", SITE_CONFIG.links.email, "mailto:"],
    ["[data-linkedin-link]", SITE_CONFIG.links.linkedin, ""],
    ["[data-youtube-link]", SITE_CONFIG.youtube.channelUrl, ""],
  ].forEach(([selector, value, prefix]) => {
    document.querySelectorAll(selector).forEach((link) => {
      if (!value) {
        link.closest(".contact-card")?.remove();
        return;
      }
      link.href = `${prefix}${value}`;
      link.target = "_blank";
      link.rel = "noreferrer";
    });
  });
}
