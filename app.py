from flask import Flask, render_template, request
import json

app = Flask(__name__)

# Load JSON
with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

def get_answer(msg):
    msg = msg.lower().strip()

    best_match = None
    best_score = 0

    for item in data:
        q = item["question"].lower()

        if msg == q:
            return item["answer"]

        words = msg.split()
        score = sum(1 for w in words if w in q)

        if score > best_score:
            best_score = score
            best_match = item["answer"]

    if best_score > 0:
        return best_match

    return "Sorry 😕 I don't understand."

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get", methods=["POST"])
def chat():
    msg = request.form.get("msg")
    return get_answer(msg)

if __name__ == "__main__":
    app.run(debug=True)
