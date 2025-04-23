class Logger {
  constructor() {
    this.debugMode = true;
  }

  log(type, data) {
    if (!this.debugMode) return;
    
    const timestamp = new Date().toISOString();
    console.group(`[${timestamp}] ${type}`);
    console.log(data);
    console.groupEnd();
  }

  error(type, error) {
    console.error(`[${new Date().toISOString()}] ERROR:`, { type, message: error.message, stack: error.stack });
  }
}

export const logger = new Logger(); 