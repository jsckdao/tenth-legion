import { createClient, ClientOpts, RedisClient } from 'redis';

export interface CacheOption {
  host: string;
  port: number;
}

let clientOpt: ClientOpts = null;
let client: RedisClient;

export function configure(options: ClientOpts) {
  clientOpt = options;
}

export function init() {
  if (!client) {
    client = createClient(clientOpt);
    client.on('error', console.error);
  }
}

export class Cache<T> {

  constructor(private cacheName: string) {

  }

  get(name: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      client.hget(this.cacheName, name, (err, content) => {
        if (err) {
          reject(err);
        }
        else if (!content){
          resolve(null);
        }
        else {
          try {
            resolve(JSON.parse(content) as T);
          }
          catch (e) {
            resolve(null);
          }
        }
      })
    });
  }

  set(name: string, data: T) {
    return new Promise<void>((resolve, reject) => {
      client.hset(this.cacheName, name, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      });
    });
  }

  remove(... name: string[]) {
    return new Promise<void>((resolve, reject) => {
      client.hdel(this.cacheName, name, (err) => {
        if (err) {
          reject(err);
        }
        else {
          resolve();
        }
      })
    });
  }
}






