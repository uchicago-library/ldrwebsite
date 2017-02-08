from flask import abort, request, send_file
from flask_restful import Resource

from ldrwebsite.controls.pypremis_convenience import *
from ldrwebsite.controls.resolver_convenience import *
from uchicagoldrapicore.responses.apiresponse import APIResponse

class GetContent(Resource):
    """a class for a particular byte stream in the ldr
    """
    def get(self, arkid, premisid):
        """a method to return either an error json result or a file matching the arkid and premisid submitted

        __Args__
        1. arkid (str): a uuid representing a particular accession in the ldr
        2. premisid (str): a uuid representing a particular object in the ldr
        """
        from flask import current_app
        whitelist_opened = open(current_app.config["WHITELIST"], "r")
        check = False
        for line in whitelist_opened:
            if line.strip() == join(arkid, premisid):
                check = True
                break
        if not check:
             return abort(404,  message="could not find the object {}".format(join(arkid, premisid)))
        try:
            user = "authorized" if "private" in request.environ.get("REQUEST_URI") else "anonymous"
            event_category = "anonymous download" if user == "anonymous" else "authorized download"
            data = get_object_halves(arkid, premisid, current_app.config["LONGTERMSTORAGE_PATH"], current_app.config["LIVEPREMIS_PATH"])
            if not data:
                return abort(404, message="{} cannot be found".format(join(arkid, premisid)))
            else:
                attach_filename, mimetype = get_an_attachment_filename(data[1])
                record_path = join(current_app.config["LIVEPREMIS_PATH"],
                                   str(identifier_to_path(arkid)), "arf", "pairtree_root",
                                   str(identifier_to_path(premisid)), "arf", "premis.xml")
                make_download_event(record_path, event_category,
                                    datetime.now().isoformat(), "SUCCESS",
                                    user, data[1].objid)
                resp = send_file(data[1].content_loc,
                                 as_attachment=False,
                                 attachment_filename=attach_filename,
                                 mimetype=mimetype)
                return resp
        except Exception as e:
            return jsonify(_EXCEPTION_HANDLER.handle(e).dictify())