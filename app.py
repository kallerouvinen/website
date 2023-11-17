from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/clicked", methods=["GET"])
def clicked():
    print("I was clicked!")
    return render_template("clicked.html")
