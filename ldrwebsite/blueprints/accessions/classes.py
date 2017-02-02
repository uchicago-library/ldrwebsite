
from os import listdir
from os.path import exists, join, isdir
from flask import send_file, jsonify
from flask_restful import Resource

from uchicagoldrapicore.responses.apiresponse import APIResponse
from .utils import construct_directorypath, construct_filepath

class GetAFile(Resource):
    """a class for constructing the path to a particular file and returning the file object
    """
    def __init__(self, arkid, relevant_directory, filename):
        from flask import current_app
        self.directory = construct_directorypath(arkid, relevant_directory,
                                                 current_app.config.get("LONGTERMSTORAGE_PATH"))
        self.filepath = construct_filepath(self.directory, filename)

    def _construct_filepath(self, directory_path, filename):
        """ a method for returning an absolute filepath
        """
        return join(directory_path, filename)

    def get_file(self):
        """a method for returning a particular file as a file object
        """
        return send_file(self.filepath, as_attachment=False, mimetype="text/plain")

class BrowseAccessions(Resource):
    """a class for retrieving all accession records available for a  given accession to the ldr
    """

    def get(self):
        """a method for returning a json record of all accessions available in the ldr
        """
        from flask import current_app
        all_accessions = self._find_accessions(current_app.config["LONGTERMSTORAGE_PATH"])
        output = {}
        for n_item in all_accessions:
            is_it_done = exists(join(n_item, "arf/admin", "WRITE_FINISHED.json"))
            an_id = n_item.replace(current_app.config["LONGTERMSTORAGE_PATH"], "").replace("/", "")
            output[an_id] = {"accession records": join("/", an_id, "recordinfo"),
                             "legal notes": join("/", an_id, "legalinfo"),
                             "admin notes": join("/", an_id, "recordinfo"),
                             "identifier":an_id,
                             "transferred":is_it_done}
        resp = APIResponse("success", data=output)
        return jsonify(resp.dictify())

    def _find_accessions(self, a_path):
        for n_item in listdir(a_path):
            if isdir(join(a_path, n_item)):
                if n_item == "arf":
                    yield a_path
                    break
                yield from self._find_accessions(join(a_path, n_item))

class GetAnAccession(Resource):
    """a class for a particular byte stream in the ldr
    """
    def get(self, arkid):
        """a method to return either an error json result or a file from the ldr accessions

        __Args__
        1. arkid (str): a uuid representing a particular accession in the ldr
        2. premisid (str): a uuid representing a particular object in the ldr
        """
        from flask import current_app
        data = {"accession records":join(arkid, "recordinfo"),
                "legal notes":join(arkid, "legalinfo"),
                "admin notes":join(arkid, "admininfo")}
        return jsonify(APIResponse("success", data=data).dictify())

class GetRecords(Resource):
    """a class for getting all accession records
    """
    def get(self, arkid):
        """a method to get a JSON record of all accessions
        """
        from flask import current_app
        a_directory = construct_directorypath(arkid, "accession_records",
                                              current_app.config["LONGTERMSTORAGE_PATH"])
        accession_records = listdir(a_directory)
        accession_files = [join(arkid, "recordinfo", x) for x in accession_records]
        return jsonify(APIResponse("success", data={"accession records":accession_files}).dictify())

class GetLegalInfo(Resource):
    """a class for getting all legalnote files for a particular accession
    """
    def get(self, arkid):
        """a method for returning the file
        """
        from flask import current_app
        a_directory = construct_directorypath(arkid, "legalnotes",
                                              current_app.config["LONGTERMSTORAGE_PATH"])
        legalnotes = listdir(a_directory)
        legalnote_files = [join(arkid, "legalinfo", x) for x in legalnotes]
        return jsonify(APIResponse("success", data={"legal notes":legalnote_files}).dictify())

class GetAdminInfo(Resource):
    """a class for getting all adminnote files for a particular accession
    """
    def get(self, arkid):
        """a method for returning the file
        """
        from flask import current_app
        a_directory = construct_directorypath(arkid, "adminnotes",
                                              current_app.config["LONGTERMSTORAGE_PATH"])
        adminnotes = listdir(a_directory)
        adminnote_files = [join(arkid, "admininfo", x) for x in adminnotes]
        return jsonify(APIResponse("success", data={"admin notes":adminnote_files}).dictify())

class GetASpecificRecord(Resource):
    """a class for getting a specific accession record file for a particular accession
    """
    def get(self, arkid, filename):
        """a method for returning the file
        """
        an_object = GetAFile(arkid, "accession_records", filename)
        return an_object.get_file()

class GetASpecificLegalNote(Resource):
    """a class for getting a specific legalnote file for a particular accession
    """
    def get(self, arkid, filename):
        """a method for returning the file
        """
        an_object = GetAFile(arkid, "legalnotes", filename)
        return an_object.get_file()

class GetASpecificAdminNote(Resource):
    """a class for getting a specific adminnote record file for a particular accession
    """
    def get(self, arkid, filename):
        """a method for returning the file
        """
        an_object = GetAFile(arkid, "adminnotes", filename)
        return an_object.get_file()
