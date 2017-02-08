
from flask import Blueprint
from flask_restful import Resource, Api

from .classes import BrowseAccessions, GetASpecificAdminNote, GetASpecificLegalNote,\
                     GetASpecificRecord, GetAdminInfo, GetLegalInfo, GetRecords, GetAnAccession

ACCESSIONS = Blueprint("accessions", __name__, url_prefix="/accessions")
API = Api(ACCESSIONS)

API.add_resource(BrowseAccessions, "/")
API.add_resource(GetAnAccession, "/<string:arkid>")
API.add_resource(GetRecords, "/<string:arkid>/recordinfo")
API.add_resource(GetASpecificRecord, "/<string:arkid>/recordinfo/<string:filename>")
API.add_resource(GetLegalInfo, "/<string:arkid>/legalinfo")
API.add_resource(GetASpecificLegalNote, "/<string:arkid>/legalinfo/<string:filename>")
API.add_resource(GetAdminInfo, "/<string:arkid>/admininfo")
API.add_resource(GetASpecificAdminNote, "/<string:arkid>/admininfo/<string:filename>")
