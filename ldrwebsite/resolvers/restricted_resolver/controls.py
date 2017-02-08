
from flask_restful import Resource

from ldrwebsite.controls.pypremis_convenience import *
from ldrwebsite.controls.resolver_convenience import *

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
                stderr.write("{}\n".format(mimetype))
                stderr.write("{}\n".format(attach_filename))
                resp = send_file(data[1].content_loc.replace("premis.xml", "content.file"),
                                 as_attachment=False,
                                 attachment_filename=attach_filename,
                                 mimetype=mimetype)
                return resp
        except Exception as e:
            return jsonify(_EXCEPTION_HANDLER.handle(e).dictify())

class GetPremis(Resource):
    """a class for retrieving the premis reocrd
    """
    def get(self, arkid, premisid):
        """a method to to retrieve the live premis record for a given object

        __Args__
        1. arkid (str): an accession identifier
        2. premisid (str): an object identifier
        """
        from flask import current_app
        try:
            data = get_data_half_of_object(arkid, premisid, current_app.config["LIVEPREMIS_PATH"])
            if not data:
                return abort(404, message="{} premis record cannot be found.".format(join(arkid, premisid)))
            else:
                resp = send_file(data[0],
                                 as_attachment=False,
                                 attachment_filename=premisid + ".xml",
                                 mimetype="application/xml")
                return resp
        except Exception as e:
            return jsonify(_EXCEPTION_HANDLER.handle(e).dictify())
