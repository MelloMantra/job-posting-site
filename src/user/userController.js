const pool = require('../db');
const multer = require('multer');
const path = require('path');

exports.upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

exports.uploadResume = async (req, res) => {
    try {
        const file = req.file;

        if (!file || file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Please upload a valid PDF file.' });
        }

        const userId = req.session?.userId;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated.' });
        }

        const sql = 'UPDATE user SET resume = ? WHERE id = ?';
        const [result] = await pool.query(sql, [file.buffer, userId]);

        if (result.affectedRows === 0) {
            return res.status(500).json({ error: 'User not found or no changes made' });
        }

        return res.status(200).json({ message: 'Resume uploaded successfully.' });
    } catch (err) {
        console.error('Error uploading resume:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.downloadResume = async (req, res) => {
    const { userId } = req.session.userId;
    
    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    try {
        const sql = 'SELECT resume FROM user WHERE id = ?';
        const [rows] = await pool.query(sql, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Resume not found.' });
        }

        const resume = rows[0].userResume;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');
        res.setHeader('Content-Length', resume.length);

        res.write(resume);
        res.end();
    } catch (err) {
        console.error('Error downloading resume:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}


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

exports.signUp = async (req, res) => { 
    const { firstName, lastName, email, password, aboutMe, majorType, majorLevel, universityId, educationLevel, pastExperienceTitle, pastExperienceCompany} = req.body;
    
    if (!firstName || !lastName || !email || !password || !aboutMe || !majorType || !majorLevel || !universityId || !educationLevel || !pastExperienceTitle || !pastExperienceCompany) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    try {
        const sql = "INSERT INTO users (firstName, password, lastName, email, aboutMe, createdAt, majorType, majorLevel, universityId, educationLevel, pastExperienceTitle, pastExperienceCompany VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const  [rows] = await pool.query(sql, [firstName, password, lastName, email, aboutMe, formattedDate, majorType, majorLevel, universityId, educationLevel, pastExperienceTitle, pastExperienceCompany]);
    
        if (rows.affectedRows === 0 || !rows.insertId) {
            return res.status(500).json({ error: 'Internal server error.' });
        }

        req.session.userId = rows.insertId;
        
        return res.status(200).json({ message: 'Account created successfully.' });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.applyToJob = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.session.userId;
    const { coverLetter, otherOptions } = req.body;

    //both coverLetter and otherOptions are not required

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required.' });
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    try {
        const sql1 = "GET resume FROM user WHERE id = ?";
        const [resume] = await pool.query(sql1, [userId]);

        if (resume.length === 0) {
            return res.status(404).json({ error: 'Resume not found.' });
        }

        const sql2 = "INSERT INTO openApplications (user, job, coverLetter, otherOptions, state, resume, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const [rows] = await pool.query(sql2, [userId, jobId, coverLetter, otherOptions, 'pending', resume[0].resume, formattedDate]);

        if (rows.affectedRows === 0 || !rows.insertId) {
            return res.status(500).json({ error: 'Internal server error.' });
        }

        return res.status(200).json({ message: 'Application submitted successfully.' });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.deleteApplication = async (req, res) => {
    const { applicationId } = req.params;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!applicationId) {
        return res.status(400).json({ error: 'Application ID is required.' });
    }

    try {
        const sql = "DELETE FROM openApplications WHERE id = ? AND user = ?";
        const [rows] = await pool.query(sql, [applicationId, userId]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        return res.status(200).json({ message: 'Application deleted successfully.' });
    } catch (err) {
        console.error('Error querying database:', err); 
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.getApplications = async (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    try {
        const sql = "SELECT * FROM openApplications WHERE user = ?";
        const [rows] = await pool.query(sql, [userId]);

        //user can have no applications

        return res.status(200).json(rows);
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}