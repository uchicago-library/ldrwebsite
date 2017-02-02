from datetime import datetime
from flask import jsonify, Blueprint, request, send_file, make_response
from flask_restful import abort, Resource, Api, reqparse
from io import BytesIO
from os import listdir
from os.path import basename, join, exists, isdir
from werkzeug.utils import secure_filename
from re import compile as regex_compile
from xml.etree import ElementTree as ET
import re
from sys import stdout, stderr

from uchicagoldrapicore.responses.apiresponse import APIResponse
from uchicagoldrapicore.responses.apiresponse import APIResponse
from uchicagoldrapicore.lib.apiexceptionhandler import APIExceptionHandler

_ALPHANUM_PATTERN = regex_compile("^[a-zA-Z0-9]+$")
_NUMERIC_PATTERN = regex_compile("^[0-9]+$")
_EXCEPTION_HANDLER = APIExceptionHandler()

# Create our app, hook the API to it, and add our resources

BP = Blueprint("ldrstagesapi", __name__)
API = Api(BP)
# file retrieval endpoints
API.add_resource(BrowseStages, "/")
