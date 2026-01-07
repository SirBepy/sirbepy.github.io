/**
 * Date Helper Utilities
 * Provides reusable date and duration calculation functions.
 */

/**
 * Calculates human-readable duration from a date range string
 * @param {string} dateString - Date range in format "Month YYYY - Month YYYY" or "Month YYYY - Present"
 * @returns {string} Human-readable duration like "(2 yrs & 3 mo)" or "(6 mo)"
 */
export function calculateDuration(dateString) {
  const [start, end] = dateString.split(" - ");
  const startDate = new Date(start);
  const endDate = end === "Present" ? new Date() : new Date(end);

  // Calculate total months
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  months -= startDate.getMonth();
  months += endDate.getMonth();
  // Add 1 month to include the starting month
  months += 1;

  let years = Math.floor(months / 12);
  let remainingMonths = months % 12;

  // Rounding logic: 1 month -> 0, 11 months -> 1 year
  if (remainingMonths === 1) {
    remainingMonths = 0;
  } else if (remainingMonths === 11) {
    years += 1;
    remainingMonths = 0;
  }

  let duration = "";
  if (years > 0) {
    duration += `${years} yr${years > 1 ? "s" : ""}`;
  }
  if (remainingMonths > 0) {
    if (years > 0) duration += " & ";
    duration += `${remainingMonths} mo`;
  }

  return `(${duration})`;
}
