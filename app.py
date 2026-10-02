from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/topics")
def topics():
    return render_template("topics.html")

if __name__ == "__main__":
    app.run(debug=True)