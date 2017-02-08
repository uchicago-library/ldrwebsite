from flask import Blueprint, render_template

ACQUISITIONS = Blueprint("restriction_change", __name__)

@ACQUISITIONS.route("/acquisitions/new")
def select():
    """a function to allow users to fill out the acquisition form
    """
    return render_template("form.html")

@ACQUISITIONS.route("/acquisitions/donorOrSource")
def set_donor_or_source():
    """a method to allow users to file out the donor or source form
    """
    return render_template("form.html")

@ACQUISITIONS.route("/acquisitions/physicalMedia")
def set_physical_media():
    """a method to allow users to fill out the add physical media form
    """
    return render_template("form.html")

@ACQUISITIONS.route("/acquisitions/restrictions")
def set_restrictions():
    """a method to allow users to fill out the add restriction form
    """
    return render_template("form.html")

@ACQUISITIONS.route("/acquisitions/list")
def view_acquisitions():
    """a function to allow users to select a new restriction for a particular object in the ldr
    """
    return render_template("list.html")
