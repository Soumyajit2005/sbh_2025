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
# from fastapi import CORS
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

genai.configure(api_key = os.getenv("GOOGLE_API_KEY"))

def extract_pdf_bytes(file_bytes):
    with tempfile.NamedTemporaryFile(delete = False, suffix = ".pdf") as tmp_file:
        tmp_file.write(file_bytes)
        tmp_file.flush()
        pdf_reader = PdfReader(tmp_file.name)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size = 5000, chunk_overlap = 1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks):
    embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding = embeddings)
    vector_store.save_local("faiss-index")
    return vector_store

def get_qa_chain():
    prompt_template = """
                    Based on the given data, recommend career for the person, give proper career path with roadmaps,
                    also give the chances of becoming successful on the path, if any higher studies is possible,
                    then also provide context for that. Do not give inappropriate answers
                    
                    Context: \n{context}\n
                    Answer: """
    
    model = ChatGoogleGenerativeAI(model = "gemini-1.5-flash", temperature = 0.3)
    prompt = PromptTemplate(template = prompt_template, input_variables = ["context"])
    chain = load_qa_chain(model, chain_type = "stuff", prompt = prompt)
    return chain

app = FastAPI()
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/career-recommend/")
async def get_career_path(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        text = extract_pdf_bytes(file_bytes)
        chunks = get_text_chunks(text)
        vector_store = get_vector_store(chunks)

        #load from vector DB
        db = FAISS.load_local("faiss-index",
                              GoogleGenerativeAIEmbeddings(model = "models/embedding-001"),
                              allow_dangerous_deserialization = True)
        retriever = db.as_retriever()
        docs = retriever.get_relevant_documents("Provide a complete career recommendation based on the resume.")

        chain = get_qa_chain()
        response = chain.run(input_documents=docs)

        return JSONResponse(content={"career_path": response})
    
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
