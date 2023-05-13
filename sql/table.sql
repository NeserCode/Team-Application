-- 用户登录表项
drop table IF EXISTS team_user_info;
create table team_user_info(
	id int auto_increment primary key,
    username varchar(24) unique not null,
    password varchar(54) not null,
    status int not null default 0,
    super int not null default 0,
    appKey varchar(60) not null,
    userKey varchar(60) unique not null,
    checkKey varchar(60)
);

-- 用户信息
drop table IF EXISTS team_user_detail;
create table team_user_detail(
	id int primary key,
    nickname varchar(60),
    avatar varchar(120),
    sex varchar(6),
    introduce varchar(240),
    access_status int not null default 0,
    access_team varchar(60),
    access_position varchar(60),
    bound varchar(60),
    exp bigint default 0,
    FOREIGN KEY fk_userid(id) REFERENCES team_user_info(id)
    FOREIGN KEY fk_access_team(access_team) REFERENCES team_organization_info(id)
);

-- 用户签到表
drop table IF EXISTS team_user_checkDay;
create table team_user_checkDay(
	id int auto_increment primary key,
    userid int not null,
    appKey varchar(60) not null,
    timeStamp varchar(20) not null,
    FOREIGN KEY fk_userid(userid) REFERENCES team_user_info(id)
    FOREIGN KEY fk_appkey(appKey) REFERENCES team_user_info(appKey)
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
    FOREIGN KEY fk_appkey(appKey) REFERENCES team_user_info(appKey)
);

-- 组织信息表
drop table IF EXISTS team_organization_info;
create table team_organization_info(
	id int auto_increment primary key,
    status int not null default 0,
    appKey varchar(60) not null,
    hostId int not null unique,
    name varchar(60) not null,
    exp bigint default 0,
    organizationKey varchar(60) unique not null,
    FOREIGN KEY fk_hostid(hostId) REFERENCES team_user_info(id)
    FOREIGN KEY fk_appkey(appKey) REFERENCES team_user_info(appKey)
);

-- 公告表
drop table IF EXISTS team_notice;
create table team_notice(
    id int auto_increment primary key,
    oid varchar(60),
    open int not null default 0,
    content text not null,
    timeStamp varchar(30) not null,
    FOREIGN KEY fk_oid(oid) REFERENCES team_organization_info(id)
);
















