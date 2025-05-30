INSERT INTO roles (role_name)
VALUES
('admin'),
('member');

INSERT INTO users (role_id, first_name, last_name, email, phone_number, date_of_birth)
VALUES
(1, 'Yvonne', 'Ng', 'yvonneng@gardensbythebay.com.sg', '98023041', '1987-04-21'),
(2, 'Julia', 'Moe', 'juliamoe.ppm@gmail.com', '84381037', '2007-03-01');