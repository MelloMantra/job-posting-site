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
    const { query } = req.query;
    const { itemType } = req.params

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
        const sql = `SELECT * FROM ${itemType} WHERE name LIKE CONCAT('%', ?, '%') LIMIT 30`
        const [rows] = await pool.query(sql, [query]); 
        
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

/*
Filtering options:
1. filter by industry or occupation
2. filter by location (this is hard, not necessary for MVP)
3. filter by remote or in-person
5. filter by pay
6. filter by job type (internship, full-time, part-time, seasonal)

Sorting options:
1. sort by date posted
2. sort by pay
*/

exports.searchJobs = async (req, res) => {
    const { query, industry, occupation, isRemote, minPay, jobType, sort } = req.query;

    if ( !query ) {
        return res.status(200).json({ result: []});
    }

    try {
        let sql = "SELECT  postedJob.*, companies.name AS companyName, occupation.name AS occupationName, industry.name AS industryName FROM postedJob LEFT JOIN companies ON postedJob.company = companies.id LEFT JOIN occupation ON postedJob.occupation = occupation.id LEFT JOIN industry ON postedJob.industry = industry.id WHERE title LIKE CONCAT('%', ?, '%') AND status = 'open'";
        const params = [query];

        if (industry) {
            sql += " AND industry = ?";
            params.push(industry);
        }

        if (occupation) {
            sql += " AND occupation = ?";
            params.push(occupation);
        }

        if (isRemote !== undefined) { //isRemote is a boolean
            sql += " AND isRemote = ?";
            params.push(isRemote);
        }

        if (minPay) {
            sql += " AND estimatedPay >= ?";
            params.push(minPay);
        }

        if (jobType) {
            sql += " AND scheduleType = ?";
            params.push(jobType);
        }

        if (sort) {
            sql += " ORDER BY " + sort + " DESC"; 
        }

        sql += " LIMIT 50";

        const [rows] = await pool.query(sql, params); 
        
        return res.status(200).json({ result: rows});

    } catch {err} {
        console.error('Error querying database:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
}
