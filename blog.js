import { loadPostIndex, renderPostListItem } from "./blog-data.js";
import { initSite } from "./site.js";

async function initBlogPage() {
  initSite("blog.html");

  const blogList = document.getElementById("blog-list");
  
  const params = new URLSearchParams(window.location.search);
  const filterTag = params.get("tag");

  // Customize header based on tag
  const defaultConfig = {
    eyebrow: '',
    title: 'Articles for the inner life',
    description: 'Perspectives and questions for understanding yourself, meeting uncertainty, and living with greater intention.'
  };

  const config = defaultConfig;

  const eyebrowEl = document.getElementById('dynamic-eyebrow');
  const titleEl = document.getElementById('dynamic-title');
  const descEl = document.getElementById('dynamic-description');
  
  if (eyebrowEl) eyebrowEl.textContent = config.eyebrow;
  if (titleEl) titleEl.textContent = config.title;
  if (descEl) descEl.textContent = config.description;
  
  document.title = `${config.title} | Guy Haik`;

  try {
    let posts = await loadPostIndex();
    
    if (posts.length === 0) {
      blogList.innerHTML = '<p style="text-align:center; padding:2rem; color: var(--muted);">No posts found in this category yet. Check back soon!</p>';
    } else {
      // Pinned articles are shown first, in this order. The rest keep their usual order.
      const pinnedSlugs = ["why-are-we-always-waiting-to-start-living", "how-to-deal-with-an-angry-person"];
      const pinned = pinnedSlugs.map((slug) => posts.find((p) => p.slug === slug)).filter(Boolean);
      posts = [...pinned, ...posts.filter((p) => !pinnedSlugs.includes(p.slug))];
      blogList.innerHTML = posts.map(renderPostListItem).join("");
    }
    
  } catch (error) {
    console.error("Error:", error);
    blogList.innerHTML = '<p style="text-align:center; padding:2rem; color: var(--muted);">Error loading posts. Please try again later.</p>';
  }
}

initBlogPage();
