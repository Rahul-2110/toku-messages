import express from 'express';
import connectDB from './db';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import messagesRoutes from './routes/messages.routes';
import config from './config'; 
import initialSetup from './db/migrations/initial_setup';
import { authenticateToken } from './middlewares/auth';
import { ipRateLimiter, userRateLimiter } from './utils/rateLimit';


(async () => {
  await connectDB();
  await initialSetup();
})();


const app = express();


app.use(bodyParser.json());
app.use(ipRateLimiter); 


app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use('/api/v1/', authRoutes);



app.use('/api/v1/chat', authenticateToken, chatRoutes);
app.use('/api/v1/message', authenticateToken, messagesRoutes);


app.listen(config.get('port'), () => {
  return console.log(`Express is listening at http://localhost:${config.get('port')}`);
});