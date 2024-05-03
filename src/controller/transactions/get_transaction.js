const { pool } = require("../../database/connection");

async function listTransactions(req, res) {
  try {
    const transactions = await pool.query(
      "SELECT transacoes.*, categorias.descricao AS categoria_nome FROM transacoes JOIN categorias ON categorias.id = transacoes.categoria_id WHERE usuario_id = $1",
      [req.usuario.id]
    );
    return res.status(200).json(transactions.rows);
  } catch (error) {
    return res.status(500).json({
      mensagem:
        "Algo inesperado aconteceu ao realizar a listagem da transação do usuário.",
      error: err.message,
    });
  }
}

module.exports = { listTransactions };
