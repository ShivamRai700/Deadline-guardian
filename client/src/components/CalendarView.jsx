import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  groupDeadlinesByDate,
  getDeadlinesForDate,
  getDateUrgency,
  isToday,
  getPriorityColor,
  getStatusColor,
} from "../utils/calendarHelpers";
import { formatDeadlineDateTime, formatTimeUntilDeadline } from "../utils/deadlineDates";

// Helper function to capitalize text
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

export default function CalendarView({
  deadlines = [],
  onEditTask,
  onDeleteTask,
  readOnly = false,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);

  // Group deadlines by date
  const groupedDeadlines = useMemo(() => {
    return groupDeadlinesByDate(deadlines);
  }, [deadlines]);

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    return getDeadlinesForDate(deadlines, selectedDate);
  }, [deadlines, selectedDate]);

  // Get dates with tasks for highlighting
  const datesWithTasks = useMemo(() => {
    return Object.keys(groupedDeadlines).map((dateStr) => new Date(dateStr));
  }, [groupedDeadlines]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (getDeadlinesForDate(deadlines, date).length > 0) {
      setShowDetailsPanel(true);
    }
  };

  const getTileClassName = (date) => {
    // Safely convert date to ISO string
    let dateStr;
    try {
      if (typeof date === "string") {
        dateStr = date.split("T")[0];
      } else if (date instanceof Date) {
        dateStr = date.toISOString().split("T")[0];
      } else {
        return "";
      }
    } catch (e) {
      return "";
    }

    const urgency = getDateUrgency(deadlines, date);
    const hasTasksFlag = dateStr in groupedDeadlines;

    if (!hasTasksFlag) return "";

    // Base classes for all dates with tasks
    let classes = "calendar-date-with-tasks ";

    // Add urgency-specific classes
    if (urgency === "critical") {
      classes += "urgency-critical";
    } else if (urgency === "urgent") {
      classes += "urgency-urgent";
    } else if (urgency === "upcoming") {
      classes += "urgency-upcoming";
    } else {
      classes += "urgency-normal";
    }

    // Highlight today
    if (isToday(date)) {
      classes += " is-today";
    }

    return classes;
  };

  const getTileContent = (date) => {
    try {
      const tasks = getDeadlinesForDate(deadlines, date);
      if (!tasks.length) return null;

      if (tasks.length === 1) {
        return (
          <div className="calendar-tile-content">
            <span className="task-title-short">{tasks[0].title.slice(0, 15)}</span>
          </div>
        );
      }

      return (
        <div className="calendar-tile-content">
          <span className="task-count">+{tasks.length}</span>
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="calendar-view-container">
      <div className="calendar-main">
        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          tileClassName={getTileClassName}
          tileContent={getTileContent}
          className="deadline-calendar"
          minDetail="month"
        />

        <style>{`
          /* Calendar Component Styling */
          .deadline-calendar {
            width: 100%;
            background: transparent;
            border: 0;
            font-family: inherit;
          }

          .deadline-calendar .react-calendar__wrapper {
            background: transparent;
            border: 0;
          }

          .deadline-calendar .react-calendar__month-view {
            background: transparent;
          }

          /* Navigation */
          .deadline-calendar .react-calendar__navigation {
            margin-bottom: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: transparent;
          }

          .deadline-calendar .react-calendar__navigation button {
            background: transparent;
            border: 1px solid rgba(71, 85, 105, 0.5);
            color: #cbd5e1;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            transition: all 0.2s;
            cursor: pointer;
          }

          .deadline-calendar .react-calendar__navigation button:hover {
            background: rgba(30, 41, 59, 0.8);
            border-color: rgba(71, 85, 105, 0.8);
          }

          .deadline-calendar .react-calendar__navigation__label {
            background: transparent;
            border: 0;
            color: #f1f5f9;
            font-size: 1rem;
            font-weight: 600;
            padding: 0.5rem;
            cursor: default;
            flex-grow: 1;
            text-align: center;
          }

          /* Weekday headers */
          .deadline-calendar .react-calendar__month-view__weekdays {
            text-align: center;
            font-weight: 600;
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
            gap: 0.25rem;
            display: grid;
            grid-template-columns: repeat(7, 1fr);
          }

          .deadline-calendar .react-calendar__month-view__weekdays__weekday {
            background: transparent;
            border: 0;
            padding: 0.75rem 0;
            color: #94a3b8;
            text-decoration: none;
            font-weight: 500;
          }

          /* Days grid */
          .deadline-calendar .react-calendar__month-view__days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.25rem;
            background: transparent;
          }

          /* Day tiles */
          .deadline-calendar .react-calendar__tile {
            background: #1e293b;
            border: 1px solid #334155;
            color: #cbd5e1;
            padding: 0.5rem;
            position: relative;
            min-height: 4rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.2s ease;
            overflow: hidden;
          }

          .deadline-calendar .react-calendar__tile:hover {
            background: #334155;
            border-color: #475569;
            transform: translateY(-2px);
          }

          /* Disabled days (other months) */
          .deadline-calendar .react-calendar__tile--outside {
            background: transparent;
            color: #64748b;
            opacity: 0.5;
          }

          /* Selected date */
          .deadline-calendar .react-calendar__tile--active {
            background: #4f46e5;
            border-color: #4338ca;
            color: #f1f5f9;
          }

          .deadline-calendar .react-calendar__tile--active:hover {
            background: #4338ca;
          }

          /* Dates with tasks - base styling */
          .deadline-calendar .calendar-date-with-tasks {
            border-width: 1.5px;
            font-weight: 500;
          }

          /* Urgency levels */
          .deadline-calendar .urgency-critical {
            background: rgba(225, 29, 72, 0.15);
            border-color: #f43f5e;
          }

          .deadline-calendar .urgency-critical:hover {
            background: rgba(225, 29, 72, 0.25);
            border-color: #e11d48;
          }

          .deadline-calendar .urgency-urgent {
            background: rgba(217, 119, 6, 0.15);
            border-color: #f59e0b;
          }

          .deadline-calendar .urgency-urgent:hover {
            background: rgba(217, 119, 6, 0.25);
            border-color: #d97706;
          }

          .deadline-calendar .urgency-upcoming {
            background: rgba(6, 182, 212, 0.1);
            border-color: #06b6d4;
          }

          .deadline-calendar .urgency-upcoming:hover {
            background: rgba(6, 182, 212, 0.2);
            border-color: #0891b2;
          }

          .deadline-calendar .urgency-normal {
            background: rgba(71, 85, 105, 0.1);
            border-color: #64748b;
          }

          .deadline-calendar .urgency-normal:hover {
            background: rgba(71, 85, 105, 0.2);
            border-color: #94a3b8;
          }

          /* Today highlight */
          .deadline-calendar .is-today {
            box-shadow: inset 0 0 0 2px #10b981;
          }

          /* Tile content */
          .calendar-tile-content {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            gap: 0.25rem;
          }

          .task-title-short {
            font-size: 0.7rem;
            font-weight: 500;
            line-height: 1;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .task-count {
            font-size: 0.75rem;
            font-weight: 600;
            color: #60a5fa;
            padding: 0.125rem 0.25rem;
            background: rgba(96, 165, 250, 0.2);
            border-radius: 0.25rem;
            display: inline-block;
            width: fit-content;
          }

          /* Footer navigation (today button) */
          .deadline-calendar .react-calendar__navigation__today-button {
            background: #06b6d4;
            color: #0f172a;
            border: 0;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .deadline-calendar .react-calendar__navigation__today-button:hover {
            background: #0891b2;
          }
        `}</style>
      </div>

      {/* Side Panel for Selected Date Details */}
      {showDetailsPanel && (
        <div className="calendar-details-panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </h3>
              <p className="panel-subtitle">
                {isToday(selectedDate) && <span className="today-badge">Today</span>}
              </p>
            </div>
            <button
              onClick={() => setShowDetailsPanel(false)}
              className="panel-close-btn"
              aria-label="Close details"
            >
              ✕
            </button>
          </div>

          <div className="panel-content">
            {selectedDateTasks.length > 0 ? (
              <div className="tasks-list">
                {selectedDateTasks.map((task) => (
                  <div
                    key={task._id}
                    className="task-item"
                  >
                    <div className="task-main">
                      <h4 className="task-item-title">{task.title}</h4>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                      <p className="task-time">
                        {formatDeadlineDateTime(task.deadlineDate)} •{" "}
                        {formatTimeUntilDeadline(task.deadlineDate)}
                      </p>
                      <div className="task-badges">
                        <span className={`badge ${getPriorityColor(task.priority)}`}>
                          {capitalize(task.priority)}
                        </span>
                        <span className={`badge ${getStatusColor(task.status)}`}>
                          {capitalize(task.status)}
                        </span>
                      </div>
                    </div>
                    {!readOnly && (
                      <div className="task-actions">
                        <button
                          onClick={() => onEditTask(task)}
                          className="btn-edit"
                          aria-label="Edit task"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDeleteTask(task._id)}
                          className="btn-delete"
                          aria-label="Delete task"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-tasks">
                <p>No tasks scheduled for this date</p>
              </div>
            )}
          </div>

          <style>{`
            /* Details Panel */
            .calendar-details-panel {
              background: #1e293b;
              border: 1px solid #334155;
              border-radius: 0.75rem;
              display: flex;
              flex-direction: column;
              height: 100%;
              overflow: hidden;
            }

            .panel-header {
              padding: 1rem;
              border-bottom: 1px solid #334155;
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #0f172a;
            }

            .panel-title {
              font-size: 1rem;
              font-weight: 600;
              color: #f1f5f9;
              margin: 0;
            }

            .panel-subtitle {
              font-size: 0.75rem;
              color: #94a3b8;
              margin: 0.25rem 0 0 0;
            }

            .today-badge {
              display: inline-block;
              background: #10b981;
              color: #0f172a;
              padding: 0.125rem 0.5rem;
              border-radius: 0.25rem;
              font-size: 0.7rem;
              font-weight: 600;
            }

            .panel-close-btn {
              background: transparent;
              border: 1px solid #475569;
              color: #cbd5e1;
              width: 2rem;
              height: 2rem;
              border-radius: 0.5rem;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;
            }

            .panel-close-btn:hover {
              background: #334155;
              border-color: #64748b;
            }

            .panel-content {
              overflow-y: auto;
              flex: 1;
              padding: 1rem;
            }

            .tasks-list {
              display: flex;
              flex-direction: column;
              gap: 0.75rem;
            }

            .task-item {
              background: #334155;
              border: 1px solid #475569;
              border-radius: 0.5rem;
              padding: 0.875rem;
              display: flex;
              justify-content: space-between;
              gap: 0.75rem;
              transition: all 0.2s;
            }

            .task-item:hover {
              border-color: #64748b;
              background: #475569;
            }

            .task-main {
              flex: 1;
              min-w: 0;
            }

            .task-item-title {
              font-size: 0.9rem;
              font-weight: 600;
              color: #f1f5f9;
              margin: 0 0 0.25rem 0;
              word-break: break-word;
            }

            .task-description {
              font-size: 0.8rem;
              color: #cbd5e1;
              margin: 0.25rem 0;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .task-time {
              font-size: 0.75rem;
              color: #94a3b8;
              margin: 0.25rem 0 0.5rem 0;
            }

            .task-badges {
              display: flex;
              flex-wrap: wrap;
              gap: 0.375rem;
            }

            .badge {
              display: inline-block;
              padding: 0.25rem 0.5rem;
              border-radius: 0.375rem;
              font-size: 0.7rem;
              font-weight: 500;
            }

            .task-actions {
              display: flex;
              gap: 0.375rem;
              flex-shrink: 0;
            }

            .btn-edit,
            .btn-delete {
              padding: 0.375rem 0.625rem;
              font-size: 0.7rem;
              border-radius: 0.375rem;
              cursor: pointer;
              transition: all 0.2s;
              border: 0;
              font-weight: 500;
            }

            .btn-edit {
              background: #475569;
              color: #cbd5e1;
            }

            .btn-edit:hover {
              background: #64748b;
            }

            .btn-delete {
              background: #7f1d1d;
              color: #fecaca;
            }

            .btn-delete:hover {
              background: #991b1b;
            }

            .no-tasks {
              text-align: center;
              padding: 2rem 1rem;
              color: #94a3b8;
            }

            .no-tasks p {
              margin: 0;
              font-size: 0.9rem;
            }
          `}</style>
        </div>
      )}

      {/* Main container styles */}
      <style>{`
        .calendar-view-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          width: 100%;
          height: auto;
        }

        @media (min-width: 1024px) {
          .calendar-view-container {
            grid-template-columns: 1.2fr 0.8fr;
            height: 600px;
          }

          .calendar-details-panel {
            max-height: 600px;
          }
        }

        .calendar-main {
          width: 100%;
          height: 100%;
          overflow-y: auto;
          padding: 1.5rem;
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
}
