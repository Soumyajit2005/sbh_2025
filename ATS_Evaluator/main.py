from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os
import io
import base64
import pdf2image
import google.generativeai as genai
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Configure Google Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Initialize FastAPI app
app = FastAPI()
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

# Function to convert PDF to base64 image (first page only)
def convert_pdf_to_image_base64(pdf_file: bytes):
    try:
        images = pdf2image.convert_from_bytes(pdf_file)
        first_page = images[0]

        img_byte_arr = io.BytesIO()
        first_page.save(img_byte_arr, format='JPEG')
        img_byte_arr = img_byte_arr.getvalue()

        return [
            {
                "mime_type": "image/jpeg",
                "data": base64.b64encode(img_byte_arr).decode()
            }
        ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Function to get Gemini response
def get_gemini_response(prompt: str, pdf_content, job_description: str) -> str:
    try:
        response = model.generate_content([prompt, pdf_content[0], job_description])
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Prompt for "Tell me about yourself"
input_prompt1 = """
You are an experienced Technical Human Resource Manager. Your task is to review the provided resume against the job description.
Please share your professional evaluation on whether the candidate's profile aligns with the role.
Highlight the strengths and weaknesses of the applicant in relation to the specified job requirements.
"""

# Prompt for "Percentage match"
input_prompt3 = """
You are a skilled ATS (Applicant Tracking System) scanner with a deep understanding of data science and ATS functionality.
Your task is to evaluate the resume against the provided job description.
Give me the percentage of match if the resume matches the job description. First output the percentage,
then keywords missing, and finally your final thoughts.
"""


@app.post("/tell_me_about_yourself")
async def tell_me_about_yourself(
    job_description: str = Form(...),
    resume: UploadFile = File(...)
):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    pdf_bytes = await resume.read()
    pdf_content = convert_pdf_to_image_base64(pdf_bytes)
    response = get_gemini_response(input_prompt1, pdf_content, job_description)
    return JSONResponse(content={"response": response})


@app.post("/percentage_match")
async def percentage_match(
    job_description: str = Form(...),
    resume: UploadFile = File(...)
):
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    pdf_bytes = await resume.read()
    pdf_content = convert_pdf_to_image_base64(pdf_bytes)
    response = get_gemini_response(input_prompt3, pdf_content, job_description)
    return JSONResponse(content={"response": response})
