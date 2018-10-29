import { GET, POST, LogicError, DELETE, defaultOption } from "../commons/MVC";
import { getPageFromParams } from "../commons/Utils";
import { submitLog } from './Log';
import { Project } from "../commons/Models";
import * as _ from 'underscore';

function getProjectFormData(params: any) {
  let p = params as Project;
  return p;
}

/**
 * 获取所有的项目的分页数据
 */
GET('/projects', defaultOption, (context) => {
  let pageCond = getPageFromParams(context.params);
  return context.dbSession.findByPage('project_view', pageCond);
});

/**
 * 查询单个项目信息
 */
GET('/project/:id', defaultOption, async (context) => {
  let project = await context.dbSession.findOne('project_view', { id: context.params.id });
  if (!project) {
    throw new LogicError('不存的项目');
  }
  return project;
});

/**
 * 新建
 */
POST('/project', defaultOption, async (context) => {
  let project = getProjectFormData(context.params);
  await context.dbSession.insert('project', project);
  let res = await submitLog(context, '新建项目', project);
  project.id = res['insertId'];
  return project;
});

/**
 * 修改一个项目
 */
POST('/project/:id', defaultOption, async (context) => {
  let project = getProjectFormData(context.params);
  await context.dbSession.update('project', _.omit(project, 'id'), { id: project.id });
  await submitLog(context, '修改项目', project);
  return {};
});

/**
 * 结束一个项目
 */
DELETE('/project/:id', defaultOption, async (context) => {
  let id = context.params.id;
  let project = await context.dbSession.findOne('project', { id });
  await context.dbSession.update('project', { status: 0 } , { id });
  await submitLog(context, '结束项目', project);
});

