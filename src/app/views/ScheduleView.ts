import Schedule from "../entities/ScheduleEntity";

import utils from "../../utils/utils";

function renderSchedule(schedule: Schedule) {
  console.log(schedule.date);
  console.log(typeof schedule.date);
  return {
    id: schedule.id,
    date: utils.dateToMySqlFormat(schedule.date),
    shiftHours: schedule.shiftHours,
    createdAt: utils.dateToMySqlFormat(schedule.createdAt),
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
