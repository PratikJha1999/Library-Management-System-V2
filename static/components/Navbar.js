export default {
  template: `
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Library</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/">Home</router-link>
          </li>
          <li class="nav-item" v-show="role=='admin'">
            <router-link class="nav-link" to="/admindb">Admin-Dashboard</router-link>
          </li>
          <li class="nav-item" v-show="role=='admin'">
            <router-link class="nav-link" to="/showbook">AllBooks</router-link>
          </li>
          <li class="nav-item" v-show="role=='admin'">
            <router-link class="nav-link" to="/addsection">Add Section</router-link>
          </li>
          <li class="nav-item" v-show="role=='admin'">
            <router-link class="nav-link" to="/users">Show Users</router-link>
          </li>
          <li class="nav-item" v-show="role=='admin'">
            <router-link class="nav-link" to="/bookrequests">Book Requests</router-link>
          </li>
          <li class="nav-item" v-show="role=='admin'">
            <router-link class="nav-link" to="/issuedbooks">Books Issued</router-link>
          </li>
          <li class="nav-item" v-show="role=='reader'">
            <router-link class="nav-link" to="/readerdb">Reader-Dashboard</router-link>
          </li>
          <li class="nav-item" v-show="role=='reader'">
            <router-link class="nav-link" to="/userbooks">User Books</router-link>
          </li>
          <li class="nav-item" v-if="is_login">
            <router-link class="nav-link" to="/login" @click.native="logout">Logout</router-link>
          </li>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/signup">Sign Up</router-link>
            </li>
          </template>
          <li v-if="is_login" class="nav-item">
            <form class="form-inline my-2 my-lg-0" @submit.prevent="searchBooks">
            <div class="input-group">
              <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" v-model="searchQuery">
              <div class="input-group-append">
               <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </div>
            </div>
          </form>
         </li>

        </ul>
      </div>
    </div>
  </nav>`,
  data() {
    return {
      role: localStorage.getItem('role'),
      is_login: localStorage.getItem('auth-token'),
      id: localStorage.getItem('user_id'),
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('auth-token')
      localStorage.removeItem('role')
      localStorage.removeItem('user_id')
      this.role = null
      this.is_login = null
      this.$router.push({ path: '/login' })
    },
    searchBooks() {
      if (this.searchQuery.trim()) {
        this.$router.push({ path: '/search-results', query: { q: this.searchQuery } });
      }
    }
  },
}
