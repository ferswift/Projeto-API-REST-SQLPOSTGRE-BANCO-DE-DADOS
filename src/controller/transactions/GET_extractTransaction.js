const { pool } = require("../../database/connection");

async function extractTransaction(req, res) {
  try {
    const userId = req.usuario.id;

    const queryEntry =
      "SELECT SUM(valor)::INTEGER AS entrada FROM transacoes WHERE tipo = 'entrada' AND usuario_id = $1";
    const resultEntry = await pool.query(queryEntry, [userId]);

    const queryOut =
      "SELECT SUM(valor)::INTEGER AS saida FROM transacoes WHERE tipo = 'saida' AND usuario_id = $1";
    const resultOut = await pool.query(queryOut, [userId]);

    const extract = {
      entrada: resultEntry.rows[0].entrada || 0,
      saida: resultOut.rows[0].saida || 0,
    };
    res.status(200).json(extract);
  } catch (err) {
    console.error("Erro ao buscar detalhes de extrato da transação:", err);
    return res
      .status(500)
      .json({ mensagem: "Erro ao buscar detalhes de extrato da transação." });
  }
}

module.exports = { extractTransaction };
