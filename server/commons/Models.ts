
/**
 * 用户模型数据
 */
export interface User {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  skype?: string;
  email?: string;
  role?: string;
  privileges?: string[];
  disabled?: boolean;
}

/**
 * 操作日志模型
 */
export interface Log {
  user_id: number;
  user_name?: string;
  created_time: number;
  action: string;
  info?: any
}

export interface Project {
  id?: number;
  name?: string;
  develop_user_id?: number;
  develop_user_name?: number;
  test_user_id?: number;
  test_user_name?: number;
  start_time?: number;
  end_time?: number;
  repository_url?: string;
  dev_url?: string;
  pre_url?: string;
  online_url?: string;

  /**
   * 项目状态 0 为删除, 1 为正在进行
   */
  status?: number;
  description?: string;
}

export interface Task {

}
