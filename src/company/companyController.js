const pool = require('../db');
const cron = require('node-cron');


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
        
        if (result.affectedRows === 0 || !result.insertId) {
            return res.status(500).json({ error: 'Internal server error.' });
        }

        req.session.companyId = result.insertId;
        return res.status(200).json({ message: 'Account created successfully.', user: { id: result.insertId, name, email, description } });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.postJob = async (req, res) => { 
    const { title, address, description, hours, estimatedPay, requiredExperience, preferredExperience, occupation, industry, isRemote } = req.body;
    
    //address is optional
    if (!title || !description || !hours || !estimatedPay || !requiredExperience || !preferredExperience || !occupation || !industry || !isRemote) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const companyId = req.session?.companyId;
    
    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);

    try {
        const sql = "INSERT INTO postedJob (company, title, address, description, hours, estimatedPay, requiredExperience, preferredExperience, occupation, industry, date_created, isRemote, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')";
        const  [rows] = await pool.query(sql, [companyId, title, address, description, hours, estimatedPay, requiredExperience, preferredExperience, occupation, industry, formattedDate, isRemote]);
    
        if (rows.affectedRows === 0 || !rows.insertId) {
            return res.status(500).json({ error: 'Internal server error.' });
        };

        return res.status(200).json({ message: 'Job posted successfully.' });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.getJobs = async (req, res) => {
    const companyId = req.session?.companyId;

    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    try {
        const sql = "SELECT * FROM postedJob WHERE company = ?";
        const [rows] = await pool.query(sql, [companyId]);

        //rows can be empty if no jobs have been posted

        return res.status(200).json({ jobs: rows });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.deleteJob = async (req, res) => {
    const jobId = req.params.jobId;
    const companyId = req.session?.companyId;

    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required.' });
    }

    try {
        //first, delete the job

        const sql = "DELETE FROM postedJob WHERE id = ? AND company = ?";
        const [rows] = await pool.query(sql, [jobId, companyId]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: 'Job not found.' });
        }

        //next, update all applications to "rejected"

        const sql2 = "UPDATE openApplications SET state = 'archived' WHERE job = ? AND state = 'pending'";
        const [rows2] = await pool.query(sql2, [jobId]);

        //rows2 can be empty, as there may be no applications

        return res.status(200).json({ message: 'Job deleted successfully.' });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.updateJobStatus = async (req, res) => {
    const jobId = req.params.jobId;
    const companyId = req.session?.companyId;
    const status = req.body.status;

    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required.' });
    }

    if (!status) {
        return res.status(400).json({ error: 'Status is required.' });
    }

    if (status !== 'decided' && status !== 'closed') {
        return res.status(400).json({ error: 'Status must be "decided" or "closed".' });
    }

    try {
        //first, update the job
        const sql = "UPDATE postedJob SET status = ? WHERE id = ? AND company = ?";
        const [rows] = await pool.query(sql, [status, jobId, companyId]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: 'Job not found.' });
        }

        //next, update all applications to the new status. If the status is "decided", update all pending applications to "rejected", otherwise update no applications

        if (status === 'decided') {
            const sql2 = "UPDATE openApplications SET state = 'rejected' WHERE job = ? AND state = 'pending'";
            const [rows2] = await pool.query(sql2, [jobId]);

            //schedule a node-cron event to delete the job, and all it's applications in 2 weeks
            const deleteDate = new Date();
            deleteDate.setDate(deleteDate.getDate() + 14);

            const cron = "0 0 ${deleteDate.getDate()} ${deleteDate.getMonth()} *";

            cron.schedule(cron, async () => {
                try {
                    const sql3 = "DELETE FROM postedJob WHERE id = ? AND company = ?";
                    const [rows3] = await pool.query(sql3, [jobId, companyId]);

                    if (rows3.affectedRows === 0) {
                        return res.status(404).json({ error: 'Job not found.' });
                    }

                    const sql4 = "DELETE FROM openApplications WHERE job = ?";
                    const [rows4] = await pool.query(sql4, [jobId]);

                    if (rows4.affectedRows === 0) {
                        return res.status(404).json({ error: 'Job not found.' });
                    }
                } catch (err) {
                    console.error('Error querying database:', err);
                }
            });
        }

        return res.status(200).json({ message: 'Job status updated successfully.' });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.getApplications = async (req, res) => {
    const jobId = req.params.jobId;
    const companyId = req.session?.companyId;

    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required.' });
    }

    try {
        const sql = "SELECT * FROM openApplications WHERE job = ? AND company = ?";
        const [rows] = await pool.query(sql, [jobId, companyId]);

        //rows can be empty if no applications have been made

        return res.status(200).json({ applications: rows });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.makeDecision = async (req, res) => {
    const applicationId = req.params.applicationId;
    const companyId = req.session?.companyId;
    const decision = req.body.decision;

    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!applicationId) {
        return res.status(400).json({ error: 'Application ID is required.' });
    }

    if (!decision) {
        return res.status(400).json({ error: 'Decision is required.' });
    }

    if (decision !== 'accepted' && decision !== 'rejected' && decision !== 'pending') {
        return res.status(400).json({ error: 'Decision must be "pending", "accepted" or "rejected".' });
    }

    try {
        const sql = "UPDATE openApplications SET state = ? WHERE id = ? AND company = ?";
        const [rows] = await pool.query(sql, [decision, applicationId, companyId]);

        if (rows.affectedRows === 0) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        return res.status(200).json({ message: 'Application decision updated successfully.' });
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.downloadResume = async (req, res) => {
    const applicationId = req.params.applicationId;
    const companyId = req.session?.companyId;
    const jobId = req.params.jobId;

    if (!companyId) {
        return res.status(401).json({ error: 'User not authenticated.' });
    }

    if (!applicationId) {
        return res.status(400).json({ error: 'Application ID is required.' });
    }

    if (!jobId) {
        return res.status(400).json({ error: 'Job ID is required.' });
    }

    try {
        //assure that the application is for the correct job, and that the company is the one who made the job
        sql = "SELECT a.resume FROM openApplications a JOIN postedJob p ON a.job = p.id WHERE a.id = ? AND a.job = ? AND p.company = ?";
        const [rows] = await pool.query(sql, [applicationId, jobId, companyId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Application not found.' });
        }

        const resume = rows[0].resume;

        if (!resume) {
            return res.status(404).json({ error: 'Resume not found.' });
        }

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