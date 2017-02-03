
from configparser import ConfigParser
from flask import Flask
from os.path import abspath, relpath

from .blueprints.inventory import INVENTORY
from .blueprints.restrictions import RESTRICTION_CHANGE
from .blueprints.dashboard import DASHBOARD

# from blueprints.accessions import ACCESSIONS
# from blueprints.stages import STAGES

def retrieve_resource_string(resource_path, pkg_name=None):
    """
    retrieves the string contents of some package resource
    __Args__
    1. resource_path (str): The path to the resource in the package
     __KWArgs__
    * pkg_name (str): The name of a package. Defaults to the project name
    __Returns__
    * (str): the resource contents
    """
    from pkg_resources import Requirement, resource_string
    if pkg_name is None:
        pkg_name = __name__.split(".")[0]
    return resource_string(Requirement.parse(pkg_name), resource_path)

APP = Flask(__name__)
CONFIG_STRING = retrieve_resource_string("config/config.ini").decode("utf-8")
CONFIG = ConfigParser()
CONFIG.read_string(CONFIG_STRING)

for n_item in CONFIG["CONFIG"]:
    APP.config[n_item.upper()] = CONFIG["CONFIG"][n_item]

APP.register_blueprint(INVENTORY)
APP.register_blueprint(RESTRICTION_CHANGE)
APP.register_blueprint(DASHBOARD)
APP.run()
