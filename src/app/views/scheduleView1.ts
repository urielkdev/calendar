import Schedule from "../entities/ScheduleEntity";

import utils from "../../utils/utils";

function renderSchedule(schedule: Schedule) {
  return {
    id: schedule.id,
    date: utils.dateToMySqlFormat(schedule.date),
    shiftHours: schedule.shiftHours,
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
