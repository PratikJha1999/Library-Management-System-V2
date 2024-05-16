import ReaderHome from './ReaderHome.js'
import AdminHome from './AdminHome.js'

export default {
  template: `<div style="text-align: center; font-size: 26px;">
  Welcom to The Library! <br><br>
  <ReaderHome v-if="userRole=='reader'"/>
  <AdminHome v-if="userRole=='admin'" />
  </div>`,

  data() {
    return {
      userRole: localStorage.getItem('role'),
      authToken: localStorage.getItem('auth-token'),
    }
  },

  components: {
    ReaderHome,
    AdminHome,
  },
}
