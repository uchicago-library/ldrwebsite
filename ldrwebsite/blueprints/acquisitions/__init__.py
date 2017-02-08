
from flask import Blueprint, render_template

ACQUISITIONS = Blueprint("restriction_change", __name__, static_folder="static",
                         template_folder="./templates", url_prefix="/acquisitions")

@ACQUISITIONS.route("/", methods=["GET"])
def index():
    """a function to allow users to view a front page instructing them how to use the app
    """
    return render_template("index.html")

@ACQUISITIONS.route("/form", methods=["GET", "POST"])
def select():
    """a function to allow users to fill out the acquisition form
    """
    return render_template("form.html")

@ACQUISITIONS.route("/list", methods=["GET"])
def view_acquisitions():
    """a function to allow users to select a new restriction for a particular object in the ldr
    """
    return render_template("list.html")

@ACQUISITIONS.route("/receipt", methods=["GET"])
def view_reciept():
    """a function to allow users to view a receipt of a new acquisition record created
    """
    return render_template("receipt.html")