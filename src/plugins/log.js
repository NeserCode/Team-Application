import { reactive } from 'vue'
// 只处理渲染进程中的日志，在渲染进程中调用
const app = require('electron').remote.app;
const fs = require('fs');
const path = require('path');

export class Log {
  AllLogSize = reactive(this.getSize());

  constructor() {
    this.initLog();

    this.watchLogFileChange(() => {
      let size = this.getSize();
      this.AllLogSize.rawSize = size.rawSize;
      this.AllLogSize.size = size.size;
    })
  }

  initLog() {
    const logPath = path.join(app.getPath('userData'), 'logs');
    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath);
    }
  }

  getTimeString() {
    // 数字
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    const addZero = (num) => (num < 10 ? `0${num}` : num)
    // 字符串
    return `${year}${addZero(month)}${addZero(day)} ${addZero(hour)}-${addZero(
      minute
    )}-${addZero(second)}`
  }

  createLog(file, content = "") {
    const logPath = path.join(app.getPath('userData'), 'logs', file);
    const logContent = content;
    if (!file) {
      fs.writeFileSync(path.join(app.getPath('userData'), 'logs', `${this.getTimeString()}.txt`), logContent);
      return;
    } else
      fs.writeFile(logPath, logContent, (err) => {
        if (err) {
          this.createLog
          this.error(err);
        }
      })
  }

  writeLog(content) {
    const logFile = this.getLatestLogFile();
    const logContent = this.getLogContent(logFile);

    const newLogContent = logContent + content;
    this.createLog(logFile, newLogContent);
  }

  getLatestLogFile() {
    const logFiles = this.getLogFiles();
    const latestLog = logFiles[logFiles.length - 1];
    return latestLog;
  }

  getLogFiles() {
    const logPath = path.join(app.getPath('userData'), 'logs');
    const logFiles = fs.readdirSync(logPath);
    return logFiles;
  }

  getLogContent(file) {
    if (!file) {
      fs.writeFileSync(path.join(app.getPath('userData'), 'logs', `${this.getTimeString()}.txt`), "");
      return;
    } else {
      const logPath = path.join(app.getPath('userData'), 'logs', file);
      const logContent = fs.readFileSync(logPath, 'utf8');
      return logContent;
    }
  }

  // 代替 console 方法
  // Format: [2019-01-01 00:00:00] [INFO] [message]
  log(message) {
    const addZero = (num) => {
      return num < 10 ? `0${num}` : num;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = addZero(date.getMonth() + 1);
    const day = addZero(date.getDate());
    const hour = addZero(date.getHours());
    const minute = addZero(date.getMinutes());
    const second = addZero(date.getSeconds());

    const logMessage = `[${year}-${month}-${day} ${hour}:${minute}:${second}] [INFO] ${JSON.stringify(message)}\n\n`;
    this.writeLog(logMessage);
  }

  // Format: [2019-01-01 00:00:00] [ERROR] [message]
  error(message) {
    const addZero = (num) => {
      return num < 10 ? `0${num}` : num;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = addZero(date.getMonth() + 1);
    const day = addZero(date.getDate());
    const hour = addZero(date.getHours());
    const minute = addZero(date.getMinutes());
    const second = addZero(date.getSeconds());

    const logMessage = `[${year}-${month}-${day} ${hour}:${minute}:${second}] [ERROR] ${JSON.stringify(message)}\n\n`;
    this.writeLog(logMessage);
  }

  // Format: [2019-01-01 00:00:00] [WARN] [message]
  warn(message) {
    const addZero = (num) => {
      return num < 10 ? `0${num}` : num;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = addZero(date.getMonth() + 1);
    const day = addZero(date.getDate());
    const hour = addZero(date.getHours());
    const minute = addZero(date.getMinutes());
    const second = addZero(date.getSeconds());

    const logMessage = `[${year}-${month}-${day} ${hour}:${minute}:${second}] [WARN] ${JSON.stringify(message)}\n\n`;
    this.writeLog(logMessage);
  }

  // Format: [2019-01-01 00:00:00] [DEBUG] [message]
  debug(message) {
    const addZero = (num) => {
      return num < 10 ? `0${num}` : num;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = addZero(date.getMonth() + 1);
    const day = addZero(date.getDate());
    const hour = addZero(date.getHours());
    const minute = addZero(date.getMinutes());
    const second = addZero(date.getSeconds());

    const logMessage = `[${year}-${month}-${day} ${hour}:${minute}:${second}] [DEBUG] ${JSON.stringify(message)}\n\n`;
    this.writeLog(logMessage);
  }

  // Log 操作
  getSize() {
    const logFiles = this.getLogFiles();
    let size = 0;
    logFiles.forEach((file) => {
      const logPath = path.join(app.getPath('userData'), 'logs', file);
      const stats = fs.statSync(logPath);
      size += stats.size;
    })

    function format(size) {
      if (size < 1024) {
        return `${size}B`;
      } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)}KB`;
      } else if (size < 1024 * 1024 * 1024) {
        return `${(size / 1024 / 1024).toFixed(2)}MB`;
      }
    }

    return {
      rawSize: size,
      size: format(size)
    };
  }

  clearAllLog() {
    // fs.unlinkSync
    const logFiles = this.getLogFiles();
    try {
      logFiles.forEach((file) => {
        fs.unlinkSync(path.join(app.getPath('userData'), 'logs', file));
      })
    } catch (error) {
      this.error(error);
    }

    return true
  }

  watchLogFileChange(cb) {
    const logPath = path.join(app.getPath('userData'), 'logs');
    fs.watch(logPath, (event, filename) => {
      cb && cb(event, filename);
    })
  }
}