import { createLogger, transports, format } from 'winston';
import 'winston-mongodb';

const logger = createLogger({
  transports: [
    new transports.MongoDB({
      level: 'info',
      db: `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
      options: { useUnifiedTopology: true },
      collection: 'infoLogs',
      format: format.combine(format.timestamp(), format.json()),
    }),
    new transports.MongoDB({
      level: 'error',
      db: `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
      options: { useUnifiedTopology: true },
      collection: 'errorLogs',
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

export default logger;
