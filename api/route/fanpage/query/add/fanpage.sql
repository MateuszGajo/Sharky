insert into fanpages(name, description, photo, date)
values($1, $2, 'fanpage.png', $3)
returning id