const { pool } = require("../../database/connection");

async function listCategories(req, res) {
  try {
    const categories = await pool.query("SELECT * FROM categorias");
    return res.status(200).json(categories.rows);
  } catch (err) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao realizar o cadastro do usuário.",
      error: err.message,
    });
  }
}

module.exports = { listCategories };
