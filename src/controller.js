/* to clarify the role of this file:
This is a controller (and routes.js is a route) for both users and companies, for stuff that is common to both.
company/ and user/ are the folders for the controllers and routers specific to companies and users.
*/
const express = require('express');
const pool = require('./db');
const occupationCache = new Map();
const industryCache = new Map();

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
//../api/all/searchCategory/industry?name=blahblahblah
exports.searchCategory = async (req, res) => {
    const { query } = req.query.query;
    const { itemType } = req.params.itemType

    if ( !query ) {
        return res.status(200).json({ result: []});
    }
    if ( !itemType ) {
        return res.status(400).json({ error: 'Item type is required.' });
    } else if (itemType !== 'industry' && itemType !== 'occupation') {
        return res.status(400).json({ error: 'Invalid item type.' });
    } 

    if (itemType == 'occupation' && occupationCache.has(query)) {
        return res.status(200).json({ result: occupationCache.get(query) })
    } else if (itemType == 'industry' && industryCache.has(query)) {
        return res.status(200).json({ result: industryCache.get(query) })
    }

    try {
        const sql = "SELECT * FROM ? WHERE MATCH(name) AGAINST(? WITH QUERY EXPANSION) LIMIT 30"
        const [rows] = await pool.query(sql, [query, itemType]); 
        
        if (itemType == 'industry') {
            industryCache.set(query, rows);
        } else if (itemType == 'occupation') {
            occupationCache.set(query, rows);
        }

        return itemType == 'industry' ? res.status(200).json({ result: rows}) : res.status(200).json({ result: rows});
    } catch {err} {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}

exports.occupationCache = occupationCache;
exports.industryCache = industryCache;
