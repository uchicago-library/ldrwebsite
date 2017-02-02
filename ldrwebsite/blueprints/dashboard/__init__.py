from flask import Blueprint, render_template

DASHBOARD = Blueprint("restriction_change", __name__)

@DASHBOARD.route("/restriction/select")
def select():
    """a function to allow users to enter an accession id and an object id to change restricitons
    """
    return render_template("index.html")

@DASHBOARD.route("/restriction/change/<string:accession_id>")
def change(accessionid):
    """a function to allow users to select a new restriction for a particular object in the ldr
    """
    return render_template("record.html")

