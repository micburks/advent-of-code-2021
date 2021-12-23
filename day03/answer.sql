drop schema if exists day03 cascade;
create schema day03;
set search_path=day03;

create table day03.input (
  id serial,
  value text
);

\copy day03.input (value) from 'day03/example.txt';
-- \copy day03.input (value) from 'day03/input.txt';

-- part 1
create view day03.part1 as
with split as (
  select 
    id,
    regexp_split_to_table(trim(value), '') as val
  from day03.input
),
with_position as (
  select 
    id,
    row_number() over (partition by id order by id) as position,
    val::integer
  from split
),
calc as (
  select 
    position,
    case when avg(val) > .5 then 1 else 0 end as most_common
  from with_position
  group by position
  order by position
)
select 
  lpad(string_agg(most_common::text, ''), 32, '0')::bit(32)::integer as gamma,
  (~ lpad(string_agg(most_common::text, ''), 32, '1')::bit(32))::integer as epsilon
from calc;

select
  gamma,
  epsilon,
  gamma * epsilon as multiplied
from day03.part1;

-- alternatively useful
-- select *
-- from day03.input,
--   unnest(regexp_split_to_array(value, '')) with ordinality as t(char, index)
-- ;

-- til
-- lpad so you don't have to know the current size of the binary string
-- ~ bitwise not so you don't have to doubly calculate avg
-- row_number to find position over a partition
-- can have multiple tables in from clause without joining them together
-- can unnest with ordinality and define types in as t()
-- mode & within group



-- part 2
create view day03.part2 as
with stuff as (
)
select * from stuff;
