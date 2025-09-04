// TODO: this is where stigg integration will go 
//referencing: https://docs.stigg.io/api-and-sdks/integration/backend/nodejs
import 'dotenv/config';
import { Stigg } from '@stigg/node-server-sdk';

const stiggClient = Stigg.initialize({ apiKey: process.env.STIGG_API_KEY });
if (!process.env.STIGG_API_KEY){
    console.error('add your Stigg API key to the dotenv file')
}

export default stiggClient;