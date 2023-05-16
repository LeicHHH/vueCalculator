<template>
  <div>
    <h1>Calculator</h1>
    <sign-out></sign-out>
    <div v-if="currentOperation !== 'square_root' && currentOperation !== 'random_string'">
      <input type="number" v-model="number1" placeholder="First number" required />
      <input type="number" v-model="number2" placeholder="Second number" required />
    </div>
    <input v-if="currentOperation === 'square_root'" type="number" v-model="number1" placeholder="Number" required />
    <input v-if="currentOperation === 'random_string'" type="number" v-model="number1" placeholder="Length of random string" required />
    <button @click="calculate('addition', [number1, number2])">Add</button>
    <button @click="calculate('subtraction', [number1, number2])">Subtract</button>
    <button @click="calculate('multiplication', [number1, number2])">Multiply</button>
    <button @click="calculate('division', [number1, number2])">Divide</button>
    <button @click="calculate('square_root', [number1])">Square Root</button>
    <button @click="calculate('random_string', [number1])">Random String</button>
    <div v-if="operationResult !== null">
      <h3>Operation Result: {{ operationResult }}</h3>
    </div>

    <div>
      <h2>Operation Records</h2>
      <input v-model="searchText" placeholder="Search...">
      <table>
  <thead>
    <tr>
      <th>ID</th>
      <th>Operation ID</th>
      <th>Amount</th>
      <th>User Balance</th>
      <th>Operation Response</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="record in paginatedRecords" :key="record.id">
      <td>{{ record.id }}</td>
      <td>{{ record.operation_id }}</td>
      <td>{{ record.amount }}</td>
      <td>{{ record.user_balance }}</td>
      <td>{{ record.operation_response }}</td>
      <td>
        <button @click="deleteRecord(record.id)">Delete</button>
      </td>
    </tr>
  </tbody>
</table>

      <div>
        <button @click="previousPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios.js';
import 'vue-good-table/dist/vue-good-table.css';
import SignOut from '@/components/SignOut.vue';

export default {
  name: 'UserCalculator',
  components: {
    SignOut,
  },
  data() {
    return {
      number1: null,
      number2: null,
      currentOperation: '',
      records: [],
      searchText: '',
      currentPage: 1,
      perPage: 10,
      sortOptions: {
        enabled: true,
        initialSortBy: {
          field: 'id',
          type: 'asc',
        },
      },
      columns: [
        { label: 'ID', field: 'id' },
        { label: 'Operation ID', field: 'operation_id' },
        { label: 'Amount', field: 'amount' },
        { label: 'User Balance', field: 'user_balance' },
        { label: 'Operation Response', field: 'operation_response' },
      ],
      operationResult: null,
    };
  },
  mounted() {
    this.fetchRecords();
  },
  computed: {
    filteredRecords() {
      return this.records.filter(record => {
        return record.operation_response.toLowerCase().includes(this.searchText.toLowerCase());
      });
    },
    totalPages() {
      return Math.ceil(this.filteredRecords.length / this.perPage);
    },
    paginatedRecords() {
      const startIndex = (this.currentPage - 1) * this.perPage;
      const endIndex = startIndex + this.perPage;
      return this.filteredRecords.slice(startIndex, endIndex).map(record => {
        return { ...record, actions: null };
      });
    },
  },
  methods: {
    calculate(operationType, amounts) {
      this.currentOperation = operationType;

      const operationIdMap = {
        'addition': 1,
        'subtraction': 2,
        'multiplication': 3,
        'division': 4,
        'square_root': 5,
        'random_string': 6,
      };

      const operationId = operationIdMap[operationType];

      if (amounts.some(amount => isNaN(amount))) {
        console.error('Invalid input');
        return;
      }

      axios
        .post('/operation', {
          operation_id: operationId,
          amount: amounts,
        })
        .then(response => {
          console.log(response.data.response);
          this.operationResult = response.data.response;
          this.fetchRecords(); // Fetch updated records
        })
        .catch(error => {
          console.error(error);
          // Handle any errors here
        });
    },
    fetchRecords() {
      axios
        .get('/record')
        .then(response => {
          this.records = Object.values(response.data)
        })
        .catch(error => {
          console.error(error);
        });
    },
    deleteRecord(id) {
    if (confirm('Are you sure you want to delete this record?')) {
      axios
        .delete(`/record/${id}`)
        .then(() => {
          this.fetchRecords(); // Fetch updated records
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
};
</script>