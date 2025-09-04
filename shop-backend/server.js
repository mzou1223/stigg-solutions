// this is where stigg integration will go 
const express = require('express');
const cors = require('cors');
import { Stigg } from '@stigg/node-server-sdk';

const app = express();
app.use(cors());
app.use(express.json());

const stiggClient = Stigg.initialize({ apiKey: process.env.STIGG_API_KEY });
if (!process.env.STIGG_API_KEY){
    console.error('make sure to add your Stigg API key to the dotenv file')
}

export default stiggClient;