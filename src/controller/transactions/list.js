const express = require('express');
const db = require('../../database/connection');

async function listarTransacoes(req, res) {
    try {
        const userId = req.user.id;

        const transactions = await db.query('SELECT * FROM transacoes WHERE usuario_id = $1', [userId]);

        if (transactions.rows.length === 0) {
            return res.status(200).json([]);
        }

        res.status(200).json(transactions.rows);
    } catch (err) {
        console.error('Erro ao buscar transações:', err);
        res.status(500).json({ mensagem: 'Erro ao buscar transações.' });
    }
}

module.exports = listarTransacoes;