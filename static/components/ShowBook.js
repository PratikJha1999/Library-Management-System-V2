export default {
    template: `
    <div>
    <div v-if="error"> {{error}}</div>
    <h1 class="text-center">Book Database</h1>
    <br>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Book Name</th>
          <th scope="col">Author</th>
          <th scope="col">Section</th>
          <th scope="col">Date Created</th>
          <th scope="col">Content</th>
          <th scope="col">Update Book</th>
          <th scope="col">Delete Book</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(book, index) in allbook" :key="book.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{book.name}}</td>
          <td>{{book.author}}</td>
          <td>{{book.section_name}}</td>
          <td>{{ formatDate(book.date_added) }}</td>
          <td>{{book.content}}</td>
          <td><router-link :to="'/updatebook/' + book.id" class="btn btn-outline-primary btn-sm">Update Book</router-link></td>
          <td><button class="btn btn-outline-primary btn-sm" @click="delbook(book.id)"> Delete Book </button></td>        
        </tr>
      </tbody>
    </table>
  </div>`,
    data() {
        return {
            allbook: [],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods: {
        async delbook(bid) {
            const res = await fetch(`/delbook/${bid}`, {

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

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
    },

    async mounted() {
        const res = await fetch('/showbook', {
            headers: {
                'Authentication-Token': this.token,
            },
        })
        const data = await res.json().catch((e) => { })
        if (res.ok) {
            console.log(data)
            this.allbook = data
        } else {
            this.error = res.status
        }
    },
}

