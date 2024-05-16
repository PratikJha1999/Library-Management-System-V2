
export default {
    template: `
    <div>
    <div v-if="error"> {{error}}</div>
    <h1>All the books in the genre</h1>
    <table class="table">
    <thead>
      <tr>
        <th scope="col">Book Name</th>
        <th scope="col">Author</th>
        <th scope="col">Update Book</th>
        <th scope="col">Delete Book</th>
      </tr>
    </thead>
    <tbody>
        
      <tr v-for="book in allbook">
        <td><router-link :to="'/showbook/' + book.name" style="text-decoration: none; color: inherit;" >{{ book.name }}</router-link></td>
        <td>{{book.author}}</td>
        <td><router-link :to="'/updatebook/' + book.name" class="btn btn-outline-primary btn-sm">Add Books</router-link></td>
        <td><button class="btn btn-outline-primary btn-sm" @click="delbook(book.name)"> Delete Book </button></td>
      </tr>
    </div>`,
    name: "ShowSection",
    inject: ["Books"],
    data() {
        return {
            allbook: [],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    created() {
        const secname = this.$route.params.secname;
        this.section = this.Books.find((book) => book.section_name == secname);
      },
    props: ['secname'],
    async mounted() {
        console.log('Section Name:', this.secname);
        const res = await fetch('/showsec', {
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

