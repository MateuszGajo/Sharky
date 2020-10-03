insert into groups(name, description, photo, date)
values($1, $2, 'group.png', $3)
returning id