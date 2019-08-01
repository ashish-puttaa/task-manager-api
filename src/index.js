const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT

// app.use((req, res, next) => {
//     if (req.method) {
//         res.status(503).send('Server under maintanence')
//     } else {
//         next()
//     }
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})

// const jwt = require('jsonwebtoken')

// const myFunction = async () => {
//     const token = await jwt.sign({ _id: 'mypass123' }, 'thisisarandomstring')
//     console.log(token)

//     const data = jwt.verify(token, 'thisisarandomstring')
//     console.log(data)
// }

// myFunction()