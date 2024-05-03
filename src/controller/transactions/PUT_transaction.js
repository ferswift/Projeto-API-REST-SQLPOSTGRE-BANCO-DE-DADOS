const { pool } = require("../../database/connection");

async function updateTransaction(req, res) {
  const { descricao, valor, data, categoria_id, tipo } = req.body;
  const { id } = req.params;
  try {
    const userId = req.usuario.id;

    if (!descricao || !valor || !data || !categoria_id || !tipo) {
      return res.status(400).json({
        mensagem: "Todos os campos obrigatórios devem ser informados.",
      });
    }
    if (tipo !== "entrada" && tipo !== "saida") {
      return res.status(400).json({
        mensagem: "O tipo de transação deve ser 'entrada' ou 'saida'.",
      });
    }
    const validateTransaction = await pool.query(
      "SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2",
      [id, userId]
    );
    if (validateTransaction.rowCount === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }
    const categoriaQuery = "SELECT id FROM categorias WHERE id = $1";
    const categoriaResult = await pool.query(categoriaQuery, [categoria_id]);

    if (categoriaResult.rows.length === 0) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }

    const query = `
              UPDATE transacoes SET descricao = $1 , valor = $2 , data = $3, categoria_id = $4, tipo = $5 WHERE id = $6`;
    await pool.query(query, [descricao, valor, data, categoria_id, tipo, id]);
    return res.status(204).send();
  } catch (err) {
    console.error("Erro ao atualizar transação:", err);
    return res.status(500).json({ mensagem: "Erro ao atualizar transação" });
  }
}

module.exports = { updateTransaction };
