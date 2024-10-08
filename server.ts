import * as mod from "https://deno.land/std@0.213.0/dotenv/mod.ts";
import { 
    Document, 
    VectorStoreIndex, 
    SimpleDirectoryReader, 
    RouterQueryEngine,
    storageContextFromDefaults,
    ContextChatEngine} from "npm:llamaindex";
import { createAgent } from "./create_agent.js";
    
const keys = await mod.load({export:true}) // read API key from .env

const documents1 = await new SimpleDirectoryReader().loadData({directoryPath: "./data"})
const index1 = await VectorStoreIndex.fromDocuments(documents1)
const queryEngine1 = index1.asQueryEngine()

const documents2 = await new SimpleDirectoryReader().loadData({directoryPath: "./data2"})
const index2 = await VectorStoreIndex.fromDocuments(documents2)
const queryEngine2 = index2.asQueryEngine()

const queryEngine = await RouterQueryEngine.fromDefaults({
    queryEngineTools: [
        {
            queryEngine: queryEngine1,
            description: "Useful for questions about Dan Abramov"
        },
        {
            queryEngine: queryEngine2,
            description: "Useful for questions about the React library"
        }
    ]
});

const agent = createAgent(queryEngine);

const handler = async (req) => {
    if(req.method == "POST") {
        // we'll expect the incoming query to be a JSON object of the form {query: ...}
        console.log(req)
        let data = await req.json()
        let answer = await queryEngine.query({query: data.query})
        // and our response will be a JSON object of the form {response: ...}
        let responseObj = {
            response: answer.toString()
        }
        return new Response(JSON.stringify(responseObj), { 
            status: 200 ,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"            
            }
        })
    } else if(req.method == "OPTIONS") {
        return new Response("", { 
            status: 200 ,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"            
            }
        })
    } else {
        return new Response("Not found", { status: 404 })
    }
}
//Deno.serve( { port: 8000 }, handler2 )
Deno.serve( { port: Deno.env.get("PORT2") }, handler )
