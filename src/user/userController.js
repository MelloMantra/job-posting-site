const pool = require('../db');

exports.login = async (req, res) => { 
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required.' });
    }

    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        req.session.userId = rows[0].id;
        return res.status(200).json({ message: 'Login successful.', user: rows[0] });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}