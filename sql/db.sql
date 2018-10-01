drop database tenth_legion;
create database tenth_legion;

use tenth_legion;

create table `user`  (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(30) not null,
  `password` varchar(50),
  `role` varchar(10),
  `privileges` JSON,
  `disabled` int
) ENGINE=InnoDB;

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
  `status`   int,
  `description` text
) ENGINE=InnoDB;


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
  `tags` JSON,
  `description` text
) ENGINE=InnoDB;

create table `task_tag` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title`  varchar(30) not null
);

create table `task_comment` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `task_id`  int not null,
  `author_user_id`  int not null,
  `created_time` int not null,
  `update_time`  int,
  `content` text not null
) ENGINE=InnoDB;





