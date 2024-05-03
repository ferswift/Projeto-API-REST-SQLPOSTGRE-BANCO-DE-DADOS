const { pool } = require("../../database/connection");

async function cadastrarTransacao(req, res) {
  try {
    const { descricao, valor, data, categoria_id, tipo } = req.body;
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

    const categoriaQuery = "SELECT id FROM categorias WHERE id = $1";
    const categoriaResult = await pool.query(categoriaQuery, [categoria_id]);

    if (categoriaResult.rows.length === 0) {
      return res.status(404).json({ mensagem: "Categoria não encontrada." });
    }

    const query = `
            INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
    const result = await pool.query(query, [
      descricao,
      valor,
      data,
      categoria_id,
      userId,
      tipo,
    ]);
    const transacaoCadastrada = result.rows[0];

    return res.status(201).json(transacaoCadastrada);
  } catch (err) {
    console.error("Erro ao cadastrar transação:", err);
    return res.status(500).json({ mensagem: "Erro ao cadastrar transação." });
  }
}

module.exports = { cadastrarTransacao };
