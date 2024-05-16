from flask_restful import Resource, Api, reqparse, fields, marshal, request
from flask_security import auth_required, roles_required, current_user
from flask import jsonify
from sqlalchemy import or_
from .models import db, User, Role, Section, Books, BookRequest
from werkzeug.security import check_password_hash,generate_password_hash
from .instances import cache
from sqlalchemy import func, desc, or_

api = Api()


add_section_parser = reqparse.RequestParser()
add_section_parser.add_argument('name', type=str, required=True, help='Name is required')
add_section_parser.add_argument('desc', type=str, required=True, help='Description is required')

update_section_parser = reqparse.RequestParser()
update_section_parser.add_argument('name', type=str, required=True, default='', help='Name is required')
update_section_parser.add_argument('desc', type=str, required=True, default='', help='Description is required')

add_book_parser = reqparse.RequestParser()
add_book_parser.add_argument('name', type=str, required=True, help='Name is required')
add_book_parser.add_argument('author', type=str, required=True, help='Author is required')
add_book_parser.add_argument('content', type=str, required=True, help='Content is required')

update_book_parser = reqparse.RequestParser()
update_book_parser.add_argument('name', type=str, required=True, default='', help='Name is required')
update_book_parser.add_argument('author', type=str, required=True, default='', help='Author is required')
update_book_parser.add_argument('content', type=str, required=True, default='', help='Content is required')
update_book_parser.add_argument('section_name', type=str, required=True, default='', help='Section is required')


req_book_parser = reqparse.RequestParser()
req_book_parser.add_argument('userId', type=int, required=True, help='User ID is required')
req_book_parser.add_argument('days', type=int, required=True, help='Number of days is required')


sec_fields = {
    "id": fields.Integer,
    'name': fields.String,
    'desc': fields.String,
    'date_created': fields.DateTime
}

book_fields = {
    "id": fields.Integer,
    "name": fields.String,
    "author": fields.String,
    "section_name": fields.String,
    "content": fields.String,
    "date_added": fields.DateTime
}

user_fields = {
    "id": fields.Integer,
    "username": fields.String,
    "email": fields.String,
    "active": fields.Boolean
}
req_fields = {
    "id": fields.Integer,
    "book_id": fields.Integer,
    "user_id": fields.Integer,
    "date_requested": fields.DateTime,
    "date_issued": fields.DateTime,
    "date_return": fields.DateTime,
    "approved": fields.Boolean,
    "requested": fields.Boolean,
    "Ndays": fields.Integer,
    "book_name": fields.String,
    "book_author": fields.String,
    "user_username": fields.String,
    "section_name": fields.String
}


