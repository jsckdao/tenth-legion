drop table if exists `user`;
create table `user`  (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(30) not null,
  `name` varchar(100) not null,
  `password` varchar(50),
  `email` varchar(200),
  `skype` varchar(100),
  `role` varchar(10),
  `privileges` varchar(255),
  `disabled` tinyint(1) default 0
) ENGINE=InnoDB;

drop table if exists `project`;
create table `project`  (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(30) not null,
  `develop_user_id` int,
  `test_user_id` int,
  `start_time` int,
  `end_time` int,
  `repository_url` varchar(255),
  `dev_url`  varchar(255),
  `pre_url`  varchar(255),
  `online_url`  varchar(255),
  `status`   int  default 1,
  `description` text
) ENGINE=InnoDB;

drop view if exists `project_view`;
create view `project_view`
as select
  p.id as `id`,
  p.name as `name`,
  p.develop_user_id as `develop_user_id`,
  u1.name as `develop_user_name`,
  p.test_user_id as `test_user_id`,
  u2.name as `test_user_name`,
  p.status as `status`,
  p.start_time as `start_time`,
  p.end_time as `end_time`,
  p.repository_url as `repository_url`,
  p.dev_url as `dev_url`,
  p.pre_url as `pre_url`,
  p.online_url as `online_url`,
  p.description as `description`
from `project` as p
left join
  `user` as u1
on p.develop_user_id = u1.id
left join
  `user` as u2
on p.test_user_id = u2.id;

drop table if exists `task`;
create table `task` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `project_id` int not null,
  `title` varchar(255) not null,
  `start_time`  int,
  `end_time`  int,
  `created_time`  int,
  `update_time`  int,
  `author_user_id`  int,
  `assign_user_id`  int,
  `status` int default 0,
  `level`  int,
  `tags` varchar(255),
  `description` text
) ENGINE=InnoDB;

drop table if exists `task_tag`;
create table `task_tag` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title`  varchar(30) not null
);

drop table if exists `task_comment`;
create table `task_comment` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `task_id`  int not null,
  `author_user_id`  int not null,
  `created_time` int not null,
  `update_time`  int,
  `content` text not null
) ENGINE=InnoDB;


drop table if exists `log`;
create table `log` (
  `user_id` int not null,
  `user_name` varchar(20),
  `created_time` bigint not null,
  `action` varchar(20) not null,
  `info` text,
  primary key (`created_time`, `user_id`)
 ) ENGINE=InnoDB;


insert into `user` (`username`,`password`,`name`) value ('admin', '2a5af3af891c42b336f76e95cde41d37', '管理员');








