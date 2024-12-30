const pool = require('../db');


exports.login = async (req, res) => { 
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required.' });
    }

    try {
        const [rows] = await pool.query("SELECT * FROM companies WHERE email = ? AND password = ?", [email, password]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password.' });
        }

        req.session.companyId = rows[0].id;
        return res.status(200).json({ message: 'Login successful.', user: rows[0] });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.signUp = async (req, res) => { 
    const { name, email, password, description } = req.body;

    //I am doing basic data sanity checks, but otherwise I'd do it mostly frontend
    if (!name || !email || !password || !description) {
        return res.status(400).json({ error: 'name, email, password, and description are required.' });
    }

    try {
        const [result] = await pool.query("INSERT INTO companies (name, email, password, description) VALUES (?, ?, ?, ?)", [name, email, password, description]);
        
        if (result.affectedRows === 0 || !result.insertId || result.warningStatus !== 0) {
            return res.status(500).json({ error: 'Internal server error.' });
        }

        req.session.companyId = result.insertId;
        return res.status(200).json({ message: 'Account created successfully.', user: { id: result.insertId, name, email, description } });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
    