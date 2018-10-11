import { createClient, ClientOpts, RedisClient } from 'redis';

export interface CacheOption {
  timeout?: number;
  host: string;
  port: number;
}

let clientOpt: ClientOpts = null;
let client: RedisClient;
let clientTimeoutHandle = null;

export function configure(options: ClientOpts) {
  clientOpt = options;
}

function resetTimeout() {
  if (clientTimeoutHandle) {
    clearTimeout(clientTimeoutHandle);
  }
  clientTimeoutHandle = setTimeout(() => {
    client.end(true);
    client = null;
  }, clientOpt.connect_timeout || 5000);
}

function getClient() {
  if (!client) {
    client = createClient(clientOpt);
    client.on('error', console.error);
  }

  resetTimeout();
  return client;
}

export class Cache<T> {

  constructor(private cacheName: string) {

  }

  get(name: string): Promise<T> {
    let client = getClient();
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
    let client = getClient();
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
    let client = getClient();
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






