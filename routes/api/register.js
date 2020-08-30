const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();
const User = require("../../models/User");

router.post("/", async (req, res) => {

      let { username, password } = req.body;
  
      try {
        let user = await User.findOne({ username });
        if (user) {
          return res
            .status(200)
            .json({ 
                ok: false,
                errors: true,
                data: 'User already exists!'
            });
        }
        user = new User({
          username,
          password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        
        // Return JWT 
        const payload = {
          user: {
            id: user.id,
            username: user.username
          },
        };
        jwt.sign(payload, config.get("jwtSecret"), 
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err;
          res.json({
            ok: true,
            errors: false,
            data: {
                token: token
            }
          });
        });
      } catch (err) {
        console.error(err.message);
        res.status(200).send(err.message);
      }
    }
  );

module.exports = router;