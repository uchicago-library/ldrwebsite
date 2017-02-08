
from uuid import uuid4
from flask import Blueprint, render_template, redirect, request, url_for

from .utils import new_rights_extension, get_ldr_object_filepath,\
    get_premis_record, extract_record_rights, wrap_rightsExtensions,\
    deactivate_group_of_rights_extensions

RESTRICTION_CHANGE = Blueprint("restriction_change", __name__, template_folder="./templates", url_prefix="/modify_restrictions")

@RESTRICTION_CHANGE.route("/", methods=["GET", "POST"])
def select_an_object():
    """a method to return a form for entering an object to change restrictions of
    """
    if request.method == "POST":
        form = request.form
        input_value = form.get("object-id").split("/")
        accessionid = input_value[0]
        objid = input_value[1]
        return url_for("restriction_change.make_change",
                       accessionid=accessionid, objid=objid)
    else:
        return render_template("front.html")

@RESTRICTION_CHANGE.route("/change/<string:accessionid>/<string:objid>",
                          methods=["GET", "POST"])
def make_a_change(accessionid, objid):
    """a method to process a form to change the active restriction on a particular object
       and change existing restrictions to inactive

    __Args__
    1. accessionid (str): the identifier for a particular accession
    2. objid (str): the identifier for a particular object
    """
    from flask import current_app
    path_to = get_ldr_object_filepath(accessionid, objid,
                                      current_app.config.get("LIVEPREMIS_PATH"))
    record = get_premis_record(path_to)
    current_restrictions = extract_record_rights(record)
    current_restriction = ','.join(current_restrictions)
    current_accession = accessionid
    current_object = "{}/{}".format(current_accession, objid)
    if request.method == "POST":
        form = request.form
        new_rights_info = new_rights_extension(uuid4().hex, current_object,
                                               form.get("desired-restriction"), True,
                                               form.get("comment"))
        rights_extensions = deactivate_group_of_rights_extensions(record)
        rights_extensions.append(new_rights_info)
        new_rights = wrap_rightsExtensions(rights_extensions)
        record.add_rights(new_rights)
        record.write_to_file(path_to)
        return redirect(url_for("restriction_change.receipt", objectChanged=current_object,
                                comment=form.get("comment"),
                                oldRestriction=form.get("current-restriction"),
                                newRestriction=form.get("desired-restriction"), _external=True))
    else:
        return render_template("changeform.html", objectToChange=current_object,
                               accession_id=accessionid, objid=objid,
                               currentRestriction=current_restriction, _external=True)

@RESTRICTION_CHANGE.route("/restrictions/receipt",
                          methods=["GET"])
def receipt():
    """a method to return the receipt for a change in restrictions
    """
    list_parts = request.query_string.decode("utf-8").split("&")
    a_dict = {}
    for n_part in list_parts:
        label, value = n_part.split("=")
        a_dict[label] = value
    return render_template("receipt.html", **a_dict)
