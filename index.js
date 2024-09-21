import app from "./app/server.js";
import { PORT } from "./config.js";
import initializeDatabase from "./db/init.js";

const APP_PORT = PORT || 6677;

(async function () {
  try {  
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`[#] Application server listening on port ${APP_PORT}`);
    });
  } catch (err) {
    console.error({ application_error: `[!] Error starting the application: ${err}`})
  }
})();