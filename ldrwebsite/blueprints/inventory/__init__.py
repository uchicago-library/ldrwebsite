"""an api for retrieving information about inventories of a particular accession in the ldr
"""

from urllib.request import urlopen
from json import loads, load
from os import listdir
from os.path import exists, join
from flask import abort, Blueprint, jsonify, render_template
from flask_restful import Resource, Api
from pypairtree.utils import identifier_to_path
from uchicagoldrapicore.responses.apiresponse import APIResponse

INVENTORY = Blueprint("inventory", __name__, url_prefix="/inventory", template_folder='./templates')

@INVENTORY.route("/")
def list_inventories():
    """a method for getting inventories available to the ldr
    """
    from flask import current_app
    filepath = join(current_app.config.get("INVENTORY_PATH"), "completed.json")
    data = load(open(filepath, 'r'))
    return render_template("browse.html", inventory_list=data)

@INVENTORY.route("/<string:accession_id>")
def get_an_inventory(accession_id):
    """a method for getting a specific inventory availalbe to the ldr
    """
    from flask import current_app
    dirpath = join(current_app.config.get("INVENTORY_PATH"), accession_id)
    if exists(dirpath):
        all_pages = [x.split('.json')[0] for x in listdir(dirpath) if 'index' not in x]
        accession_records = join(current_app.config.get("LONGTERMSTORAGE_PATH"),
                                 str(identifier_to_path(accession_id)),
                                 join("arf", "admin", "accession_records"))
        accession_records = [join(accession_records, x) for x in listdir(accession_records)]
        accession_records = [open(x, "r").read() for x in accession_records]
        return render_template("inventory.html", accession_records=accession_records,
                               page_list=all_pages, accession_id=accession_id)
    else:
        return abort(404)

@INVENTORY.route("/<string:accession_id>/<string:page_num>")
def get_an_inventory_page(accession_id, page_num):
    """a method for getting a page inventory file
    """
    from flask import current_app
    dirpath = join(current_app.config.get("INVENTORY_PATH"), accession_id)
    if exists(dirpath):
        all_pages = [x.split('.json')[0] for x in listdir(dirpath) if 'index' not in x]
        if page_num not in all_pages:
            return abort(404)
        else:
            page_filepath = join(dirpath, page_num + ".json")
            if exists(page_filepath):
                data = load(open(page_filepath, "r"))
                files = []
                for n_file in data["files"]:
                    link_to_extract_from = n_file["premis"]
                    accessionid, objid = link_to_extract_from.split("/private/")[1].\
                        split("/premis")[0].split("/")
                    n_thing = {"content": n_file["content"], "premis": n_file["premis"],
                               "name": n_file["name"], "accessionid": accessionid, "objid": objid}
                    files.append(n_thing)
                return render_template("page.html", accession_id=accession_id,
                                       file_list=files)
            else:
                return abort(404)
