insert into base_gifts (id, gift_type, store_name, store_img, name, slug, img, img_large, img_big, description, used_stock, total_stock, status, created_at, id_category, id_provider) values
(1, 'event', 'Los Productores', 'https://storage.funciton.com/profuturo/disfrutaprofuturo/demo/event/los-productores.png', 'Entradas triples a:<br />Las chicas de 4to C', 'las-chicas-de-4to-c', 'https://storage.funciton.com/profuturo/disfrutaprofuturo/demo/event/img.png', '', 'https://storage.funciton.com/profuturo/disfrutaprofuturo/demo/event/detalle.jpg', 'Profuturo te invita a revivir el fin de los a&ntilde;os 90<br />en esta obra llena de alegr&iacute;a, recuerdos y<br />amistad.', 0, 100, 'enabled', now(), 7, 9);

insert into events (id, taken_place_on, start_on, synopsis, cast, place, invitation_detail, has_combo, combo_detail, has_seats, seats_detail, last_exchange_date, disclaimer, lng, lat) value
(1, '2020-08-17 19:30:00', '2020-08-17 20:30:00', 'Cinco amigas recuerdan los mejores a&ntilde;os de su vida: la &eacute;poca del colegio. En medio de historias llenas de risas, llantos, travesuras y secretos, ellas revivir&aacute;n con cierta nostalgia el final de los a&ntilde;os noventa', 'Mar&iacute;a Grazia Gamarra, Lu Arispe, Yidda Eslava, Leslie Guill&eacute;n, Patricia Barreto.', 'Teatro Pirandello<br />Av. Petit Thouars cuadra 10<br />(Ex colegio Raimondi)', 'Triple', 0, null, 1, 'Asignados seg&uacute;n orden de llegada', '2020-08-14', 'Capacidad limitada.', -77.0240312, -12.1020453);
