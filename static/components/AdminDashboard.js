export default {
    template: `
    <div>
    <div v-if="error"> {{error}}</div>
    <h1 class="text-center">Librarian Dashboard</h1>
    <br>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Section Name</th>
          <th scope="col">Description</th>
          <th scope="col">Date Created</th>
          <th scope="col">Add Books to Section</th>
          <th scope="col">Update Section</th>
          <th scope="col">Delete Section</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="section in allsec">
          <td><router-link :to="'/sectionbooks/' + section.id" style="text-decoration: none; color: inherit;" >{{ section.name }}</router-link></td>
          <td>{{ section.desc }}</td>
          <td>{{ formatDate(section.date_created) }}</td>
          <td><router-link :to="'/addbook/' + section.id" class="btn btn-outline-primary btn-sm">Add Books</router-link></td>
          <td><router-link :to="'/updatesec/' + section.id" class="btn btn-outline-primary btn-sm">Update Section</router-link></td>
          <td><button class="btn btn-outline-primary btn-sm" @click="delsec(section.name)"> Delete </button></td>        
        </tr>
      </tbody>
    </table>
  </div>`,
    data() {
        return {
            allsec: [],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods: {
        async delsec(secname) {
            const res = await fetch(`/deletesec/${secname}`, {

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
        const res = await fetch('/admindb', {
            headers: {
                'Authentication-Token': this.token,
            },
        })
        const data = await res.json().catch((e) => { })
        if (res.ok) {
            console.log(data)
            this.allsec = data
        } else {
            this.error = res.status
        }
    },
}

