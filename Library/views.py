from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, current_user
from werkzeug.security import check_password_hash,generate_password_hash
from flask_restful import marshal, fields
import flask_excel as excel
from celery.result import AsyncResult
from sqlalchemy import func, desc, or_
from .models import User, db, Section, Books, BookRequest 
from .sec import datastore
from datetime import datetime
from .instances import cache


@app.route('/')
def home():
    return render_template("index.html")


@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Hello Admin"


@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "id": user.id})
    else:
        return jsonify({"message": "Wrong Password"}), 400

@app.route('/user-signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role_name = data.get('role')

    if not username or not email or not password:
        return jsonify({"message": "Username, email, and password are required"}), 400

    if datastore.find_user(email=email):
        return jsonify({"message": "Email address already exists"}), 400

    datastore.create_user(
        username=username,
        email=email,
        password=generate_password_hash(password),
        roles=[role_name],
        active=True
    )
    db.session.commit()
    return jsonify({"message": "User signed up successfully"})




user_fields = {
    "id": fields.Integer,
    "username": fields.String,
    "email": fields.String,
    "active": fields.Boolean
}

book_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "author": fields.String,
    "section_name": fields.String,
    "content": fields.String,
    "date_added": fields.DateTime
}


sec_fields = {
    "name": fields.String,
    "desc": fields.String,
    "date_created": fields.DateTime,
}


@app.route('/search')
@auth_required("token")
def search_books():
    search_query = request.args.get('query')
    if not search_query:
        return jsonify(error='No search query provided'), 400

    search_results = Books.query.filter(
        or_(
            Books.name.ilike(f'%{search_query}%'),
            Books.author.ilike(f'%{search_query}%'),
            Books.section_name.ilike(f'%{search_query}%')
        )
    ).all()

    return marshal(search_results, book_fields)
