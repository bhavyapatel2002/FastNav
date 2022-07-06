from django.shortcuts import render
from flask import Flask, redirect, url_for, render_template, request
import googlemaps
import os

# initialize Flask application
app = Flask(__name__)

# landing page
@app.route("/")
def home():
    return render_template("home.html")

@app.route("/search_route")
def map():
    return render_template("test.html")

if __name__ == "__main__":
    API_KEY = 'AIzaSyCxpG1Rw9eLQAVOra0MRo_v2ZWpeeKEwpM'

    map_client = googlemaps.Client(API_KEY)

    print(dir(map_client))

    # launch Flask app
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
