from flask import Blueprint
from flask_restful import Api

from .controls import GetContent, GetPremis

RESTRICTED_RESOLVER = Blueprint("restricted_resolver", __name__)
API = Api(RESTRICTED_RESOLVER)

API.add_resource(GetContent, "/<string:accession_id>/<string:object_id>/content")
API.add_resource(GetPremis, "/<string:accession_id>/<string:object_id>/premis")
