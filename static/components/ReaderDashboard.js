export default {
    template: `
    <div>
    <h1 class="text-center">User Dashboard</h1>
    <h2 class="text-center">Book Database</h2>
    <div class='text-danger'>*{{error}}</div>
    <br>
    <div class="input-group">
        <label for="requestDays"> No. of days book requested for:  </label>
        <input id="requestDays" type="number" v-model="requestDays" placeholder="Number of days" required>
    </div>
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
          <th scope="col">Request Book</th>
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
          <td>
            <button class="btn btn-outline-primary btn-sm" @click="reqbook(book.id)">Request Book</button>
          </td>        
        </tr>
      </tbody>
    </table>
  </div>`,
    data() {
        return {
            allbook: [],
            token: localStorage.getItem('auth-token'),
            error: null,
            requestDays: null,
            userId: localStorage.getItem('user_id'),
        }
    },
    methods: {
        async reqbook(book_id) {
            console.log('Starting reqbook method...');
            console.log('Book ID:', book_id);
            const res = await fetch(`/reqbook/${book_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.token,
                },
                body: JSON.stringify({ userId: this.userId, days: this.requestDays }),
            });
            
            const data = await res.json()
            if (res.ok) {
              alert(data.message)
            }
            else {
              alert(data.message)
            }
        },

        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },
    },

    async mounted() {
        console.log('Mounted.');
        const res = await fetch('/readerdb', {
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
    styles: `
    .input-group {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-bottom: 5px;
    }

    .input-group label {
        margin-right: 50px;
    }
    `,
}

