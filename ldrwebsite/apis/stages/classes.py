
from os import listdir
from flask import current_app, jsonify
from flask_restful import Resource

from uchicagoldrapicore.responses.apiresponse import APIResponse

class BrowseStages(Resource):
    def get(self):
        from flask import current_app
        all_stages = self._find_stages(current_app.config["STAGING_PATH"])
        output = {}
        for n in all_stages:
            output[n.strip()] = {"identifier":n.strip()}
        resp = APIResponse("success", data=output)
        return jsonify(resp.dictify())

    def _find_stages(self, a_path):
        for n in listdir(a_path):
            yield n
