const express = require('express');
const app = express();
const connection = require('./db');

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
};

const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Produto não encontrado',
  INTERNAL_SERVER_ERROR: 'Erro interno no servidor',
  METHOD_NOT_IMPLEMENTED: 'Método não implementado',
  MISSING_DATA: 'Dados incompletos',
  DATABASE_ERROR: 'Erro na consulta ao banco de dados',
};

app.use(express.json());

app.get('/produtos', (req, res) => {
  connection.query('SELECT * FROM produtos', (err, results) => {
    if (err) {
      console.error('Erro ao consultar produtos:', err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.DATABASE_ERROR });
    }
    if (results.length === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
    }
    res.status(HTTP_STATUS.OK).json(results);
  });
});

app.post('/produtos', (req, res) => {
  const { nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario } = req.body;

  if (!nome || !fornecedor || !quantidade || !preco_unitario) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.MISSING_DATA });
  }

  const query = `INSERT INTO produtos (nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario)
                   VALUES (?, ?, ?, ?, ?, ?)`;
  connection.query(query, [nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario], (err, results) => {
    if (err) {
      console.error('Erro ao adicionar produto:', err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.DATABASE_ERROR });
    }
    res.status(HTTP_STATUS.CREATED).json({ message: 'Produto adicionado com sucesso', id: results.insertId });
  });
});

app.put('/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario } = req.body;

  if (!nome || !fornecedor || !quantidade || !preco_unitario) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: ERROR_MESSAGES.MISSING_DATA });
  }

  const query = `UPDATE produtos
                   SET nome = ?, fornecedor = ?, endereco_fornecedor = ?, quantidade = ?, endereco = ?, preco_unitario = ?
                   WHERE id = ?`;
  connection.query(query, [nome, fornecedor, endereco_fornecedor, quantidade, endereco, preco_unitario, id], (err, results) => {
    if (err) {
      console.error('Erro ao atualizar produto:', err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.DATABASE_ERROR });
    }
    if (results.affectedRows === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Produto atualizado com sucesso' });
  });
});

app.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM produtos WHERE id = ?`;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao remover produto:', err);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.DATABASE_ERROR });
    }
    if (results.affectedRows === 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Produto removido com sucesso' });
  });
});

app.all('*', (req, res) => {
  res.status(HTTP_STATUS.NOT_IMPLEMENTED).json({ message: ERROR_MESSAGES.METHOD_NOT_IMPLEMENTED });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
