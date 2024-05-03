const { pool } = require("../../database/connection");

async function detalharTransacao(req, res) {
  try {
    const userId = req.usuario.id;
    const transacaoId = req.params.id;

    const query = "SELECT * FROM transacoes WHERE id = $1 AND usuario_id = $2";
    const result = await pool.query(query, [transacaoId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: "Transação não encontrada." });
    }

    const transacao = result.rows[0];

    const categoriaQuery = "SELECT descricao FROM categorias WHERE id = $1";
    const categoriaResult = await pool.query(categoriaQuery, [
      transacao.categoria_id,
    ]);
    const categoriaNome = categoriaResult.rows[0].descricao;

    const transacaoDetalhada = {
      id: transacao.id,
      tipo: transacao.tipo,
      descricao: transacao.descricao,
      valor: transacao.valor,
      data: transacao.data,
      usuario_id: transacao.usuario_id,
      categoria_id: transacao.categoria_id,
      categoria_nome: categoriaNome,
    };

    res.status(200).json(transacaoDetalhada);
  } catch (err) {
    console.error("Erro ao buscar detalhes da transação:", err);
    return res
      .status(500)
      .json({ mensagem: "Erro ao buscar detalhes da transação." });
  }
}

module.exports = { detalharTransacao };
