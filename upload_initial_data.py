from main import app
from Library.sec import datastore
from Library.models import db, Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    datastore.find_or_create_role(name="admin", description="User is an admin/Librarian")
    datastore.find_or_create_role(name="reader", description="User is a Reader")
    db.session.commit()
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(
            email="admin@email.com", password=generate_password_hash("admin"), roles=["admin"])
    if not datastore.find_user(email="reader1@email.com"):
        datastore.create_user(
            email="reader@email.com", username = "First Reader" ,password=generate_password_hash("stud1"), roles=["reader"])
    db.session.commit()
