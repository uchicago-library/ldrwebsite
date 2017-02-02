
from flask import Blueprint
from flask_restful import Resource, Api

from .classes import BrowseStages

STAGES = Blueprint("stages", __name__)
API = Api(STAGES)

API.add_resource(BrowseStages, "/")
