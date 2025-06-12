from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
import google.generativeai as genai
import uuid
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI = os.getenv("mongodb://localhost:27017/")
genai.configure(api_key=GEMINI_API_KEY)

app = Flask(__name__)
CORS(app)

mongo_client = MongoClient(MONGO_URI)
try:
    mongo_client.admin.command('ping')
    print("✅ MongoDB connection successful.")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
db = mongo_client["KitchenSakhi"]
users_collection = db["users"]
chat_collection = db["user_history"]
planner_collection = db["weekly_plans"]
model = genai.GenerativeModel("gemini-1.5-flash")

def generate_meal_prompt(ingredients):
    return f"""
Suggest 3 simple and creative Indian meals using these ingredients:
{ingredients}
For each dish, include a short tip or variation.
Use bullet points.
"""

def generate_planner_prompt(preference,region):
    return f"""
**Create a culturally accurate weekly meal plan for a {preference} diet in {region} cuisine.**
**Keep the Main Heading as Your Weekly Meal Plan By Kitchen Sakhi with {preference} diet name and {region} cuisine**
Format:
- Mention Day (Monday to Sunday)
- For each day, include:
  - Breakfast
  - Lunch
  - Dinner

Each meal should:
- Be based on {region} dishes
- Follow {preference} restrictions
- Include a small variation or tip if possible

Use bullet points and simple formatting.
Do NOT include anything non-Indian.
"""

#basic chat
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        ingredients = data.get("ingredients")
        username = data.get("username", "Anonymous")

        if not ingredients:
            return jsonify({"error": "Ingredients missing"}), 400

        prompt = generate_meal_prompt(ingredients)
        response = model.generate_content(prompt)
        response_text = response.text

        chat_collection.insert_one({
            "user": username,
            "ingredients": ingredients,
            "response": response_text
        })

        return jsonify({"response": response_text})

    except Exception as e:
        return jsonify({"error": "Failed to generate response", "details": str(e)}), 500
"""   #signup
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    if users_collection.find_one({"username": username}):
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({"username": username, "password": hashed_password})

    return jsonify({"message": "User created successfully"})

#login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({"username": username})
    if not user:
        return jsonify({"error": "User not found"}), 404

    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return jsonify({"message": "Login successful", "username": username})
    else:
        return jsonify({"error": "Invalid credentials"}), 401
"""
#planner code
@app.route('/generate-plan', methods=['POST'])
def generate_plan():
    try:
        data = request.get_json()
        preference = data.get("preference", "vegetarian")
        region = data.get("region", "North Indian")
        username = data.get("username", "Anonymous")

        prompt = generate_planner_prompt(preference, region)
        response = model.generate_content(prompt)
        plan_text = response.text

        planner_collection.insert_one({
            "user": username,
            "preference": preference,
            "region": region,
            "plan": plan_text
        })

        return jsonify({"plan": plan_text})
    except Exception as e:
        return jsonify({"error": "Plan generation failed", "details": str(e)}), 500


#download planner as pdf
@app.route("/download-pdf", methods=["POST"])
def download_pdf():
    try:
        plan = request.json.get("plan", "")
        if not plan:
            return jsonify({"error": "Plan data missing"}), 400

        filename = f"{uuid.uuid4()}.pdf"
        filepath = os.path.join("static", filename)
        os.makedirs("static", exist_ok=True)

        c = canvas.Canvas(filepath, pagesize=A4)
        width, height = A4
        y = height - 50

        for line in plan.split("\n"):
            c.drawString(50, y, line.strip())
            y -= 20
            if y < 50:
                c.showPage()
                y = height - 50

        c.save()
        return jsonify({"url": f"http://localhost:5000/static/{filename}"})

    except Exception as e:
        return jsonify({"error": "PDF generation failed", "details": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok"})
if __name__ == '__main__':
    app.run(debug=True)
