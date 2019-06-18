-- create tables for pushing up sensor gyro and compass data
create table users (
    id serial primary key,
    name varchar (200),
    picture varchar (500),
    last_vist bigint default extract(epoch from now()) * 1000
);

-- create tables for logging gps beacon data
create table flags (
    id serial primary key,
    latitude float,
    longitude float,
    updated bigint default extract(epoch from now()) * 1000
);