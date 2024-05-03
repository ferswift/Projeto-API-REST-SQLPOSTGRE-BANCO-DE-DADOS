const { pool } = require("../../database/connection");
const bcrypt = require("bcrypt");

async function cadastroDeUsuario(req, res) {
  const { nome, email, senha } = req.body;

  try {
    const existeEmail = await pool.query(
      `SELECT * FROM usuarios WHERE email = $1`,
      [email]
    );
    if (existeEmail.rowCount > 0) {
      return res.status(409).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const queryInsert = `INSERT INTO usuarios (nome, email, senha) VALUES($1, $2, $3) RETURNING id, nome, email`;
    const valuesInsert = [nome, email, senhaCriptografada];

    const cadastrarUsuario = await pool.query(queryInsert, valuesInsert);

    return res.status(201).json(cadastrarUsuario.rows[0]);
  } catch (error) {
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao realizar o cadastro do usuário.",
      error: error.message,
    });
  }
}

module.exports = { cadastroDeUsuario };
