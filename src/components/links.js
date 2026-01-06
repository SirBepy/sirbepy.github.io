import { socialLinks } from "../data/portfolioData.js";

export function initLinks(element) {
  if (!element) return;

  const linksHtml = socialLinks
    .map(
      (link) => `
    <a href="${link.url}" 
       class="social-link" 
       target="_blank" rel="noopener noreferrer"
       aria-label="${link.name}">
      ${link.icon}
      <span>${link.name}</span>
    </a>
  `
    )
    .join("");

  element.innerHTML = `
    <div class="links-container">
      ${linksHtml}
    </div>
  `;
}
