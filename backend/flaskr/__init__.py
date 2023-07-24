import os
#import requests
import controller.data as controller
from flask import Flask
from flask_cors import CORS


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    
    # enable CORS to allow requests from the frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.path.join(app.instance_path, "flaskr.sqlite"),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass


    app.add_url_rule('/api/country/<ISO3>/<date_start>/<date_end>/metricB', view_func=controller.metric_b_controller)
    app.add_url_rule('/api/country/<ISO3>/<date_start>/<date_end>/metricA', view_func=controller.metric_a_controller)
    #to get the data from the WFP HungerMap API, if needed
    app.add_url_rule('/api/country/<ISO3>/<date_start>/<date_end>', view_func=controller.fetch_country_data)
    

    return app
