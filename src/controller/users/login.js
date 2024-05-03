const { pool } = require("../../database/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    return res.json(result.rows);
  } catch (err) {
    console.error("Erro ao obter usuários:", err.message);
    return res.status(500).json({ mensagem: "Erro ao obter usuário." });
  }
};

const createUser = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    // Validar entrada
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Todos os campos são obrigatórios" });
    }

    const hashedSenha = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, hashedSenha]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Erro ao criar usuário:", err.message);

    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao realizar o cadastro do usuário.",
      error: err.message,
    });
  }
};

const getUserById = async (req, res) => {
  return res.status(200).json(req.usuario);
};

const updateUser = async (req, res) => {
  const { id } = req.usuario;
  const { nome, email, senha } = req.body;
  try {
    if (!nome || !email || !senha) {
      return res
        .status(400)
        .json({ mensagem: "Todos os campos são obrigatórios" });
    }
    const { rowCount } = await pool.query(
      "SELECT id, nome, email FROM usuarios WHERE email = $1 AND id != $2",
      [email, id]
    );
    if (rowCount > 0) {
      return res.status(409).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }
    const hashedSenha = await bcrypt.hash(senha, 10);
    const result = await pool.query(
      "UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *",
      [nome, email, hashedSenha, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    const { senha: _, ...user } = result.rows[0];
    return res.json(user);
  } catch (err) {
    console.error("Erro ao atualizar usuário:", err.message);
    return res.status(500).json({
      mensagem:
        "Algo inesperado aconteceu ao realizar a atualização do cadastro do usuário.",
      error: err.message,
    });
  }
};

const loginUser = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const userQuery = "SELECT * FROM usuarios WHERE email = $1";
    const userResult = await pool.query(userQuery, [email]);
    if (userResult.rows.length === 0) {
      return res.status(40).json({ mensagem: "E-mail ou senha inválidos" });
    }

    const usuario = userResult.rows[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: "E-mail ou senha inválidos" });
    }
    const { senha: _, ...user } = usuario;
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ message: "Login bem-sucedido", token, user });
  } catch (err) {
    console.error("Erro ao fazer login:", err.message);
    return res.status(500).json({
      mensagem: "Algo inesperado aconteceu ao realizar o login do usuário.",
      error: err.message,
    });
  }
};

module.exports = {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  loginUser,
};
