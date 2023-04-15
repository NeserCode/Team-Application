-- 用户登录表项
drop table IF EXISTS team_user_info;
create table team_user_info(
	id int auto_increment primary key,
    username varchar(24) unique not null,
    password varchar(54) not null,
    status int not null default 0,
    appKey varchar(60) not null,
    userKey varchar(60) unique not null,
    checkKey varchar(60)
);

-- 用户信息
drop table IF EXISTS team_user_detail;
create table team_user_detail(
	id int primary key,
    nickname varchar(60) unique,
    avatar varchar(120),
    sex varchar(6),
    introduce varchar(240),
    access_status int not null default 0,
    access_team varchar(60),
    access_position varchar(60),
    bound varchar(60) unique,
    exp bigint default 0,
    FOREIGN KEY fk_userid(id) REFERENCES team_user_info(id)
);

-- 用户签到表
drop table IF EXISTS team_user_checkDay;
create table team_user_checkDay(
	id int auto_increment primary key,
    userid int not null,
    appKey varchar(60) not null,
    timeStamp varchar(20) not null,
    FOREIGN KEY fk_userid(userid) REFERENCES team_user_info(id)
);

-- Leetcode提交表
drop table IF EXISTS team_leetcode_submit;
create table team_leetcode_submit(
	id int auto_increment primary key,
    userid int not null,
    leetName varchar(60),
    appKey varchar(60) not null,
    submitId varchar(30) not null,
    status varchar(30),
	timeStamp varchar(30) not null,
    FOREIGN KEY fk_userid(userid) REFERENCES team_user_info(id)
);















