"""an api for retrieving information about inventories of a particular accession in the ldr
"""

from flask import Blueprint
from flask_restful import Resource, Api

INVENTORY = Blueprint("inventory", __name__)

class BrowseInventories(Resource):
    """a class for retrieving all inventories available to the ldr
    """

    def get(self):
        """a method for getting inventories available to the ldr
        """
        return "hi"

class GetInventory(Resource):
    """a class for retrieving a specific inventory available to the ldr
    """

    def get(self, accession_id):
        """a method for getting a specific inventory availalbe to the ldr
        """
        return accession_id

INVENTORY = Blueprint("inventory", __name__)
API = Api(INVENTORY)

API.add_resource("BrowseInventories", "/inventories")
API.add_resource("GetInventory", "/inventories/<string:accession_id>")
