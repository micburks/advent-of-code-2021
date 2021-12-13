drop schema if exists day01 cascade;
create schema day01;
set search_path=day01;

create table day01.depth (
  id serial,
  value text
);

-- \copy day01.depth (value) from 'day01/example.txt';
\copy day01.depth (value) from 'day01/input.txt';

-- part 1
create view day01.part1 as
with pairs as (
  select
    d1.value as from,
    d2.value as to,
    d1.value < d2.value as increased
  from day01.depth d1
    join day01.depth d2 on d2.id - 1 = d1.id
)
select count(*) from pairs where increased;

-- select * from day01.part1;


-- alternate part 1
create view day01.alternate_part1 as
with pairs as (
  select value,
    lag(value) over (order by id) as prev
  from day01.depth
  offset 1
)
select count(*) from pairs where prev < value;

select * from day01.alternate_part1;





-- part 2
create sequence iter start 1;
create view day01.part2 as
with triads as (
  select
    nextval('iter') as id,
    v1::integer + v2::integer + v3::integer as sum
    from (
      select
        d1.value as v1,
        d2.value as v2,
        d3.value as v3
      from day01.depth d1
        join day01.depth d2 on d2.id - 1 = d1.id
        join day01.depth d3 on d3.id - 1 = d2.id
    ) vals
),
joined_triads as (
  select t2.sum > t1.sum as increased
  from triads t1
    join triads t2 on t2.id - 1 = t1.id
)
select count(*) from joined_triads where increased;

-- select * from day01.part2;


-- alternate part 2
create view day01.alternate_part2 as
with triad_sums as (
  select nextval('iter') as id,
    value::integer + (lag(value) over (order by id))::integer + (lag(value, 2) over (order by id)::integer) as sum
  from day01.depth
  offset 2
),
triad_cmp as (
  select sum,
    lag(sum) over (order by id) as prev
  from triad_sums
  offset 1
)
select count(*) from triad_cmp where prev < sum;

select * from day01.alternate_part2;
