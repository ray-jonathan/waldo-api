-- create tables for pushing up sensor gyro and compass data
create table users (
    id serial primary key,
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
    color varchar(25),
    latitude float,
    longitude float,
    last_update bigint default extract(epoch from now()) * 1000
);