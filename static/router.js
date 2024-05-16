import Home from './components/Home.js'
import Login from './components/Login.js'
import Users from './components/Users.js'
import Signup from './components/Signup.js'
import AdminDashboard from './components/AdminDashboard.js'
import AddSection from './components/AddSec.js'
import ShowSection from './components/ShowSec.js'
import AddBook from './components/AddBook.js'
import ShowBooks from './components/ShowBook.js'
import ReaderDashboard from './components/ReaderDashboard.js'
import SearchResults from './components/SearchResults.js'
import IssuedBooks from './components/IssuedBooks.js'  
import BookRequests from './components/ShowReq.js'
import UserBooks from './components/UserBooks.js'
import UpdateSec from './components/UpdateSec.js'
import UpdateBook from './components/UpdateBook.js'
import SectionBooks from './components/SectionBooks.js'


const routes = [
  { path: '/', component: Home, name: 'Home' },
  { path: '/login', component: Login, name: 'Login' },
  { path: '/users', component: Users },
  { path: '/signup', component: Signup, name: 'Signup' },
  { path: '/admindb', component: AdminDashboard, name: 'AdminDashboard' },
  { path: '/addsection', component: AddSection, name: 'AddSection' },
  { path: '/admindb/:secname', component: ShowSection, name: 'ShowSection', props: true },  
  { path: '/addbook/:id', component: AddBook, name: 'AddBook' },
  { path: '/showbook', component: ShowBooks, name: 'ShowBook' },
  { path: '/readerdb', component: ReaderDashboard, name: 'Readerdb' },
  { path: '/search-results', component: SearchResults, name: 'SResults' },
  { path: '/issuedbooks', component: IssuedBooks, name: 'IssuedBooks' },
  { path: '/bookrequests', component: BookRequests, name: 'BookRequests' },
  { path: '/userbooks', component: UserBooks, name: 'UserBooks' },
  { path: '/updatesec/:id', component: UpdateSec, name: 'UpdateSec' },
  { path: '/sectionbooks/:id', component: SectionBooks, name: 'SectionBooks' },     
  { path: '/updatebook/:id', component: UpdateBook, name: 'UpdateBook' }    
]

export default new VueRouter({
  routes,
  mode: 'history',
})
