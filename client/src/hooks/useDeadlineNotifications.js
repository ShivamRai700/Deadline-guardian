import { useEffect, useEffectEvent, useMemo, useState } from "react";
import {
  formatDeadlineDateTime,
  getTimeUntilDeadline,
  getUpcomingDeadlineTasks,
  ONE_DAY_MS,
  ONE_HOUR_MS,
} from "../utils/deadlineDates";

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const NOTIFICATION_LOG_KEY = "deadline-guardian.notification-log.v1";
const NOTIFICATION_PERMISSION_KEY = "deadline-guardian.notification-permission-requested.v1";
const NOTIFICATION_LOG_RETENTION_MS = 3 * ONE_DAY_MS;

export default function useDeadlineNotifications(deadlines) {
  const notificationsSupported = typeof window !== "undefined" && "Notification" in window;
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const [permission, setPermission] = useState(getNotificationPermission);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(getPermissionRequestState);

  const upcomingTasks = useMemo(() => getUpcomingDeadlineTasks(deadlines, currentTime), [currentTime, deadlines]);

  const checkDeadlines = useEffectEvent(() => {
    if (!notificationsSupported) {
      return;
    }

    const currentPermission = getNotificationPermission();
    if (currentPermission !== permission) {
      setPermission(currentPermission);
    }

    if (currentPermission !== "granted") {
      return;
    }

    const now = Date.now();
    setCurrentTime(now);
    const previousLog = readNotificationLog();
    // Keep a lightweight client-side history so each task only alerts once per threshold.
    const nextLog = pruneNotificationLog(previousLog, deadlines, now);

    deadlines
      .filter((item) => item.status === "pending")
      .map((item) => {
        const timeUntilDeadline = getTimeUntilDeadline(item.deadlineDate, now);
        if (timeUntilDeadline <= 0 || timeUntilDeadline > ONE_DAY_MS) {
          return null;
        }

        return {
          item,
          // If a task is already inside the final hour, send only the closest reminder.
          threshold: timeUntilDeadline <= ONE_HOUR_MS ? "withinHour" : "withinDay",
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.item.deadlineDate) - new Date(b.item.deadlineDate))
      .forEach(({ item, threshold }) => {
        const taskLog = nextLog[item._id] || {};
        if (taskLog[threshold]) {
          return;
        }

        new Notification("\u23F0 Deadline Reminder", {
          body: `${item.title} is due at ${formatDeadlineDateTime(item.deadlineDate)}`,
        });

        nextLog[item._id] = {
          ...taskLog,
          [threshold]: now,
        };
      });

    writeNotificationLog(nextLog);
  });

  useEffect(() => {
    if (!notificationsSupported) {
      return undefined;
    }

    checkDeadlines();

    const intervalId = window.setInterval(checkDeadlines, CHECK_INTERVAL_MS);
    const handleFocus = () => checkDeadlines();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkDeadlines();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkDeadlines, notificationsSupported]);

  async function requestPermission() {
    if (!notificationsSupported) {
      return "unsupported";
    }

    const currentPermission = getNotificationPermission();
    if (currentPermission !== "default" || hasRequestedPermission) {
      setPermission(currentPermission);
      return currentPermission;
    }

    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, "true");
    setHasRequestedPermission(true);

    const nextPermission = await Notification.requestPermission();
    setPermission(nextPermission);
    return nextPermission;
  }

  return {
    canRequestPermission: notificationsSupported && permission === "default" && !hasRequestedPermission,
    notificationsSupported,
    permission,
    requestPermission,
    upcomingCount: upcomingTasks.length,
    upcomingTasks,
  };
}

function getNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }

  return Notification.permission;
}

function getPermissionRequestState() {
  if (typeof window === "undefined") {
    return false;
  }

  return localStorage.getItem(NOTIFICATION_PERMISSION_KEY) === "true";
}

function readNotificationLog() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = localStorage.getItem(NOTIFICATION_LOG_KEY);
    return rawValue ? JSON.parse(rawValue) : {};
  } catch {
    return {};
  }
}

function writeNotificationLog(log) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(NOTIFICATION_LOG_KEY, JSON.stringify(log));
}

function pruneNotificationLog(log, deadlines, now) {
  const activeTaskIds = new Set(deadlines.filter((item) => item.status === "pending").map((item) => item._id));
  const nextLog = {};

  Object.entries(log).forEach(([taskId, thresholds]) => {
    if (!activeTaskIds.has(taskId)) {
      return;
    }

    const filteredThresholds = Object.fromEntries(
      Object.entries(thresholds).filter(([, timestamp]) => now - timestamp < NOTIFICATION_LOG_RETENTION_MS)
    );

    if (Object.keys(filteredThresholds).length > 0) {
      nextLog[taskId] = filteredThresholds;
    }
  });

  return nextLog;
}
