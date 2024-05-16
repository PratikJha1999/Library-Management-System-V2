export default {
  template: `
  <div>
  <div v-if="error"> {{error}}</div>
  <h1 style="text-align: center;">Issued Books</h1>
  <br>
  <table class="table">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Book Name</th>
        <th scope="col">Author</th>
        <th scope="col">Section</th>
        <th scope="col">Issued To</th>
        <th scope="col">Date Issued</th>
        <th scope="col">Return Date</th>
        <th scope="col">No. of days issued for</th>
        <th scope="col">Revoke Access</th>
      </tr>
    </thead>
    <tbody v-if="allissued.length > 0">
      <tr v-for="(issued, index) in allissued" :key="issued.id">
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ issued.book_name }}</td>
        <td>{{ issued.book_author }}</td>
        <td>{{ issued.section_name }}</td>
        <td>{{ issued.user_username }}</td>
        <td>{{ formatDate(issued.date_issued) }}</td>
        <td>{{ formatDate(issued.date_return) }}</td>
        <td>{{ issued.Ndays }}</td>
        <td>
          <a @click="RevokeAccess(issued.id)" class="btn btn-outline-secondary btn-sm">Revoke</a>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr>
        <td colspan="12">No data available</td>
      </tr>
    </tbody>
  </table>
</div>`,
  data() {
      return {
          allissued: [],
          token: localStorage.getItem('auth-token'),
          error: null,
      }
  },
  methods: {
      async RevokeAccess(issued_id) {
        const res = await fetch(`/revoke/${issued_id}`, {

            method: 'POST',
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
      try {
          const res = await fetch('/bookissued', {
              headers: {
                  'Authentication-Token': this.token,
              },
          });
          
          const data = await res.json();
          console.log('Response data:', data);
  
          if (res.ok) {
              this.allissued = data
              console.log('ALLIss:',this.allissued);
          } else {
              this.error = `Error: ${res.status}`;
          }
      } catch (error) {
          console.error('Fetch error:', error);
          this.error = 'An error occurred while fetching data.';
      }
  },
}

