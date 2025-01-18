/* to clarify the role of this file:
This is a controller (and routes.js is a route) for both users and companies, for stuff that is common to both.
company/ and user/ are the folders for the controllers and routers specific to companies and users.
*/
const express = require('express');
const pool = require('./db');
const occupationCache = new Map();

exports.logout = async (req, res) => { 
    req.session.destroy((err) => { 
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Internal server error.' }); 
        }
        return res.status(200).json({ message: 'Logout successful.' }); 
    }); 
};

exports.getJob = async (req, res) => {
    const jobId = req.params.jobId;

    try {
        const sql = "SELECT pj.*, ind.name AS industry_name, occ.name AS occupation_name FROM postedJob pj JOIN industry ind ON pj.industry = ind.id JOIN occupation occ ON pj.occupation = occ.id WHERE pj.id = ?;";
        const [rows] = await pool.query(sql, [jobId]);

        if (rows.length > 0) {
            return res.status(200).json({ jobs: rows[0] });
        } else {
            return res.status(404).json({ error: 'Job not found.' });
        }
    } catch (err) {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

//a query would look something like:
//../api/all/searchOccupations?occName=blahblahblah
exports.searchOccupations = async (req, res) => {
    const { occName } = req.query.occName;

    if ( !occName ) {
        return res.status(200).json({ occupations: []});
    }

    if (occupationCache.has(occName)) {
        return res.status(200).json({ occupations: occupationCache.get(q) })
    }

    try {
        const sql = "SELECT * FROM occupations WHERE MATCH(name) AGAINST(? WITH QUERY EXPANSION) LIMIT 30"
        const [rows] = await pool.query(sql, [occName]); 
        
        occupationCache.set(occName, rows);

        return res.status(200).json({ occupations: rows});
    } catch {err} {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.occupationCache = occupationCache;
