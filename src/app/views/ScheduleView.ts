import Schedule from "../entities/ScheduleEntity";

function renderSchedule(schedule: Schedule) {
  return {
    id: schedule.id,
    date: schedule.date,
    shiftHours: schedule.shiftHours,
    createdAt: schedule.createdAt,
  };
}

function renderSchedules(schedules: Schedule[]) {
  return {
    schedules: schedules.map(renderSchedule),
  };
}

export default {
  renderSchedule,
  renderSchedules,
};
