
from flask import Blueprint
from flask_restful import Resource, Api

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

STAGES = Blueprint("stages", __name__)
API = Api(STAGES)

API.add_resource("BrowseStages", "/stages")

