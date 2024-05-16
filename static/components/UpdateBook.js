export default {
    template: `
    <div>
      <h2>Update Book</h2>
      <div class='text-danger'>*{{error}}</div>
      <div class="mb-3">
        <label for="name" class="form-label">Book Name</label>
        <input type="text" class="form-control" id="name" placeholder="Book Name" v-model="book.name">
      </div>
      <div class="mb-3">
        <label for="author" class="form-label">Book Author</label>
        <input type="text" class="form-control" id="author" placeholder="Book Author" v-model="book.author">
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">Book Content</label>
        <input type="text" class="form-control" id="content" placeholder="Book Content" v-model="book.content">
      </div>
      <div class="mb-3">
        <label for="section" class="form-label">Section</label>
        <input type="text" class="form-control" id="section" placeholder="Section Name" v-model="book.section_name">
      </div>
      <button class="btn btn-primary" @click="updatebook">Update Book</button>
    </div>
    `,
    data() {
      return {
        book: {
          name: '',
          author: '',
          content: '',
          section_name: '',
        },
        BookId: this.$route.params.id,
        token: localStorage.getItem('auth-token'),
        error: null,
      }
    },
    methods: {
      async updatebook() {
        console.log('Book Object:', this.book);
        try {
          const response = await fetch(`/update-book/${this.BookId}`, {
            method: 'POST',
            headers: {
              'Authentication-Token': this.token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.book)
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.message || 'Failed to Update Book');
          }
          this.$router.push({ path: '/admindb' });
        } catch (error) {
          this.error = error.message;
        }
      }
    }
  };


  