import { expressApp  } from './commons/MVC';
import { configure as dbConfigure } from './commons/DataBase';
import { configure as cacheConfigure } from './commons/Cache';
import './controllers';

const Path = require('path');
const Bundler = require('parcel-bundler');


let app = expressApp




let cfg = require('../config.json');
dbConfigure(cfg.dev.dataBase);
cacheConfigure(cfg.dev.cache);

const bundler = new Bundler(Path.join(__dirname, '../www/index.html'), {});

app.use(bundler.middleware());
app.listen(8972);

console.log('listen to 8972!');


