
from flask import Blueprint, render_template

RESTRICTION_CHANGE = Blueprint("restriction_change", __name__)

@RESTRICTION_CHANGE.route("/restriction/select")
def select():
    return render_template("index.html")

@RESTRICTION_CHANGE.route("/restriction/change/<string:accession_id>")
def change(accessionid):
    return render_template("record.html")
