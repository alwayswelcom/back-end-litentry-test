import express, { Express } from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes'


const app: Express = express();

app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use(routes);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is Runing On port 5000");
});
