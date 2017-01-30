
from configparser import ConfigParser
from flask import Flask

from blueprints.accessions import ACCESSIONS
from blueprints.dashboard import DASHBOARD
from blueprints.inventory import INVENTORY
from blueprints.restrictions import RESTRICTION_CHANGE
from blueprints.stages import STAGES

APP = Flask(__name__)
CONFIGDATA = ConfigParser()
CONFIGDATA = CONFIGDATA.read("./config/config.ini")

for n_item in CONFIGDATA:
    APP.config[n_item.uppercase()] = CONFIGDATA[n_item]

APP.register_blueprint(DASHBOARD)
APP.register_blueprint(STAGES)
APP.register_blueprint(INVENTORY)
APP.register_blueprint(RESTRICTION_CHANGE)
APP.register_blueprint(ACCESSIONS)

APP.run()
