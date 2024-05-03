const express = require("express");
const router = express();
const userController = require("../controller/users/login");
const loginController = require("../controller/users/login");
const { cadastroDeUsuario } = require("../controller/users/POST_register");
const { validarDadosDoCadastroDoUsuario } = require("../middleware/validator");
const { validateToken } = require("../middleware/auth");
const { listCategories } = require("../controller/categories/GET_list");
const {
  listTransactions,
} = require("../controller/transactions/get_transaction");
const {
  detalharTransacao,
} = require("../controller/transactions/get_transaction_by_Id");
const {
  cadastrarTransacao,
} = require("../controller/transactions/post_transaction");
const {
  updateTransaction,
} = require("../controller/transactions/PUT_transaction");
const {
  deleteTransaction,
} = require("../controller/transactions/DELETE_transaction");
const {
  extractTransaction,
} = require("../controller/transactions/GET_extractTransaction");

router.post("/login", loginController.loginUser);
router.post("/usuario", validarDadosDoCadastroDoUsuario, cadastroDeUsuario);

router.use(validateToken);

router.post("/transacao", cadastrarTransacao);

router.get("/usario", userController.getUsers);
router.get("/usuario", userController.getUserById);
router.put("/usuario", userController.updateUser);

router.get("/categoria", listCategories);

router.get("/transacao", listTransactions);
router.get("/transacao/extrato", extractTransaction);
router.get("/transacao/:id", detalharTransacao);

router.put("/transacao/:id", updateTransaction);

router.delete("/transacao/:id", deleteTransaction);

module.exports = { router };
