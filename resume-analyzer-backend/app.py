from flask import Flask, request, jsonify
from flask_cors import CORS
# -*- coding: utf-8 -*-

import PyPDF2
import os
import traceback

app = Flask(__name__)
# Restrictive CORS: allow only the deployed frontend origin
CORS(
    app,
    resources={r"/*": {"origins": ["https://resume-analyzer-5bbd.vercel.app"]}},
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
    expose_headers=["Content-Type"],
    supports_credentials=False
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"message": "Resume Analyzer Backend is running!", "status": "healthy"})

@app.route("/upload", methods=["POST"])
def upload_file():
    try:
        if "resume" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["resume"]
        
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Validate file type
        allowed_extensions = {'.pdf', '.doc', '.docx'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_extensions:
            return jsonify({"error": f"File type {file_ext} not supported. Please upload PDF, DOC, or DOCX files."}), 400

        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        extracted_text = ""
        if file.filename.lower().endswith(".pdf"):
            try:
                with open(filepath, "rb") as f:
                    reader = PyPDF2.PdfReader(f)
                    for page in reader.pages:
                        extracted_text += page.extract_text() + "\n"
            except Exception as e:
                return jsonify({"error": f"Error reading PDF: {str(e)}"}), 500

        return jsonify({
            "message": f"File {file.filename} uploaded successfully!",
            "text": extracted_text[:500] if extracted_text else "Text extraction not available for this file type",
            "file_size": len(extracted_text),
            "file_type": file_ext
        })

    except Exception as e:
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    print("Starting Resume Analyzer Backend...")
    print("Backend will be available at: http://127.0.0.1:5000")
    print("Health check: http://127.0.0.1:5000/")
    app.run(debug=True, host='127.0.0.1', port=5000)

