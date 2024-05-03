const jwt = require("jsonwebtoken");

const { pool } = require("../database/connection");

async function validateToken(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ mensagem: "Usuário não autorizado." });
  }

  const token = authorization.split(" ")[1];

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await pool.query(
      "SELECT id, nome, email FROM usuarios WHERE id = $1",
      [id]
    );
    if (!rows.length) {
      return res.status(401).json({ mensagem: "Usuário não autorizado." });
    }
    req.usuario = rows[0];
    next();
  } catch (err) {
    console.error("Erro ao autenticar usuário:", err.message);
    return res.status(401).json({
      mensagem: "Usuário não autorizado.",
      error: err.message,
    });
  }
}

module.exports = { validateToken };
