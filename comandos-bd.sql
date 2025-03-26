create database atvAula3;
use atvAula3;

CREATE TABLE produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    fornecedor VARCHAR(255) NOT NULL,
    endereco_fornecedor VARCHAR(255),
    quantidade INT NOT NULL,
    endereco VARCHAR(255),
    preco_unitario FLOAT NOT NULL
);

INSERT INTO produtos (nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario)
VALUES
    ('Camiseta Exemplo Futura', 'Future Wear', 'Rua dos Designers, 30', 150, 'Rua das Margaridas, 121', 49.90),
    ('Tênis UltraBounce 5000', 'SportMax', 'Avenida da Performance, 400', 85, 'Rua dos Atletos, 88', 299.99),
    ('Relógio Digital Spartan', 'TechGears', 'Rua da Tecnologia, 150', 50, 'Rua dos Pássaros, 65', 450.00),
    ('Notebook Gamer ZxX 2025', 'Zenix Tech', 'Rua das Inovações, 700', 25, 'Avenida das Torres, 105', 7999.00);

select * from produtos;
