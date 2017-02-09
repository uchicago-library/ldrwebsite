
from configparser import ConfigParser
from os.path import abspath, relpath
from flask import Flask, redirect, session
from flask_sso import SSO

from .blueprints.inventory import INVENTORY
from .blueprints.restrictions import RESTRICTION_CHANGE
from .blueprints.dashboard import DASHBOARD
from .blueprints.acquisitions import ACQUISITIONS
from .resolvers.restricted_resolver import RESTRICTED_RESOLVER
#from .blueprints.unrestricted_resolver import UNRESTRICTED_RESOLVER

from .apis.accessions import ACCESSIONS
from .apis.stages import STAGES

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
EXT = SSO(APP)

CONFIG_STRING = retrieve_resource_string("config/config.ini").decode("utf-8")
CONFIG = ConfigParser()
CONFIG.read_string(CONFIG_STRING)

SSO_ATTRIBUTE_MAP = {
    'ADFS_AUTHLEVEL': (False, 'authlevel'),
    'ADFS_GROUP': (True, 'group'),
    'ADFS_LOGIN': (True, 'nickname'),
    'ADFS_ROLE': (False, 'role'),
    'ADFS_EMAIL': (True, 'email'),
    'ADFS_IDENTITYCLASS': (False, 'external'),
    'HTTP_SHIB_AUTHENTICATION_METHOD': (False, 'authmethod'),
}

APP.config['SSO_ATTRIBUTE_MAP'] = SSO_ATTRIBUTE_MAP

@EXT.login_handler
def login_callback(user_info):
    """Store information in session."""
    session['user'] = user_info

for n_item in CONFIG["CONFIG"]:
    APP.config[n_item.upper()] = CONFIG["CONFIG"][n_item]

APP.register_blueprint(INVENTORY)
APP.register_blueprint(STAGES)
APP.register_blueprint(RESTRICTION_CHANGE)
APP.register_blueprint(ACCESSIONS)
APP.register_blueprint(DASHBOARD)
APP.register_blueprint(ACQUISITIONS)
#APP.register_blueprint(UNRESTRICTED_RESOLVER)
APP.register_blueprint(RESTRICTED_RESOLVER)
APP.run()
