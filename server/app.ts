import { expressApp  } from './commons/MVC';
import { configure as dbConfigure } from './commons/DataBase';
import { configure as cacheConfigure } from './commons/Cache';
import './controllers';


let app = expressApp




let cfg = require('../config.json');
dbConfigure(cfg.dev.dataBase);
cacheConfigure(cfg.dev.cache);

app.listen(8972);

console.log('listen to 8972!');


