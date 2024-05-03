const { pool } = require("../../database/connection");

async function deleteTransaction(req, res) {
  const { id } = req.params;
  try {
    const userId = req.usuario.id;

    const validateTransaction = await pool.query(
      "SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2",
      [id, userId]
    );
    if (validateTransaction.rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    const query = `DELETE FROM transacoes WHERE id = $1`;
    await pool.query(query, [id]);
    return res.status(204).send();
  } catch (err) {
    console.error("Erro ao atualizar transação:", err);
    return res.status(500).json({ mensagem: "Erro ao atualizar transação" });
  }
}

module.exports = { deleteTransaction };
