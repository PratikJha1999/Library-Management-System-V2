from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
db = SQLAlchemy()
from datetime import datetime, timedelta

class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    bookrequest = db.relationship('BookRequest', back_populates='user', cascade='all, delete-orphan')
    
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Section(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique = True)
    date_created = db.Column(db.DateTime, default = datetime.utcnow)
    desc = db.Column(db.String(1000))
    books = db.relationship('Books', back_populates='section', cascade='all, delete-orphan')
    

class Books(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150))
    content = db.Column(db.String(500))
    author = db.Column(db.String(1000))
    date_added = db.Column(db.DateTime, default = datetime.utcnow)
    section_name = db.Column(db.String(150), db.ForeignKey('section.name'))
    section = db.relationship('Section', back_populates='books')
    bookrequest = db.relationship('BookRequest', back_populates='books', cascade='all, delete-orphan')
    
    
class BookRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_id = db.Column(db.Integer(), db.ForeignKey('books.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    date_requested = db.Column(db.DateTime, default = datetime.utcnow)
    date_issued = db.Column(db.DateTime)
    date_return = db.Column(db.DateTime)
    requested = db.Column(db.Boolean(), default = False)
    approved = db.Column(db.Boolean(), default = False)
    Ndays = db.Column(db.Integer)
    
    books = db.relationship('Books', back_populates='bookrequest',foreign_keys=[book_id])
    user = db.relationship('User', back_populates='bookrequest',foreign_keys=[user_id])
    
    def approve(self):
        self.approved = True
        self.requested = False
        self.date_issued = datetime.now()
        self.date_return = self.date_issued + timedelta(days = self.Ndays)
    
    
    