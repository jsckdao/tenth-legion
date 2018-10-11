import { ApiRequestContext, GET, defaultOption, OnlineUser } from "../commons/MVC";
import { Log } from "../commons/Models";
import { now } from 'moment';
import { omit } from "underscore";
import { PageCondition } from "../commons/DataBase";


/**
 * 记录一次操作日志
 * @param context
 * @param action
 * @param info
 */
export async function submitLog(context: ApiRequestContext, action: string, info?: any): Promise<void> {
  let user = await context.currentUser;
  return submitLogByUser(context, user, action, info);
}

/**
 * 记录一次操作日志
 * @param context
 * @param action
 * @param info
 */
export function submitLogByUser(context: ApiRequestContext, user: OnlineUser, action: string, info?: any): Promise<void> {
  let data: Log = {
    user_id: user.id,
    user_name: user.name,
    action,
    created_time: now()
  };

  return context.dbSession.insert('log', { info: JSON.stringify(data.info || '{}'), ... omit(data, 'info') });
}


/**
 * 日志分页查询
 */
GET('/logs', defaultOption, async (context) => {
  let result = await context.dbSession.findByPage('log', context.params as PageCondition);
  result.data = result.data.map(d => {
    if (d.info) {
      try {
        d.info = JSON.parse(d.info);
      }
      catch(e) {
        d.info = {};
      }
    }
  });

  return result;
});
