import express from 'express';
import User from '../user.model.js';

const router = express.Router();

router.route('/').get((req, res) => {
    User.find().then(users => res.json(users)).catch(err => res.status(400).json(`Error: ${err}`));
})

router.route('/add').post((req, res) => {
	const {username, email, lastLogin, regTime, active, password} = req.body;
    const newUser = new User({
        username,
        email,
        lastLogin,
        regTime,
        active,
        password
    });
    newUser.save().then((res => res.json('User added!'))).catch(err => res.status(400).json(`Error: ${err}`));
});

router.route('/:username').get((req, res) => {
    User.findOne({
        username: req.params.username
    }).then(u => res.json(u)).catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/delete/:username').delete((req, res) => {
    User.deleteOne({
        username: req.params.username
    }).then(() => res.json('Deleted!')).catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/unban/:username').patch((req, res) => {
    User.updateOne({
        username: req.params.username
    }, {
        $set: {
            active: true
        }
    })
            .then(() => res.json(`User ${username} updated!`))
            .catch(err => res.status(400).json(`Error: ${err}`))
    .catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/ban/:username').patch((req, res) => {
    User.updateOne({
        username: req.params.username
    }, {
        $set: {
            active: false,
        }
    })
            .then(() => res.json(`User ${username} banned!`))
            .catch(err => res.status(400).json(`Error: ${err}`))
    .catch(err => res.status(400).json(`Error: ${err}`))
})

router.route('/login/:username').patch((req, res) => {
    User.updateOne({
        username: req.params.username
    }, {
        $set: {
            lastLogin: Date.now()
        }
    })
            .then(() => res.json('Last login time updated!'))
            .catch(err => res.status(400).json(`Error: ${err}`))
    .catch(err => res.status(400).json(`Error: ${err}`))
})

export default router