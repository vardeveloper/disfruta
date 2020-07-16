DELIMITER //

drop procedure if exists insert_stock;

create procedure insert_stock(in id_gift INT, in amount INT)
begin

    DECLARE x INT;

    set x = 0;
    while x < amount do
        insert into stock (uuid, id_base_gift) values (UUID(), id_gift);
        set x = x + 1;
    end while;

end//

DELIMITER ;
