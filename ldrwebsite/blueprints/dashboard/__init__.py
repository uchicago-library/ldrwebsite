from flask import Blueprint, render_template

from .controls import SummarizeState, SummarizeAccession, InventorySummarizer

DASHBOARD = Blueprint("dashboard", __name__, template_folder="./templates")

@DASHBOARD.route("/dashboard", methods=["GET"])
def select():
    """a function to allow users to browse the archives and stages in the ldr
    """
    from flask import current_app
    summary = SummarizeState(current_app.config.get("LONGTERMSTORAGE_PATH"),
                             current_app.config.get("STAGING_PATH"),
                             current_app.config.get("INVENTORY_PATH"))
    return render_template("index.html", stages=summary.staged,
                           inventoried=summary.inventoried,
                           transfers=summary.in_transfer,
                           pending=summary.non_inventoried)

@DASHBOARD.route("/dashbord/<string:accessionid>", methods=["GET"])
def change(accessionid):
    """a function to allow users to view details about a particular archive
    """
    from flask import current_app
       
    # record_info = SummarizeAccession(current_app.config.get("LONGTERMSTORAGE_PATH"),
    #                                  accessionid)
    # inventory_info = InventorySummarizer(current_app.config.get("INVENTORY_PATH"),
    #                                      accessionid)
    # return render_template("record.html", information=record_info,
    #                        inventory=inventory_info)
