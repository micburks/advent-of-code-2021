drop schema if exists day02 cascade;
create schema day02;
set search_path=day02;

create table day02.input (
  id serial,
  direction text,
  value integer
);

-- \copy day02.input (direction, value) from 'day02/example.txt' with delimiter ' ';
\copy day02.input (direction, value) from 'day02/input.txt' with delimiter ' ';

-- part 1
create view day02.part1 as
with sums as (
  select
    sum(value) filter (where direction='forward') as forward,
    sum(value) filter (where direction='up') as up,
    sum(value) filter (where direction='down') as down
  from day02.input
)
select 
  forward as position,
  down - up as depth
from sums;

-- select
--   position,
--   depth,
--   position * depth as multiplied
-- from day02.part1;

-- part 2
create view day02.part2 as
with with_aim as (
  select *,
    sum(
      case
        when direction = 'up' then 0 - value
        when direction = 'down' then value
        else 0
      end
    ) over w as aim
  from day02.input
  window w as (order by id)
)
select
  id,
  direction,
  value,
  aim,
  sum(value) filter (where direction='forward') over w as position,
  sum(value * aim) filter (where direction='forward') over w as depth
from with_aim
window w as (order by id);

select 
  position,
  depth,
  position * depth as mulitplied
from day02.part2
order by id desc
limit 1;
