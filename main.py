from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from flask_caching import Cache
from Library.models import db, User, Role
from config import DevelopmentConfig
from Library.resources import api
from Library.sec import datastore
from Library.worker import celery_init_app
from Library.tasks import daily_reminder
from celery.schedules import crontab
from Library.instances import cache


def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    app.security = Security(app, datastore)
    cache.init_app(app)
    with app.app_context():
        import Library.views

    return app


app = create_app()
celery_app = celery_init_app(app)


@celery_app.on_after_configure.connect
def send_email(sender, **kwargs):
    sender.add_periodic_task(
        crontab(hour=18, minute=30, day_of_month=15),
        daily_reminder.s('pratikjha@email.com', 'Daily Test'),
    )

if __name__ == '__main__':
    app.run(debug=True)
