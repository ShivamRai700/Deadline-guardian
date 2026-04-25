export const ONE_HOUR_MS = 60 * 60 * 1000;
export const ONE_DAY_MS = 24 * ONE_HOUR_MS;

export function normalizeDateOnly(value) {
  if (typeof value === "string") {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsed = new Date(value);
  return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
}

export function getDaysDiff(dateValue, baseDate = normalizeDateOnly(new Date())) {
  const target = normalizeDateOnly(dateValue);
  return Math.round((target - baseDate) / 86400000);
}

export function getUrgencyBucket(item, dayDiff) {
  if (item.status === "done") return "done";
  if (dayDiff <= 2) return "urgent";
  if (dayDiff >= 3 && dayDiff <= 7) return "upcoming";
  return "later";
}

export function getTimeUntilDeadline(dateValue, now = Date.now()) {
  return new Date(dateValue).getTime() - now;
}

export function getUpcomingDeadlineTasks(deadlines, now = Date.now()) {
  return [...deadlines]
    .filter((item) => item.status === "pending")
    .map((item) => ({ ...item, timeUntilDeadline: getTimeUntilDeadline(item.deadlineDate, now) }))
    .filter((item) => item.timeUntilDeadline > 0 && item.timeUntilDeadline <= ONE_DAY_MS)
    .sort((a, b) => a.timeUntilDeadline - b.timeUntilDeadline);
}

export function getDeadlineAlertLevel(item, now = Date.now()) {
  if (item.status === "done") return "done";

  const timeUntilDeadline = getTimeUntilDeadline(item.deadlineDate, now);
  if (timeUntilDeadline < 0) return "overdue";
  if (timeUntilDeadline <= ONE_HOUR_MS) return "withinHour";
  if (timeUntilDeadline <= ONE_DAY_MS) return "withinDay";
  return "normal";
}

export function formatDeadlineDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDeadlineDateTime(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatTimeUntilDeadline(dateValue, now = Date.now()) {
  const timeUntilDeadline = getTimeUntilDeadline(dateValue, now);

  if (timeUntilDeadline < 0) {
    const overdueMs = Math.abs(timeUntilDeadline);
    if (overdueMs < ONE_HOUR_MS) {
      const minutes = Math.max(1, Math.ceil(overdueMs / 60000));
      return `Overdue by ${minutes} min`;
    }

    if (overdueMs < ONE_DAY_MS) {
      const hours = Math.max(1, Math.ceil(overdueMs / ONE_HOUR_MS));
      return `Overdue by ${hours} hour${hours === 1 ? "" : "s"}`;
    }

    const days = Math.abs(getDaysDiff(dateValue));
    return `Overdue by ${days} day${days === 1 ? "" : "s"}`;
  }

  if (timeUntilDeadline <= ONE_HOUR_MS) {
    const minutes = Math.max(1, Math.ceil(timeUntilDeadline / 60000));
    return `Due in ${minutes} min`;
  }

  if (timeUntilDeadline <= ONE_DAY_MS) {
    const hours = Math.max(1, Math.ceil(timeUntilDeadline / ONE_HOUR_MS));
    return `Due in ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const dayDiff = getDaysDiff(dateValue);
  if (dayDiff === 0) return "Due today";
  if (dayDiff === 1) return "Due tomorrow";
  return `Due in ${dayDiff} days`;
}

export function formatDeadlineInputValue(value) {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  const localDate = new Date(parsed.getTime() - parsed.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function toDeadlineApiValue(value) {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString();
}
