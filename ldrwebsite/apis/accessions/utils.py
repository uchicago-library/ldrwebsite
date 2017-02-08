
from os import listdir
from os.path import isdir, join
from flask import send_file



from pypairtree.utils import identifier_to_path

def construct_directorypath(arkid, admindir, root_path):
    from flask import current_app
    arkid_path = str(identifier_to_path(arkid))
    return join(root_path, arkid_path, "arf/admin", admindir)

def construct_filepath(directory_path, filename):
    return join(directory_path, filename)

