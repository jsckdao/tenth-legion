import { GET, POST, LogicError, DELETE } from "../commons/MVC";
import { getPageFromParams } from "../commons/Utils";
import { submitLog } from './Log';
import { Project } from "../commons/Models";
import * as _ from 'underscore';

function getProjectFormData(params: any) {
  return params as Project;
}

/**
 * 获取所有的项目的分页数据
 */
GET('/projects', (context) => {
  let pageCond = getPageFromParams(context.params);
  return context.dbSession.findByPage('project', pageCond);
});

/**
 * 新建
 */
POST('/project', async (context) => {
  let project = getProjectFormData(context.params);
  await context.dbSession.insert('project', project);
  let res = await submitLog(context, '新建项目', project);
  project.id = res['insertId'];
  return {};
});

/**
 * 修改一个项目
 */
POST('/project/:id', async (context) => {
  let project = getProjectFormData(context.params);
  await context.dbSession.update('project', _.omit(project, 'id'), { id: project.id });
  await submitLog(context, '修改项目', project);
  return {};
});

/**
 * 结束一个项目
 */
DELETE('/project/:id', async (context) => {
  let id = context.params.id;
  let project = await context.dbSession.findOne('project', { id });
  await context.dbSession.update('project', { status: 0 } , { id });
  await submitLog(context, '结束项目', project);
});

