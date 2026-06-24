const cron = require("node-cron");
const monitorEngineService = require("../services/monitorEngineService");

const runningChecks = new Set();
let tickTask = null;

const processDueMonitors = async () => {
  const dueMonitors = await monitorEngineService.getDueMonitors();

  await Promise.all(
    dueMonitors.map(async (monitor) => {
      const monitorId = monitor._id.toString();

      if (runningChecks.has(monitorId)) {
        return;
      }

      runningChecks.add(monitorId);

      try {
        await monitorEngineService.runMonitorCheck(monitorId);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Monitor check failed for ${monitorId}:`, error.message);
      } finally {
        runningChecks.delete(monitorId);
      }
    })
  );
};

const startMonitorScheduler = (tickSeconds = 30) => {
  if (tickTask) {
    return tickTask;
  }

  const safeTick = Math.max(10, Math.min(tickSeconds, 60));
  const cronExpression = `*/${safeTick} * * * * *`;

  tickTask = cron.schedule(cronExpression, () => {
    processDueMonitors().catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Monitor scheduler tick failed:", error.message);
    });
  });

  // eslint-disable-next-line no-console
  console.log(`Monitor scheduler started (every ${safeTick}s)`);

  processDueMonitors().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Initial monitor scheduler run failed:", error.message);
  });

  return tickTask;
};

const stopMonitorScheduler = () => {
  if (tickTask) {
    tickTask.stop();
    tickTask = null;
  }
};

module.exports = {
  startMonitorScheduler,
  stopMonitorScheduler,
  processDueMonitors,
};
