import {
    OpenAIAgent,
    QueryEngineTool,
    FunctionTool} from "npm:llamaindex";

function sumNumbers({a, b}) {
    return a + b;
}

function createAgent(queryEngine) {
    const sumJSON = {
        type: "object",
        properties: {
            a: {
                type: "number",
                description: "The first number"
            },
            b: {
                type: "number",
                description: "The second number"
            }
        },
        required: ["a", "b"]  
    };

    const sumFunctionTool = new FunctionTool(sumNumbers, {
        name: "sumNumbers",
        description: "Use this function to sum two numbers",
        parameters: sumJSON
    });

    const queryEngineTool = new QueryEngineTool({
        queryEngine: queryEngine,
        metadata: {
            name: "react_and_dan_abramov_engine",
            description: "A tool that can answer questions about Dan Abramov and the React library"
        }
    });

    const agent = new OpenAIAgent({
        tools: [queryEngineTool, sumFunctionTool],
        verbose: true
    });

    return agent;
}

export {
    createAgent
}