import express from 'express';
import { sequelize } from './sequelize';

require('dotenv').config();

import { IndexRouter } from './controllers/v1/index.router';

import bodyParser from 'body-parser';

import { V1MODELS } from './controllers/v1/model.index';

(async () => {
  await sequelize.addModels(V1MODELS);
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080; // default port to listen
  
  app.use(bodyParser.json());

  //CORS allow all since clients are unknown for now
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use('/api/v1/', IndexRouter)

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send( "/api/v1/" );
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();