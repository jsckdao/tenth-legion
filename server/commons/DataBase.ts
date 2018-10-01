import { createConnection, ConnectionConfig, Connection } from 'mysql';
import { compact } from 'underscore';
import { rejects } from 'assert';

export type DBData = string | number;

/**
 * 数据库配置定义
 */
export interface DataBaseConfig extends ConnectionConfig {
  showSql?: boolean;
}

/**
 * 查询条件
 */
export interface Condition {
  [key: string]: DBData | DBData[];
}

/**
 * 分页查询条件
 */
export interface PageCondition {
  fields: string[];
  condition?: Condition;
  sortField?: string;
  sortAsc?: boolean;
  curpage?: number;
  perpage?: number;
}

/**
 * 分页数据
 */
export interface PageData extends PageCondition {
  data: any[];
  total?: number;
}


let cfg: DataBaseConfig = null;

function wrapSign(k) {
  return '`' + k + '`';
}

export function configure(option: DataBaseConfig) {
  cfg = option;
}

export class DBSession {

  private _hasBeginTransaction = false;

  constructor(private connection: Connection) {}

  get hasBeginTransation() {
    return this._hasBeginTransaction;
  }

  beginTransaction() :Promise<void> {
    if (this._hasBeginTransaction) {
      return Promise.resolve();
    }
    else return new Promise((resolve, reject) => this.connection.beginTransaction((err) => {
      if (err) reject(err);
      else {
        this._hasBeginTransaction = true;
        resolve();
      }
    }));
  }

  /**
   * 插入
   * @param table
   * @param data
   */
  async insert(table: string, data: {}) :Promise<any> {
    await this.beginTransaction();
    let keys = Object.keys(data), values = keys.map(k => data[k]);
    let sql = `insert into \`${table}\` (${keys.map(wrapSign).join(',')}) values (${keys.map(k => '?').join(',')})`;
    return this.exec(sql, values);
  }

  /**
   * 更新
   * @param table
   * @param data
   * @param where
   */
  async update(table: string, data: {}, where: Condition) :Promise<any> {
    await this.beginTransaction();
    let keys = Object.keys(data), values = keys.map(k => data[k]);
    let { whereSql, whereValues } = createConditionSql(where);
    let updateSql = `update \`${table}\` set ${keys.map(k => `\`${k}\`=?`).join(',')} where ${whereSql}`;
    values.push(... whereValues);
    return this.exec(updateSql, values);
  }

  /**
   * 删除
   * @param table
   * @param where
   */
  async delete(table: string, where: Condition): Promise<any> {
    await this.beginTransaction();
    let { whereSql, whereValues } = createConditionSql(where);
    let deleteSql = `delete from \`${table}\` where ${whereSql}`;
    return this.exec(deleteSql, whereValues);
  }

  /**
   * 获取满足条件的一个数据
   * @param table
   * @param where
   */
  findOne(table: string, where: Condition) {
    let { whereSql, whereValues } = createConditionSql(where);
    return this.exec(`select * from ${table} where ${whereSql}`, whereValues).then((res) => {
      if (res.length > 0) return res[0];
      else return null;
    })
  }

  /**
   * 查询满足条件的数据是否存在
   * @param table
   * @param where
   */
  exists(table: string, where: Condition) :Promise<boolean> {
    let { whereSql, whereValues } = createConditionSql(where);
    return this.exec(`select count(*) as count from ${table} where ${whereSql}`, whereValues).then((res) => {
      return res[0]['count'] > 0;
    })
  }

  /**
   * 分页查询
   * @param table
   * @param pageCondition
   */
  findByPage(table: string, pageCondition: PageCondition): Promise<PageData> {
    let values = [];
    let { condition, fields, sortField, sortAsc, curpage, perpage } = pageCondition;
    let { whereSql, whereValues } = createConditionSql(condition);

    if (whereSql) {
      whereSql = whereSql ? 'where ' + whereSql : '';
      values.push(... whereValues);
    }

    curpage = curpage || 1;
    perpage = perpage || 10;

    let sortSql = sortField ? 'order by ' + sortField + ' ' + (sortAsc ? 'asc' : 'desc'): '';
    let limitSql = `limit ${Math.max(0, curpage - 1) * perpage},${perpage}`;
    let fieldsSql = fields && fields.length > 0 ? fields.map(wrapSign).join(',') : '*';
    let sql = `select ${fieldsSql} from ${wrapSign(table)} ${whereSql} ${sortSql} ${limitSql}`;
    let countSql = `select count(*) as count from ${wrapSign(table)} ${whereSql}`;

    return Promise.all([this.exec(sql, values), this.exec(countSql, values)]).then(([result, count]) => {
      return {
        fields, sortAsc, sortField, condition,
        data: result as any[],
        perpage, curpage,
        total: count[0]['count'],
      } as PageData;
    });
  }

  /**
   * 直接执行一段 sql
   * @param sql
   * @param values
   */
  exec(sql: string, values: DBData[]) {
    if (cfg.showSql) {
      console.debug(sql);
    }
    return new Promise<any>((resolve, reject) => this.connection.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      }
      else {
        resolve(result);
      }
    }));
  }

  rollback() {
    return new Promise((resolve, reject) =>this.connection.rollback((err) => {
      if (err) reject(err);
      else resolve({});
    }));
  }

  commit() {
    return new Promise((resolve, reject) => {
      this.connection.commit((err) => {
        if (err) reject(err);
        else resolve({});
      })
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.connection.end((err) => {
        if (err) reject(err);
        else resolve({});
      });
    });
  }
}

const signsMap = {
  'eq': '=',
  'lt': '<',
  'gt': '>',
  'lte': '<=',
  'gte': '>=',
  'ne': '<>',
  'in': 'in',
  'nin': 'not in',
  'like': 'like'
};

/**
 * 创建条件查询语句
 * @param where
 */
function createConditionSql(where: Condition): { whereSql: string, whereValues: DBData[] } {
  if (!where) return { whereSql: '', whereValues: [] };
  let keys = Object.keys(where), values = [];
  let sql = keys.map(key => {
    let [propName, sign] = compact(key.split('__'));
    let value = where[key];
    sign = sign || 'eq';
    if (sign == 'in' || sign == 'nin') {
      if (!(value instanceof Array)) {
        throw new Error('in 语句中必须传入数组');
      }
      let arr = value as DBData[];
      values.push(... arr);
      return `\`${propName}\` ${signsMap[sign]} (${arr.map(v => '?').join(',')})`;
    }
    else if (signsMap[sign]) {
      values.push(value);
      return `\`${propName}\` ${signsMap[sign]} ?`;
    }
  }).join(' and ');

  return { whereSql: sql, whereValues: values };
}

export function openSession() {
  return new DBSession(createConnection(cfg));
}
