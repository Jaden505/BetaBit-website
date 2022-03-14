USE `pad_bbi_8_dev` ;

select * from schedules s
inner join users u on u.username = ?
where s.date >= ?
  and s.date <= ?;