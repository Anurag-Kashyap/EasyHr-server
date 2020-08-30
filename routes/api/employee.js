const express = require('express');
const auth = require('../../middleware/auth');

const router = express.Router();
const Employee = require('../../models/Employee');

router.get('/', auth, async (req, res) => {
  
    try {
        let employees = await Employee.find({});
        if (!employees.length) {
            return res
            .status(200)
            .json({ 
                ok: false,
                errors: true,
                data: 'No Employee records found'
            });
        }
        return res.json({
            ok: true,
            errors: false,
            data: {
                employees
            }
        })
    } catch (err) {
      console.error(err.message);
      res.status(200).send(err.message);
    }
});

router.post('/', auth, async (req, res) => {
    let { _id, name, email, salary, date } = req.body;

    let _employee = new Employee({
        name: name,
        email: email,
        salary: salary,
        date: date
    });
  
    try {
        let employee = await Employee.findById(_id);
        if (!employee) {
            await _employee.save();
            return res.json({
                ok: true,
                errors: false,
                data: {
                    msg: 'new employee added successfully'
                }
            })
        }
        employee = await Employee.findByIdAndUpdate(
            _id, 
            { $set: {
                name: name,
                email: email,
                salary: salary,
                date: date
            }},
            { new: true }
        );

        return res.json({
            ok: true,
            errors: false,
            data: {
                employee
            }
        })
    } catch (err) {
      console.error(err.message);
      res.status(200).json(err.message);
    }
});

router.post('/delete-emp', auth, async (req, res) => {
    let { id } = req.body;
    try {
        await Employee.findByIdAndDelete(id);
        return res.json({
            ok: true,
            errors: false,
            data: {
                msg: 'employee deleted successfully'
            }
        })
    } catch (error) {
        console.error(error);
        return res.json(err.message)
    }
});

module.exports = router;