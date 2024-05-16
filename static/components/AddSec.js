export default {
    template: `
    <div>
      <h2>Add New Section</h2>
      <div class='text-danger'>*{{error}}</div>
      <div class="mb-3">
        <label for="name" class="form-label">Section Name</label>
        <input type="text" class="form-control" id="name" placeholder="Section Name" v-model="section.name">
      </div>
      <div class="mb-3">
        <label for="desc" class="form-label">Section Description</label>
        <input type="text" class="form-control" id="desc" placeholder="Section Description" v-model="section.desc">
      </div>
      <button class="btn btn-primary" @click="addsec">Add Section</button>
    </div>
    `,
    data() {
      return {
        section: {
          name: null,
          desc: null,
        },
        token: localStorage.getItem('auth-token'),
        error: null,
      }
    },
    methods: {
      async addsec() {
        console.log('Section Object:', this.section);
        try {
          const response = await fetch('/add-sec', {
            method: 'POST',
            headers: {
              'Authentication-Token': this.token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.section)
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to add section');
          }
          this.$router.push({ path: '/admindb' });
        } catch (error) {
          this.error = error.message;
        }
      }
    }
  };


  