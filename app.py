from flask import Flask
from flask import render_template
from flask import app
import os

app = Flask(__name__)

print render_template('hello.html')

@app.route('/')
def hello():
    return render_template('hello.html')


if __name__ == '__main__':
    app.run()