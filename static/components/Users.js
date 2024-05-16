export default {
  template: `
<div>
  <div v-if="error"> {{error}}</div>
  <h1 class="text-center">Library Users</h1>
  <br>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Username</th>
        <th scope="col">Email ID</th>
        <th scope="col">Delete User</th>
      </tr>
    </thead>
    <tbody>
        <tr v-for="(user, index) in users" :key="user.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{user.username}}</td>
          <td>{{user.email}}</td>
          <td><button class="btn btn-outline-primary btn-sm" @click="deluser(user.id)"> Delete User </button></td> 
        </tr>
    </tbody>
  </table>
</div>`,
  data() {
    return {
      users: [],
      token: localStorage.getItem('auth-token'),
      error: null,
    }
  },
  methods: {
    async deluser(usId) {
      const res = await fetch(`/del_user/${usId}`, {
        method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                },
                body: '{}'
            });
            
            const data = await res.json()
            if (res.ok) {
                alert(data.message)
            }
        },
  },
  async mounted() {
    const res = await fetch('/users', {
      headers: {
        'Authentication-Token': this.token,
      },
    })
    const data = await res.json().catch((e) => {})
    if (res.ok) {
      console.log(data)
      this.users = data
    } else {
      this.error = res.status
    }
  },
}
