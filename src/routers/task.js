const express = require('express')
const Task = require('./../models/task')
const auth = require('./../middleware/auth')
const router = new express.Router()

// router.post('/tasks', (req, res) => {
//     const task = new Task(req.body)

//     task.save().then(() => {
//         res.status(201).send(task)
//     }).catch((error) => {
//         res.status(400).send(error)
//     })
// })

// router.post('/tasks', async (req, res) => {
//     const task = new Task(req.body)

//     try {
//         await task.save()
//         res.status(201).send(task)
//     } catch (error) {
//         res.status(400).send()
//     }
// })

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send()
    }
})

// router.get('/tasks', (req, res) => {
//     Task.find({}).then((tasks) => {
//         res.send(tasks)
//     }).catch((error) => {
//         res.status(500).send()
//     })
// })

// router.get('/tasks', async (req, res) => {
//     try {
//         const tasks = await Task.find({})
//         res.send(tasks)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    try {
        // const tasks = await Task.find({ owner: req.user._id })
        // or
        // await req.user.populate('tasks').execPopulate()

        const match = {}
        const sort = {}

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = (parts[1] === 'desc') ? -1 : 1
        }

        await req.user.populate({
            path: 'tasks',
            match,
            options: { // Pagination
                limit: parseInt(req.query.limit),
                // skip: (parseInt(req.query.skip) - 1) * parseInt(req.query.limit)
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

// router.get('/tasks/:id', (req, res) => {
//     const _id = req.params.id
//     Task.findById(_id).then((task) => {
//         if (!task) {
//             return res.status(404).send()
//         }

//         res.send(task)
//     }).catch((error) => {
//         res.status(500).send()
//     })
// })

// router.get('/tasks/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const task = await Task.findById(_id)

//         if (!task) {
//             return res.status(404).send()
//         }

//         res.send(task)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

// router.patch('/tasks/:id', async (req, res) => {

//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['description', 'completed']
//     const isValidOperation = updates.every((update) => (allowedUpdates.includes(update)))

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid update' })
//     }

//     try {
//         const task = await Task.findById(req.params.id)

//         updates.forEach((update) => (task[update] = req.body[update]))
//         await task.save()

//         // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

//         if (!task) {
//             return res.status(404).send()
//         }

//         res.send(task)
//     } catch (error) {
//         res.status(400).send()
//     }
// })

router.patch('/tasks/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => (allowedUpdates.includes(update)))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update' })
    }

    try {
        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({ _id: req.parmas.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => (task[update] = req.body[update]))
        await task.save()

        res.send(task)
    } catch (error) {
        res.status(400).send()
    }
})

// router.delete('/tasks/:id', async (req, res) => {
//     try {
//         const task = await Task.findByIdAndDelete(req.params.id)

//         if (!task) {
//             return res.status(404).send()
//         }

//         res.send(task)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router