
from flask import Blueprint
from flask_restful import Resource, Api

class BrowseAccessions(Resource):
    """a class for retrieving all inventories available to the ldr
    """

    def get(self):
        """a method for getting inventories available to the ldr
        """
        return "hi"

class GetAccession(Resource):
    """a class for retrieving a specific inventory available to the ldr
    """

    def get(self, accession_id):
        """a method for getting a specific inventory availalbe to the ldr
        """
        return accession_id

ACCESSIONS = Blueprint("accessions", __name__)
API = Api(ACCESSIONS)

API.add_resource("BrowseAccessions", "/accessions")
API.add_resource("GetAccession", "/accessions/<string:accession_id>")

