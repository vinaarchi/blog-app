import cron from "node-cron";

const scheduleTask = () => {
  // setiap menit
  cron.schedule("* * * * *", () => {
    console.log(`[INFO] Run Task every minutes ${new Date().toLocaleString()}`);
    //Task
  });

  // setiap hari jam 11.00
  cron.schedule("0 11 * * *", () => {
    console.log(`[INFO] Run Task every 11:00 ${new Date().toLocaleString()}`);
    //Task
  });

  // setiap 5 menit sekali
  cron.schedule("*/5 * * * *", () => {
    console.log(`[INFO] Run Task every 5 minutes ${new Date().toLocaleString()}`);
    //Task
  });

  // setiap 5 menit sekali
  cron.schedule("0 8 * * 1,3", () => {
    console.log(`[INFO] Run Task every Monday ${new Date().toLocaleString()}`);
    //Task
  });
};

export default scheduleTask;
