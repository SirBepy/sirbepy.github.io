const LEVEL_COLORS = [
  "rgba(238,117,244,0.07)",
  "rgba(238,117,244,0.33)",
  "rgba(238,117,244,0.55)",
  "rgba(238,117,244,0.80)",
  "rgba(238,117,244,1.00)",
];

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function buildCalendarHTML(contributions) {
  const weeks = [];
  let currentWeek = [];

  const firstDay = new Date(contributions[0].date).getDay();
  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null);
  }

  for (const day of contributions) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const recentWeeks = weeks.slice(-50);

  const monthHeaders = [];
  let lastMonth = -1;
  let lastYear = -1;
  for (let w = 0; w < recentWeeks.length; w++) {
    const firstReal = recentWeeks[w].find((d) => d !== null);
    if (firstReal) {
      const d = new Date(firstReal.date);
      const month = d.getMonth();
      const year = d.getFullYear();
      if (month !== lastMonth) {
        const showYear = year !== lastYear;
        monthHeaders.push({ index: w, label: MONTH_LABELS[month], year: showYear ? year : null });
        lastMonth = month;
        lastYear = year;
      }
    }
  }

  let yearRow = '<div class="gh-row gh-year-row">';
  yearRow += '<div class="gh-day-label"></div>';
  let hasYears = false;
  let yIdx = 0;
  for (let w = 0; w < recentWeeks.length; w++) {
    if (yIdx < monthHeaders.length && monthHeaders[yIdx].index === w) {
      if (monthHeaders[yIdx].year) {
        yearRow += `<div class="gh-year-label">${monthHeaders[yIdx].year}</div>`;
        hasYears = true;
      } else {
        yearRow += '<div class="gh-month-label"></div>';
      }
      yIdx++;
    } else {
      yearRow += '<div class="gh-month-label"></div>';
    }
  }
  yearRow += "</div>";

  let monthRow = '<div class="gh-row gh-month-row">';
  monthRow += '<div class="gh-day-label"></div>';
  let mIdx = 0;
  for (let w = 0; w < recentWeeks.length; w++) {
    if (mIdx < monthHeaders.length && monthHeaders[mIdx].index === w) {
      monthRow += `<div class="gh-month-label">${monthHeaders[mIdx].label}</div>`;
      mIdx++;
    } else {
      monthRow += '<div class="gh-month-label"></div>';
    }
  }
  monthRow += "</div>";

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  let gridHTML = (hasYears ? yearRow : "") + monthRow;

  for (let row = 0; row < 7; row++) {
    gridHTML += '<div class="gh-row">';
    gridHTML += `<div class="gh-day-label">${dayLabels[row]}</div>`;
    for (let w = 0; w < recentWeeks.length; w++) {
      const day = recentWeeks[w][row];
      if (day) {
        const color = LEVEL_COLORS[day.level] || LEVEL_COLORS[0];
        const tooltip = `${day.count} contribution${day.count !== 1 ? "s" : ""} on ${day.date}`;
        gridHTML += `<div class="gh-cell" style="background:${color}" title="${tooltip}"></div>`;
      } else {
        gridHTML += '<div class="gh-cell gh-empty"></div>';
      }
    }
    gridHTML += "</div>";
  }

  return gridHTML;
}

export async function initGithub(element, username) {
  if (!element || !username) return;

  element.innerHTML = `
    <a
      href="https://github.com/${username}"
      target="_blank"
      rel="noopener noreferrer"
      class="github-card"
    >
      <div class="github-chart-wrapper">
        <div class="github-contributions-title">Last 50 weeks of Github Contributions</div>
        <div class="gh-calendar gh-loading">Loading contributions...</div>
      </div>
      <span class="github-tooltip">Visit GitHub Profile</span>
    </a>
  `;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        const isBelowViewport = entry.boundingClientRect.top > 0;
        if (isBelowViewport) {
          entry.target.classList.remove("visible");
        }
      }
    });
  }, observerOptions);

  const card = element.querySelector(".github-card");
  if (card) observer.observe(card);

  const calendarEl = element.querySelector(".gh-calendar");

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    );
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = await res.json();

    calendarEl.classList.remove("gh-loading");
    calendarEl.innerHTML = buildCalendarHTML(data.contributions);

    if (window.locomotiveScroll) {
      window.locomotiveScroll.update();
    }
  } catch (err) {
    console.error("GitHub contributions failed:", err);
    calendarEl.classList.remove("gh-loading");
    calendarEl.innerHTML =
      '<div class="gh-error">Could not load contributions</div>';
  }
}
