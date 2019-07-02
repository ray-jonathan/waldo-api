-- create tables for pushing up sensor gyro and compass data
create table users (
    id varchar (50),
    name varchar (200),
    picture varchar (500),
    latitude float,
    longitude float,
    team smallint,
    last_update bigint default extract(epoch from now()) * 1000
);

-- create tables for logging gps beacon data
create table flags (
    id serial primary key,
    team smallint,
    latitude float,
    longitude float,
    last_update bigint default extract(epoch from now()) * 1000
);

-- create table game (
--     id serial primary key,
--     team_1 text [],
--     team_2 text [],
--     isActive boolean
-- );