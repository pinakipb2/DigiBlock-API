import { createLogger, transports, format } from 'winston';
import 'winston-mongodb';

// information logger
const infoLogger = createLogger({
  transports: [
    new transports.MongoDB({
      level: 'info',
      db: `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
      options: { useUnifiedTopology: true },
      collection: 'infoLogs',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

// error logger
const errorLogger = createLogger({
  transports: [
    new transports.MongoDB({
      level: 'error',
      db: `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
      options: { useUnifiedTopology: true },
      collection: 'errorLogs',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

export { infoLogger, errorLogger };
