import { socialLinks } from "../data/portfolioData.js";

export function initFooter(element) {
  if (!element) return;

  const currentYear = new Date().getFullYear();

  const linksHtml = socialLinks
    .map(
      (link) => `
    <a href="${link.url}"
       class="footer-link underline-hover"
       target="_blank"
       rel="noopener noreferrer"
       aria-label="${link.name}">
      ${link.icon}
      <span>${link.name}</span>
    </a>
  `
    )
    .join("");

  element.innerHTML = `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          ${linksHtml}
        </div>
        <div class="footer-credits">
          <p>&copy; ${currentYear} Josip Mužić</p>
        </div>
      </div>
    </footer>
  `;
}
