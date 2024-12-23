import connectToMongodb from "./Database/db.js";
import express from 'express';
import auth from './routes/auth.js'
import notes from './routes/notes.js'
import cors from 'cors'

connectToMongodb();

const app = express()
const port = 4000

//middleware
app.use(express.json());
app.use(cors({
    origin: ['https://e-notebook-frontend-eta.vercel.app'],
    methods:["GET","POST","PUT","DELETE","PATCH","OPTIONS"],
    credentials: true
}))

//routes
app.get('/',(req,res)=>{
    res.json('eNotebook backend api')
})
app.use('/api/auth',auth)
app.use('/api/notes',notes)

app.listen(port,()=>{
    console.log(`server is listening on http://localhost:${port}`);
    
})