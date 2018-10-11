import { configure as dbConfigure, resetDataBase } from './commons/DataBase';
let cfg = require('../config.json').dev.dataBase;
dbConfigure(cfg)
resetDataBase(cfg);

