/**
 * Calendar helper functions for mapping tasks to dates
 */

/**
 * Normalize a date to YYYY-MM-DD format (ignoring time)
 */
export const normalizeDateToString = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Group deadlines by date for calendar view
 * Returns object: { "2024-05-15": [task1, task2], ... }
 */
export const groupDeadlinesByDate = (deadlines) => {
  const grouped = {};
  deadlines.forEach((deadline) => {
    const dateKey = normalizeDateToString(deadline.deadlineDate);
    if (dateKey) {
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(deadline);
    }
  });
  return grouped;
};

/**
 * Get deadlines for a specific date
 */
export const getDeadlinesForDate = (deadlines, date) => {
  const dateKey = normalizeDateToString(date);
  const grouped = groupDeadlinesByDate(deadlines);
  return grouped[dateKey] || [];
};

/**
 * Get count of tasks on a specific date
 */
export const getTaskCountForDate = (deadlines, date) => {
  return getDeadlinesForDate(deadlines, date).length;
};

/**
 * Get the urgency level for a date (based on tasks on that date)
 * Returns: "critical", "urgent", "upcoming", or "normal"
 */
export const getDateUrgency = (deadlines, date) => {
  const tasksOnDate = getDeadlinesForDate(deadlines, date);
  if (!tasksOnDate.length) return "normal";

  // Check if any task is within the hour (critical)
  const now = new Date();
  const hasCritical = tasksOnDate.some((task) => {
    const timeDiff = new Date(task.deadlineDate).getTime() - now.getTime();
    const hourInMs = 60 * 60 * 1000;
    return timeDiff > 0 && timeDiff < hourInMs && task.status === "pending";
  });
  if (hasCritical) return "critical";

  // Check if any task is within 24 hours (urgent)
  const hasUrgent = tasksOnDate.some((task) => {
    const timeDiff = new Date(task.deadlineDate).getTime() - now.getTime();
    const dayInMs = 24 * 60 * 60 * 1000;
    return timeDiff > 0 && timeDiff < dayInMs && task.status === "pending";
  });
  if (hasUrgent) return "urgent";

  // Check for pending tasks in the future
  const hasPending = tasksOnDate.some((task) => task.status === "pending");
  if (hasPending) return "upcoming";

  return "normal";
};

/**
 * Check if date has any pending (not done) tasks
 */
export const hasTasksOnDate = (deadlines, date) => {
  const tasks = getDeadlinesForDate(deadlines, date);
  return tasks.length > 0;
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getFullYear() === checkDate.getFullYear() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getDate() === checkDate.getDate()
  );
};

/**
 * Get display text for a date in calendar
 * If multiple tasks, shows count; otherwise shows first task title
 */
export const getDateDisplayText = (deadlines, date) => {
  const tasks = getDeadlinesForDate(deadlines, date);
  if (!tasks.length) return null;
  if (tasks.length === 1) return tasks[0].title;
  return `${tasks.length} tasks`;
};

/**
 * Get priority color/badge for a task
 */
export const getPriorityColor = (priority) => {
  const colors = {
    high: "text-rose-400 bg-rose-500/10",
    medium: "text-amber-400 bg-amber-500/10",
    low: "text-emerald-400 bg-emerald-500/10",
  };
  return colors[priority] || colors.medium;
};

/**
 * Get status color/badge for a task
 */
export const getStatusColor = (status) => {
  const colors = {
    pending: "text-cyan-400 bg-cyan-500/10",
    done: "text-emerald-400 bg-emerald-500/10",
    in_progress: "text-amber-400 bg-amber-500/10",
  };
  return colors[status] || colors.pending;
};
