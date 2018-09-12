import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs';

let test = 'this is test';

let app = express();

const webBase = join(__dirname, 'public');

app.use('/', express.static(webBase));

app.get('*', (req, res) => {
  fs.exists(join(webBase, 'index.html'), (exists) => {
    if (exists) {
      let out = fs.createReadStream(join(webBase, 'index.html'));
      out.pipe(res);
    }
    else {
      res.status(404);
      res.end('404');
    }
  });
});


app.listen(8972);

console.log('listen to 8972!');