class AddSection(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        data = add_section_parser.parse_args()
        name = data['name']
        desc = data['desc']

        if not name or not desc:
            return {"message": "Name and Description are required"}, 400

        if Section.query.filter_by(name=name).first():
            return {"message": "Section name already exists"}, 400

        new_sec = Section(name=name, desc=desc)
        db.session.add(new_sec)
        db.session.commit()

        return {"message": "Section Added Successfully"}

class AllSections(Resource):
    @auth_required("token")
    @roles_required("admin")
    @cache.cached(timeout=5)
    def get(self):
        sec = Section.query.all()
        return marshal(sec, sec_fields)

class DeleteSection(Resource):
    @auth_required("token")
    @roles_required("admin")
    def delete(self, sec_name):
        sec = Section.query.filter_by(name=sec_name).first()
        if sec is None:
            return {"message": "Section not found"}, 404

        db.session.delete(sec)
        db.session.commit()

        return {"message": "Section Deleted"}

class AddBook(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self, SectionId):
        data = add_book_parser.parse_args()
        name = data['name']
        author = data['author']
        content = data['content'] 
        section = Section.query.filter_by(id=SectionId).first()
        section_name = section.name

        if not name or not author or not content:
            return {"message": "Name, Author and Content are required"}, 400
    
        book = Books.query.filter_by(name = name).first()
        if book:
            return {"message": "Book already added"}, 409
        
        else:
            new_book = Books(name = name, author = author, content = content, section_name = section_name )
            db.session.add(new_book)
            db.session.commit()
        
        return jsonify({"message": "Book added successfully"})

class AllBooks(Resource):
    @auth_required("token")
    @roles_required("admin")
    @cache.cached(timeout=5)
    def get(self):
        all_book = Books.query.all()
        return marshal(all_book, book_fields)

class SectionBooks(Resource):
    @auth_required("token")
    @roles_required("admin")
    @cache.cached(timeout=5)
    def get(self, SectionId):
        section = Section.query.filter_by(id=SectionId).first()
        section_name = section.name
        section_books = Books.query.filter_by(section_name = section_name).all()
        return marshal(section_books, book_fields)

class DeleteBook(Resource):
    @auth_required("token")
    @roles_required("admin")
    def delete(self, bid):
        book = Books.query.filter_by(id=bid).first()
        if book is None:
            return {"message": "Book not found"}, 404

        db.session.delete(book)
        db.session.commit()

        return {"message": "Book Deleted"}

class AllUsers(Resource):
    @auth_required("token")
    @roles_required("admin")
    @cache.cached(timeout=5)
    def get(self):
        reader_role_id = 2  
        all_users = User.query.filter(User.roles.any(id=reader_role_id)).all()
        if len(all_users) == 0:
            return {"message": "No User Found"}, 404
        return marshal(all_users, user_fields)

class DeleteUser(Resource):
    @auth_required("token")
    @roles_required("admin")
    def delete(self, usId):
        user = User.query.filter_by(id=usId).first()
        if user is None:
            return {"message": "User not found"}, 404

        db.session.delete(user)
        db.session.commit()

        return {"message": "User Deleted"}, 200
    

class ShowBooks(Resource):
    @auth_required("token")
    @roles_required("reader")
    @cache.cached(timeout=5)
    def get(self):
        reader_book = Books.query.order_by(desc(Books.date_added)).all()
        return marshal(reader_book, book_fields)
    
class RequestBook(Resource):
    @auth_required("token")
    @roles_required("reader")
    def post(self, book_id):
        data = req_book_parser.parse_args()
        user_id = data['userId']
        days = data['days']
        book = Books.query.get(book_id)
        existing_request = BookRequest.query.filter_by(book_id=book_id, user_id=user_id, requested=True).first()
        total_request = BookRequest.query.filter_by(user_id=user_id, requested=True).count()
        other_request = BookRequest.query.filter_by(book_id=book_id, requested=True).first()

        if existing_request:
            return {'message': 'Book already requested'}, 405
        elif total_request >= 5:
            return {'message': 'User cannot request more than 5 books at once'}, 406
        elif days > 7:
            return {'message': 'User cannot issue books for more than 7 days'}, 407
        elif other_request:
            return {'message': 'Book already requested by another user'}, 408
        elif book:
            new_req = BookRequest(book_id=book_id, user_id=user_id, requested=True, Ndays=days)
            db.session.add(new_req)
            db.session.commit()
            return {'message': 'Book Requested'}, 201
        else:
            return {'message': 'Book not found'}, 404
        

class AllRequests(Resource):
    @auth_required("token")
    @roles_required("admin")
    @cache.cached(timeout=5)
    def get(self):
        req_books = BookRequest.query.filter_by(requested=True, approved = False).all()
        serialized_req_books = []
        for req in req_books:
            serialized_req = {
                "id": req.id,
                "book_id": req.book_id,
                "user_id": req.user_id,
                "date_requested": req.date_requested,
                "date_issued": req.date_issued,
                "date_return": req.date_return,
                "approved": req.approved,
                "requested": req.requested,
                "Ndays": req.Ndays,
                "book_name": req.books.name,
                "book_author": req.books.author,
                "user_username": req.user.username,
                "section_name": req.books.section_name
            }
            serialized_req_books.append(serialized_req)
        return marshal(serialized_req_books, req_fields)

class ApproveRequest(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self, req_id):
        book_request = BookRequest.query.get(req_id)
        if book_request is None:
            return {"message": "Reqeust not found"}, 404
        else:            
            book_request.approve()       
            db.session.commit()
            return {"message": "Book Request Approved"}, 201

class DenyRequest(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self, req_id):
        book_request = BookRequest.query.get(req_id)
        if book_request is None:
            return {"message": "Reqeust not found"}, 404
        else:            
            db.session.delete(book_request)   
            db.session.commit()
            return {"message": "Book Request Denied"}, 201

class AllIssued(Resource):
    @auth_required("token")
    @roles_required("admin")
    @cache.cached(timeout=5)
    def get(self):
        issued_books = BookRequest.query.filter_by(approved = True).all()
        serialized_issued_books = []
        for iss in issued_books:
            serialized_issued = {
                "id": iss.id,
                "book_id": iss.book_id,
                "user_id": iss.user_id,
                "date_requested": iss.date_requested,
                "date_issued": iss.date_issued,
                "date_return": iss.date_return,
                "approved": iss.approved,
                "requested": iss.requested,
                "Ndays": iss.Ndays,
                "book_name": iss.books.name,
                "book_author": iss.books.author,
                "user_username": iss.user.username,
                "section_name": iss.books.section_name
            }
            serialized_issued_books.append(serialized_issued)
        return marshal(serialized_issued_books, req_fields)

class AccessRevoked(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self, issued_id):
        book_issued = BookRequest.query.get(issued_id)
        if book_issued is None:
            return {"message": "Issued Book not found"}, 404
        else:            
            db.session.delete(book_issued)   
            db.session.commit()
            return {"message": "Book Access Revoked"}, 201


class UserIssued(Resource):
    @auth_required("token")
    @roles_required("reader")
    @cache.cached(timeout=5)
    def get(self, userId):
        user_books = BookRequest.query.filter_by(approved = True, user_id = userId).all()
        serialized_user_books = []
        for iss in user_books:
            serialized_userb = {
                "id": iss.id,
                "book_id": iss.book_id,
                "user_id": iss.user_id,
                "date_requested": iss.date_requested,
                "date_issued": iss.date_issued,
                "date_return": iss.date_return,
                "approved": iss.approved,
                "requested": iss.requested,
                "Ndays": iss.Ndays,
                "book_name": iss.books.name,
                "book_author": iss.books.author,
                "user_username": iss.user.username,
                "section_name": iss.books.section_name
            }
            serialized_user_books.append(serialized_userb)
        return marshal(serialized_user_books, req_fields)


class ReturnBook(Resource):
    @auth_required("token")
    @roles_required("reader")
    def post(self, issued_id):
        book_issued = BookRequest.query.get(issued_id)
        if book_issued is None:
            return {"message": "Issued Book not found"}, 404
        else:            
            db.session.delete(book_issued)   
            db.session.commit()
            return {"message": "Book Returned"}, 201

class UpdateSection(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self, SectionId):
        data = update_section_parser.parse_args()
        name = data['name']
        desc = data['desc']

        if not name or not desc:
            return {"message": "Name and Description are required"}, 400
        
        old_sec = Section.query.filter_by(id=SectionId).first()
        
        if name == "":
            name = old_sec.name
        
        if desc == "":
            desc = old_sec.desc
        
        old_sec.name = name
        old_sec.desc = desc
        db.session.commit()

        return {"message": "Section Updated Successfully"}

class UpdateBook(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self, BookId):
        data = update_book_parser.parse_args()
        name = data['name']
        author = data['author']
        content = data['content'] 
        section_name = data['section_name']
        
        old_book = Books.query.filter_by(id=BookId).first()
        
        if name == "":
            name = old_book.name
        
        if author == "":
            author = old_book.author
        
        if content == "":
            content = old_book.content
        
        if section_name == "":
            section_name = old_book.section_name
        
        old_book.name = name
        old_book.author = author
        old_book.content = content
        old_book.section_name = section_name
        db.session.commit()

        return {"message": "Book Updated Successfully"}


        
api.add_resource(AddSection, '/add-sec')
api.add_resource(AllSections, '/admindb')
api.add_resource(DeleteSection, '/deletesec/<string:sec_name>')
api.add_resource(AddBook, '/add-book/<int:SectionId>')
api.add_resource(AllBooks, '/showbook')
api.add_resource(SectionBooks, '/sectionbooks/<int:SectionId>')
api.add_resource(DeleteBook, '/delbook/<int:bid>')
api.add_resource(AllUsers, '/users')
api.add_resource(DeleteUser, '/del_user/<int:usId>')
api.add_resource(ShowBooks, '/readerdb')
api.add_resource(RequestBook, '/reqbook/<int:book_id>')
api.add_resource(AllRequests, '/bookrequests')
api.add_resource(ApproveRequest, '/approve/<int:req_id>')
api.add_resource(DenyRequest, '/deny/<int:req_id>')
api.add_resource(AllIssued, '/bookissued')
api.add_resource(AccessRevoked, '/revoke/<int:issued_id>')
api.add_resource(UserIssued, '/userissued/<int:userId>')
api.add_resource(ReturnBook, '/return/<int:issued_id>')
api.add_resource(UpdateSection, '/update-sec/<int:SectionId>')
api.add_resource(UpdateBook, '/update-book/<int:BookId>')
