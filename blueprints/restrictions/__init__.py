
from flask import Blueprint, render_template, redirect, request
from uuid import uuid4

from .utils import new_rights_extension, get_ldr_object_filepath,\
    get_premis_record, extract_record_rights, wrap_rightsExtensions,\
    deactivate_group_of_rights_extensions

RESTRICTION_CHANGE = Blueprint("restriction_change", __name__)

@RESTRICTION_CHANGE.route("/restrictions/", methods=["GET", "POST"])
def select_an_object():
    """a method to return a form for entering an object to change restrictions of
    """
    if request.method == "POST":
        form = request.form
        input_value = form.get("object-id").split("/")
        accessionid = input_value[0]
        objid = input_value[1]
        return redirect("/ldrrestrictions/change/{}/{}".format(accessionid, objid))
    else:
        return render_template("front.html")

@RESTRICTION_CHANGE.route("/restrictions/change/<string:accessionid>/<string:objid>",
                          methods=["GET", "POST"])
def make_a_change(accessionid, objid):
    """a method to process a form to change the active restriction on a particular object
       and change existing restrictions to inactive

    __Args__
    1. accessionid (str): the identifier for a particular accession
    2. objid (str): the identifier for a particular object
    """
    from flask import current_app
    root_path = current_app.config.get("LIVEPREMIS_PATH")
    path_to = get_ldr_object_filepath(accessionid, objid, root_path=root_path)
    fpath = get_ldr_object_filepath(accessionid, objid)
    record = get_premis_record(fpath)
    current_restrictions = extract_record_rights(record)
    current_restriction = ','.join(current_restrictions)
    current_accession = accessionid
    current_object = "{}/{}".format(current_accession, objid)
    if request.method == "POST":
        form = request.form
        new_rights_info = new_rights_extension(uuid4().hex, current_object,
                                               form.get("desired-restriciton"), True,
                                               form.get("comment"))
        rights_extensions = deactivate_group_of_rights_extensions(record)
        rights_extensions.append(new_rights_info)
        new_rights = wrap_rightsExtensions(rights_extensions)
        record.add_rights(new_rights)
        record.write_to_file(path_to)
        return render_template("receipt.html", objectChanged=current_object,
                               newRestriction=form.get("desired_restriction"))
    else:
        return render_template("changeform.html", objectToChange=current_object,
                               currentRestriction=current_restriction)
