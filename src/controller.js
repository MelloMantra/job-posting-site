/* to clarify the role of this file:
This is a controller (and routes.js is a route) for both users and companies, for stuff that is common to both.
company/ and user/ are the folders for the controllers and routers specific to companies and users.
*/
const express = require('express');
const pool = require('./db');

exports.logout = async (req, res) => { 
    req.session.destroy((err) => { 
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Internal server error.' }); 
        }
        return res.status(200).json({ message: 'Logout successful.' }); 
    }); 
};