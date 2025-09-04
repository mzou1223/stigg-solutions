// TODO: this is where stigg integration will go 
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Stigg } from '@stigg/node-server-sdk';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

const stiggClient = Stigg.initialize({ apiKey: process.env.STIGG_API_KEY });
if (!process.env.STIGG_API_KEY){
    console.error('make sure to add your Stigg API key to the dotenv file')
}

app.get('/', (req,res) => {
    res.json({
        status: 'testing is working. test',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, ()=> {
    console.log(`server running on port: ${PORT}`)
})

export default stiggClient;