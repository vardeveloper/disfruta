-- big box
insert into internal_users (user_type, name, email, created_at) values ('provider', 'Big Box', 'alessia.miranda@bigbox.com.pe', now());
insert into providers (id, store, delivery_type) values (1, 'bigbox', 'digital');

-- la canasteria
insert into internal_users (user_type, name, email, created_at) values ('provider', 'La Canasteria', 'alexandra@lacanasteria.com', now());
insert into providers (id, store, delivery_type) values (2, 'la-canasteria', 'delivery');
insert into districts (name, store, status) values ('Barranco', 'la-canasteria', 'enabled'), 
('Chorrillos', 'la-canasteria', 'enabled'), 
('Surquillo', 'la-canasteria', 'enabled'), 
('Miraflores', 'la-canasteria', 'enabled'), 
('San Isidro', 'la-canasteria', 'enabled'), 
('Lince', 'la-canasteria', 'enabled'), 
('Magdalena del Mar', 'la-canasteria', 'enabled'), 
('Santiago de Surco', 'la-canasteria', 'enabled'), 
('Jesus Maria', 'la-canasteria', 'enabled'), 
('La Victoria', 'la-canasteria', 'enabled'), 
('Pueblo Libre', 'la-canasteria', 'enabled'), 
('San Borja', 'la-canasteria', 'enabled'), 
('San Miguel', 'la-canasteria', 'enabled'), 
('Villa El Salvador', 'la-canasteria', 'enabled'), 
('San Luis', 'la-canasteria', 'enabled'), 
('Bre&ntilde;a', 'la-canasteria', 'enabled'), 
('Cercado de Lima', 'la-canasteria', 'enabled'), 
('La Molina', 'la-canasteria', 'enabled'), 
('Rimac', 'la-canasteria', 'enabled'), 
('Ate', 'la-canasteria', 'enabled'), 
('Callao-Aeropuerto-La Punta', 'la-canasteria', 'enabled'), 
('El Agustino', 'la-canasteria', 'enabled'), 
('Los Olivos', 'la-canasteria', 'enabled'), 
('San Juan de Miraflores', 'la-canasteria', 'enabled'), 
('San Martin de Porres', 'la-canasteria', 'enabled'), 
('Santa Anita', 'la-canasteria', 'enabled'), 
('Villa Maria del Triunfo', 'la-canasteria', 'enabled'), 
('Comas', 'la-canasteria', 'enabled'), 
('Independencia', 'la-canasteria', 'enabled');

-- spa westin
insert into internal_users (user_type, name, email, created_at) values ('provider', 'Spa Westin', 'spawestin@libertador.com.pe', now());
insert into providers (id, store, delivery_type) values (3, 'spa-westin', 'digital');

-- caudalia
insert into internal_users (user_type, name, email, created_at) values ('provider', 'Caudalia', 'info@caudaliabox.com.pe', now());
insert into providers (id, store, delivery_type) values (4, 'caudalia', 'delivery');
insert into districts (name, store, status) values ('Barranco', 'caudalia', 'enabled'), 
('Chorrillos', 'caudalia', 'enabled'), 
('Surquillo', 'caudalia', 'enabled'), 
('Miraflores', 'caudalia', 'enabled'), 
('San Isidro', 'caudalia', 'enabled'), 
('Lince', 'caudalia', 'enabled'), 
('Magdalena del Mar', 'caudalia', 'enabled'), 
('Santiago de Surco', 'caudalia', 'enabled'), 
('Jesus Maria', 'caudalia', 'enabled'), 
('La Victoria', 'caudalia', 'enabled'), 
('Pueblo Libre', 'caudalia', 'enabled'), 
('San Borja', 'caudalia', 'enabled'), 
('San Miguel', 'caudalia', 'enabled'), 
('Villa El Salvador', 'caudalia', 'enabled'), 
('San Luis', 'caudalia', 'enabled'), 
('Bre&ntilde;a', 'caudalia', 'enabled'), 
('Cercado de Lima', 'caudalia', 'enabled'), 
('La Molina', 'caudalia', 'enabled'), 
('Rimac', 'caudalia', 'enabled'), 
('Ate', 'caudalia', 'enabled'), 
('Callao-Aeropuerto-La Punta', 'caudalia', 'enabled'), 
('El Agustino', 'caudalia', 'enabled'), 
('Los Olivos', 'caudalia', 'enabled'), 
('San Juan de Miraflores', 'caudalia', 'enabled'), 
('San Martin de Porres', 'caudalia', 'enabled'), 
('Santa Anita', 'caudalia', 'enabled'), 
('Villa Maria del Triunfo', 'caudalia', 'enabled'), 
('Comas', 'caudalia', 'enabled'), 
('Independencia', 'caudalia', 'enabled');

