with groupIds as(
    select b.group_id
    from(
            select a.group_id
            from group_users as a
            where user_id = $1
        ) as b
        left join(
            select a.group_id
            from group_users as a
            where user_id = $2
        ) as c on c.group_id = b.group_id
    where c.group_id is null
)
select a."subId",
    a."groupId",
    a."numberOfMembers",
    b.name,
    b.description,
    b.photo
from(
        select id as "subId",
            group_id as "groupId",
            count(*) over (partition by group_id) as "numberOfMembers",
            user_id
        from group_users
        where group_id in(
                select a.group_id
                from group_users as a
                where user_id = $1
            )
            and status = '1'
    ) as a
    left join groups as b on a."groupId" = b.id
where a.user_id = $2
union
select null as "subId",
    b.*,
    groups.name,
    groups.description,
    groups.photo
from(
        select a.id as "groupId",
            count(*) as "numberOfMembers"
        from(
                select groups.id
                from groups
                    left join group_users on groups.id = group_users.group_id
                where groups.id in(
                        select *
                        from groupIds
                    )
            ) as a
        group by a.id
    ) as b
    inner join groups on b."groupId" = groups.id
limit 21 offset $3