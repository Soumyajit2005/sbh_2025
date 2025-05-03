from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
import aiofiles
from PyPDF2 import PdfReader
import os
import tempfile
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
import google.generativeai as genai
import uvicorn

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

# Functions
def extract_text_pdf_bytes(file_bytes):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
        tmp_file.write(file_bytes)
        tmp_file.flush()
        pdf_reader = PdfReader(tmp_file.name)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")
    return vector_store

def get_conversation_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context. 
    If the answer is not in the context, say "Answer not available in context."
    Do not give vague or inappropriate answers.
    
    Context: \n{context}\n
    Question: \n{question}\n
    Answer:
    """
    model = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

# API Endpoint
@app.post("/ask-pdf/")
async def ask_from_pdf(file: UploadFile = File(...), question: str = Form(...)):
    try:
        file_bytes = await file.read()
        # Extract and chunk
        text = extract_text_pdf_bytes(file_bytes)
        chunks = get_text_chunks(text)
        vector_store = get_vector_store(chunks)

        # Load from vector DB
        db = FAISS.load_local("faiss_index", 
                              GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
                              allow_dangerous_deserialization = True)
        docs = db.similarity_search(question)

        # Get chain and answer
        chain = get_conversation_chain()
        response = chain.run(input_documents=docs, question=question)

        return {"answer": response}

    except Exception as e:
        return JSONResponse(content={"error": str(e)})
