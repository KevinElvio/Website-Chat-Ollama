const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Endpoint untuk mengirim pesan ke model Llama
app.post('/api/chat', async (req, res) => {
    const { model, messages } = req.body;

    // Pastikan model dan messages tidak kosong
    if (!model || !messages || messages.length === 0) {
        return res.status(400).json({ error: 'Model and messages are required' });
    }

    try {
        // Kirim permintaan ke Ollama
        const response = await axios.post('http://localhost:11434/api/chat', {
            model: model,
            messages: messages
        });

        // Kirim respons dari Ollama
        res.json(response.data);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});