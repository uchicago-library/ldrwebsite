
from flask import Blueprint
from flask_restful import Api

from .controls import GetContent

UNRESTRICTED_RESOLVER = Blueprint("unrestricted_resolver", __name__)
API = Api(UNRESTRICTED_RESOLVER)

API.add_resource(GetContent, "/<string:accession_id>/<string:object_id>")