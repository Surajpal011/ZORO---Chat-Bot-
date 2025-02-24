from flask import Flask, request, jsonify, render_template
import google.generativeai as genai
import re  # Importing regular expressions

# Configure Gemini API
genai.configure(api_key="AIzaSyA0F9EacJ8GV8oTlv-fW4G2KwuuG8kBckM")

app = Flask(__name__)

# Function to clean markdown formatting
def clean_markdown(text):
    # Remove markdown symbols like **bold** and * lists
    text = re.sub(r'\*\*([^\*]+)\*\*', r'\1', text)  # Remove **bold**
    text = re.sub(r'\*([^\*]+)\*', r'\1', text)      # Remove *italic*
    text = re.sub(r'^\* ', '', text, flags=re.MULTILINE)  # Remove bullet points at the beginning of lines
    return text

@app.route("/")
def index():
    return render_template("../public/index.html")

@app.route("/generate", methods=["POST"])
def generate():
    user_input = request.json.get("command")
    if user_input:
        model = genai.GenerativeModel('gemini-pro')
        response = model.generate_content(user_input)
        
        # Handle potential errors
        if response.candidates and response.candidates[0].finish_reason != 'RECITATION':
            cleaned_text = clean_markdown(response.text)  # Clean the response text
            return jsonify({"response": cleaned_text})
        else:
            return jsonify({"response": "I can't provide content due to copyright restrictions."})
    return jsonify({"response": "No input provided."})

# Ensure the app runs only once
if __name__ == "__main__":
    app.run(debug=True)
