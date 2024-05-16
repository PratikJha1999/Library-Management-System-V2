export default {
    template: `
    <div>
    <div v-if="error"> {{error}}</div>
    <h1 style="text-align: center;">Requested Books</h1>
    <br>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Book Name</th>
          <th scope="col">Author</th>
          <th scope="col">Section</th>
          <th scope="col">Requested By</th>
          <th scope="col">Date Requested</th>
          <th scope="col">No. of days requested for</th>
          <th scope="col">Approve/Reject</th>
        </tr>
      </thead>
      <tbody v-if="allreq.length > 0">
        <tr v-for="(request, index) in allreq" :key="request.id">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ request.book_name }}</td>
          <td>{{ request.book_author }}</td>
          <td>{{ request.section_name }}</td>
          <td>{{ request.user_username }}</td>
          <td>{{ formatDate(request.date_requested) }}</td>
          <td>{{ request.Ndays }}</td>
          <td>
            <a @click="approveRequest(request.id)" class="btn btn-outline-secondary btn-sm">Approve</a>
            <a @click="denyRequest(request.id)" class="btn btn-outline-secondary btn-sm">Deny</a>
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
            allreq: [],
            token: localStorage.getItem('auth-token'),
            error: null,
        }
    },
    methods: {
      async approveRequest(req_id) {
        const res = await fetch(`/approve/${req_id}`, {

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

    async denyRequest(req_id) {
        const res = await fetch(`/deny/${req_id}`, {

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
            const res = await fetch('/bookrequests', {
                headers: {
                    'Authentication-Token': this.token,
                },
            });
            
            const data = await res.json();
            console.log('Response data:', data);
    
            if (res.ok) {
                this.allreq = data
                console.log('ALLREQ:',this.allreq);
            } else {
                this.error = `Error: ${res.status}`;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            this.error = 'An error occurred while fetching data.';
        }
    },
}

