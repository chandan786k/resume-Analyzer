# Resume Analyzer Setup Guide

This project consists of a React frontend and Flask backend for analyzing resume files.

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- npm or yarn (for frontend dependencies)

## Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd resume-analyzer-backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   python app.py
   ```

The backend will be available at `http://127.0.0.1:5000`

## Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd resume-analyzer-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Usage

1. Start both the backend and frontend servers
2. Open your browser and go to `http://localhost:3000`
3. Upload a PDF, DOC, or DOCX resume file
4. The system will extract and display the text content

## Features

- **File Upload**: Support for PDF, DOC, and DOCX files
- **Text Extraction**: Automatic text extraction from PDF files
- **Error Handling**: Comprehensive error handling and user feedback
- **Responsive UI**: Modern, responsive interface built with Tailwind CSS
- **CORS Support**: Properly configured for frontend-backend communication

## API Endpoints

- `GET /` - Health check endpoint
- `POST /upload` - Upload and analyze resume files

## Troubleshooting

- Make sure both servers are running
- Check that the backend is accessible at `http://127.0.0.1:5000`
- Ensure all dependencies are installed correctly
- Check the browser console for any JavaScript errors