-- ilaria
insert into internal_users (user_type, name, email, created_at) values ('provider', 'Ilaria', 'tiendaprincipal@ilariainternational.com', now());
insert into providers (id, store, delivery_type) values (5, 'ilaria', 'delivery');
insert into districts (name, store, status) values ('Barranco', 'ilaria', 'enabled'), 
('Cercado de Lima', 'ilaria', 'enabled'), 
('Chorrillos', 'ilaria', 'enabled'), 
('La Molina', 'ilaria', 'enabled'), 
('Lince', 'ilaria', 'enabled'), 
('Magdalena Del Mar', 'ilaria', 'enabled'), 
('Miraflores', 'ilaria', 'enabled'), 
('Pueblo Libre', 'ilaria', 'enabled'), 
('San Borja', 'ilaria', 'enabled'), 
('San Isidro', 'ilaria', 'enabled'), 
('San Luis', 'ilaria', 'enabled'), 
('San Miguel', 'ilaria', 'enabled'), 
('Santiago de Surco', 'ilaria', 'enabled'), 
('Surquillo', 'ilaria', 'enabled'), 
('Jesus Maria', 'ilaria', 'enabled'), 
('Bre&ntilde;a', 'ilaria', 'enabled'), 
('Rimac', 'ilaria', 'enabled');

-- bebox
insert into internal_users (user_type, name, email, created_at) values ('provider', 'BEBOX', 'pedidos@bebox.pe', now());
insert into providers (id, store, delivery_type) values (6, 'bebox', 'delivery');

-- cineplanet
insert into internal_users (user_type, name, email, created_at) values ('provider', 'Cineplanet', 'ajgarcia+cineplanet@profuturo.com.pe', now());
insert into providers (id, store, delivery_type) values (7, 'cineplanet', 'digital');

-- la crocante
insert into internal_users (user_type, name, email, created_at) values ('provider', 'La Crocante', 'pedidos@lacrocante.com', now());
insert into providers (id, store, delivery_type) values (8, 'la-crocante', 'delivery_full');
insert into districts (name, store, status) values ('Miraflores', 'la-crocante', 'enabled'),
('San Isidro', 'la-crocante', 'enabled'),
('Surquillo', 'la-crocante', 'enabled'),
('Lince', 'la-crocante', 'enabled'),
('Barranco', 'la-crocante', 'enabled'),
('San Luis', 'la-crocante', 'enabled'),
('La Victoria', 'la-crocante', 'enabled'),
('San Borja', 'la-crocante', 'enabled'),
('Surco', 'la-crocante', 'enabled'),
('Chacarilla', 'la-crocante', 'enabled'),
('Magdalena', 'la-crocante', 'enabled'),
('Jesus Maria', 'la-crocante', 'enabled'),
('La Molina (antes de la tranquera)', 'la-crocante', 'enabled'),
('Bre&ntilde;a', 'la-crocante', 'enabled'),
('El Agustino', 'la-crocante', 'enabled'),
('Chorrillos', 'la-crocante', 'enabled'),
('Pueblo Libre', 'la-crocante', 'enabled'),
('San Miguel', 'la-crocante', 'enabled'),
('Rimac', 'la-crocante', 'enabled'),
('Cercado', 'la-crocante', 'enabled'),
('Ate (S&oacute;lo Zona Industrial)', 'la-crocante', 'enabled');


-- los productores
insert into internal_users (user_type, name, email, created_at) values ('provider', 'Los Productores', 'none@losproductores.com', now());
insert into providers (id, store, delivery_type) values (9, 'los-productores', 'digital');
