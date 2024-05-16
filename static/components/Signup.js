export default {
    template: `
    <div class='d-flex justify-content-center' style="margin-top: 20vh">
    <div class="mb-3 p-5 bg-light">
        <div class='text-danger'>*{{error}}</div>
        <label for="username" class="form-label">Username</label>
        <input type="text" class="form-control" id="username" placeholder="Username" v-model="user.username">
        <label for="email" class="form-label">Email address</label>
        <input type="email" class="form-control" id="email" placeholder="name@example.com" v-model="user.email">
        <label for="password" class="form-label">Password</label>
        <input type="password" class="form-control" id="password" placeholder="Password" v-model="user.password">
        <button class="btn btn-primary mt-2" @click='signUp' > Login </button>
    </div>   
    </div>
    `,
    data() {
      return {
        user: {
          username: null,
          email: null,
          password: null,
          role: 'reader' 
        },
        error: null
      };
    },
    methods: {
      async signUp() {
        try {
          const response = await fetch('/user-signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.user)
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to sign up');
          }
          this.$router.push({ path: '/login' });
        } catch (error) {
          this.error = error.message;
        }
      },
    },
  }
  