const pool = require('../db');
const multer = require('multer');
const path = require('path');

exports.upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed.'));
        }
    },
});

/* //Somehow there were two uploadResumes, so I'm comementing out this one cuz I'm pretty sure the other is the one being used
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
*/

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

//when resumes are switched to user, change this
exports.applyToJob = async (req, res) => {
    const { jobId } = req.params;
    const userId = 1; //for testing purposes
    //const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required.' });
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    try {

        /*
        const sql1 = "GET resume FROM user WHERE id = ?";
        const [resume] = await pool.query(sql1, [userId]);

        if (resume.length === 0) {
            return res.status(404).json({ error: 'Resume not found.' });
        }
        */ //uncomment above if resumes are switched to user

        const sql2 = "SELECT * FROM openApplications WHERE user = ? AND job = ?";
        const [existingApps] = await pool.query(sql2, [userId, jobId]);
        

        if (!(existingApps.length === 0)) {
            return res.status(409).json({ error: 'Item already exists.' });
        }

        const sql3 = "INSERT INTO openApplications (user, job, state, resume, created_at) VALUES (?, ?, ?, ?, ?)";
        const [rows] = await pool.query(sql3, [userId, parseInt(jobId), 'pending', null, formattedDate]);

        if (rows.affectedRows === 0 || !rows.insertId) {
            return res.status(500).json({ error: 'Internal server error.' });
        }

        return res.status(200).json({ message: 'Application submitted successfully.', applicationId: rows.insertId});
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
    const userId = 1; //for testing purposes
    //const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    try {
        const sql = `
            SELECT 
                a.*, 
                p.title, 
                p.address, 
                p.estimatedPay, 
                c.name AS companyName
            FROM 
                openApplications a
            JOIN 
                postedJob p ON a.job = p.id
            JOIN 
                companies c ON p.company = c.id
            WHERE 
                a.user = ?
        `;
        const [rows] = await pool.query(sql, [userId]);

        //user can have no applications

        return res.status(200).json({ applications: rows });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.uploadResume = async (req, res) => {
    const jobId = req.params.jobId;
    const applicationId = req.params.applicationId;
    const userId = 1; //for testing purposes
    //const userId = req.session.userId;

    if (!jobId || !applicationId) {
        return res.status(400).json({ error: 'Job ID and Application ID are required.' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or invalid file type.' });
    }

    try {
        // Update resume in the openApplications table
        const sql = `
            UPDATE openApplications 
            SET resume = ? 
            WHERE id = ? AND job = ? AND user = ?
        `;
        await pool.query(sql, [req.file.buffer, applicationId, jobId, userId]);

        return res.status(200).json({ message: 'Resume uploaded successfully.' });
    } catch (err) {
        console.error('Error uploading resume:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};

exports.get4Jobs = async (req, res) => {
    const userId = 1; //for testing purposes
    //const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    try {
        const sql = `
            SELECT 
                p.*, 
                c.name AS companyName
            FROM 
                postedJob p
            LEFT JOIN 
                openApplications a ON p.id = a.job AND a.user = ?
            LEFT JOIN 
                companies c ON p.company = c.id
            WHERE 
                a.job IS NULL
            LIMIT 4;
        `;
        const [rows] = await pool.query(sql, [userId]);

        return res.status(200).json({ jobs: rows });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.get4Jobs = async (req, res) => {
    const userId = 1; //for testing purposes
    //const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    try {
        const sql = `
            SELECT 
                p.*, 
                c.name AS companyName
            FROM 
                postedJob p
            LEFT JOIN 
                openApplications a ON p.id = a.job AND a.user = ?
            LEFT JOIN 
                companies c ON p.company = c.id
            WHERE 
                a.job IS NULL
            LIMIT 4;
        `;
        const [rows] = await pool.query(sql, [userId]);

        return res.status(200).json({ jobs: rows });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.get4Applications = async (req, res) => {
    const userId = 1; //for testing purposes
    //const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    try {
        const sql = `
            SELECT 
            a.*, 
            p.title AS jobTitle, 
            p.address AS jobAddress, 
            c.name AS companyName
        FROM 
            openApplications a
        JOIN 
            postedJob p ON a.job = p.id
        JOIN 
            companies c ON p.company = c.id
        WHERE 
            a.user = ?
        ORDER BY 
            a.created_at DESC
        LIMIT 4;
        `;
        const [rows] = await pool.query(sql, [userId]);

        return res.status(200).json({ jobs: rows });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}