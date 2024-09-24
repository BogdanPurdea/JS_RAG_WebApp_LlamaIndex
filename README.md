## **JavaScript RAG Web Apps with LlamaIndex Documentation**

This project is based on **JavaScript RAG Web Apps with LlamaIndex** from **DeepLearning.ai**. It demonstrates how to build a basic Retrieval-Augmented Generation (RAG) web application using JavaScript, with a focus on integrating **LlamaIndex** for AI capabilities.

### **Project Structure**:
- **Backend**: Powered by Deno, providing the server and API logic for interacting with the LlamaIndex.
- **Frontend**: A simple React-based user interface for querying and displaying AI-generated responses.

### **Running the Application**

#### **Prerequisites**:
1. Install **Deno** (for the backend server) from [https://deno.land](https://deno.land).
2. Install **Node.js and npm** (for the frontend).

#### **Backend (Deno Server)**:
1. Ensure your `.env` file is set up with the OpenAI API key.
2. Navigate to the root of the project directory where the `server.ts` file is located.
3. Run the following command to start the backend server with Deno:

```bash
deno run --allow-sys --allow-read --allow-env --allow-net server.ts
```

This will launch the backend API, allowing the frontend to communicate with the LlamaIndex.

#### **Frontend (React App)**:
1. Navigate to the frontend directory.
2. Install the required dependencies by running:

```bash
npm install
```

3. Start the development server for the React frontend using the following command:

```bash
cd frontend
npm run dev
```

This will launch the frontend, allowing you to access the RAG Web App via your web browser.

---

### **Setting Up the `.env` File**

#### **1. Create a `.env` File**:
- In the root directory of your project, create a file named `.env`.

#### **2. Add Your OpenAI API Key**:
- Open the `.env` file in a text editor and add the following line, replacing `your-openai-api-key` with your actual OpenAI API key:

```bash
OPENAI_API_KEY=your-openai-api-key
```

This key is required for making API requests to OpenAI and powering the AI capabilities in your web application.

---
### **Usage**:
- Once both the **backend** and **frontend** are running, you can open your browser and interact with the AI-driven web application.
- The frontend will allow users to input queries, and the backend, powered by **LlamaIndex** and the OpenAI API, will handle the processing and generation of responses.
