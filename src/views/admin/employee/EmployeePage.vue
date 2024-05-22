<template>
    <div class="employee">
        <div class="employee-body">
            <div class="employee-header">
                <h3>Team Employees</h3>
                <PopupWrapper>
                    <template #header>
                        <span class="popover">Add new +</span>
                    </template>
                    <template #content>
                        <div class="popover-content">
                            <AddEmployee @reloadPage="fetchEmployee()" />
                        </div>
                    </template>
                </PopupWrapper>
            </div>
            <div class="space-line"></div>
            <div class="employee-search">
                <div class="menu-search">
                    <div class="search-filter">
                        <select id="airport" required>
                            <option value="" disabled selected hidden>Select Airport</option>
                            <option value="Da Nang">Da Nang</option>
                            <option value="Tan Son Nhat">Tan Son Nhat</option>
                            <option value="Noi Bai">Noi Bai</option>
                            <option value="Phu Quoc">Phu Quoc</option>
                            <option value="Cam Ranh">Cam Ranh</option>
                        </select>
                    </div>
                    <div class="search-filter">
                        <select required>
                            <option value="" disabled selected hidden>Sort</option>
                            <option value="Desc">Desc</option>
                            <option value="Asc">Asc</option>
                        </select>
                    </div>
                    <div class="search-filter">
                        <i class="pi pi-filter" style="font-size: 1rem"></i>
                        <span>Filter</span>
                    </div>
                </div>
                <button class="btn-search-primary">
                    <i class="pi pi-search" style="font-size: 1rem"></i>
                </button>
            </div>

        </div>
        <div class="employee-container">
            <div class="list-employee">
                <table>
                    <thead>
                        <tr class="data-table-tilte">
                            <th><bars-2-icon class="employee-icon" /></th>
                            <th>Name</th>
                            <th>Airport</th>
                            <th>Created_at</th>
                            <th>Updated_at</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody class="employee-info">
                        <tr v-for="item in items" :key="item.id" class="employee-information">
                            <td><input type="checkbox"></td>
                            <td>
                                <div class="item" data-id="{{item.id}}">{{ item.name }}</div>
                            </td>
                            <td>
                                <div class="item" data-id="{{item.id}}">{{ item.airport }}</div>
                            </td>
                            <td>
                                <div class="item" data-id="{{item.id}}">
                                    {{ formatDate(item.created_at) }}
                                </div>
                            </td>
                            <td>
                                <div class="item" data-id="{{item.id}}">
                                    {{ formatDate(item.updated_at) }}
                                </div>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <PopupWrapper>
                                        <template #header>
                                            <div class="popover">
                                                <pencil-square-icon class="employee-icon"
                                                    @click="openEditEmployee(item.id)" />
                                            </div>
                                        </template>
                                        <template #content>
                                            <div class="popover-content">
                                                <EditEmployee :employeeId="selectedEmployeeId"
                                                    @reloadPage="fetchEmployee()" />
                                            </div>
                                        </template>
                                    </PopupWrapper>
                                    <button @click="deleteItem(item.id)" class="btn-delete-primary">
                                        <trash-icon class="employee-icon" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <Pagination :currentPage="currentPage" :totalPages="totalPages" @nextPage="nextPage"
                    @prevPage="prevPage" @goToPage="goToPage" />
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { TrashIcon, PencilSquareIcon, Bars2Icon } from '@heroicons/vue/24/solid';
import PopupWrapper from '@/components/PopupWrapper.vue';
import AddEmployee from '@/views/admin/employee/AddEmployee.vue';
import EditEmployee from '@/views/admin/employee/EditEmployee.vue';
import Pagination from '@/components/PaginationPage.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'employeePage',
    components: {
        PencilSquareIcon, PopupWrapper,
        Bars2Icon, TrashIcon,
        AddEmployee, EditEmployee,
        Pagination
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 4,
            totalItems: 0,
            items: [],
            showModalStatus: false,
            selectedEmployeeId: ''
        };
    },
    setup() {
        const success = () => {
            toast("Delete employee successfully !", {
                autoClose: 1000,
                type: "success"
            });
        }
        return { success };
    },
    mounted() {
        this.fetchEmployee();
    },
    methods: {
        fetchEmployee() {
            const apiUrl = process.env.VUE_APP_API_URL;
            const user_id = parseInt(localStorage.getItem("user_id"));
            let isOperator = false;

            if (localStorage.getItem("roles") === "Operator") {
                isOperator = true;
            }
            axios.get(`${apiUrl}/employee?index=${this.currentPage}&pageSize=${this.pageSize}&user_id=${user_id}&isOperator=${isOperator}`)
                .then(response => {
                    this.items = response.data.employees;
                    this.totalItems = response.data.totalCount;
                    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        deleteItem(item) {
            const apiUrl = process.env.VUE_APP_API_URL;
            if (confirm('Are you sure to delete?')) {
                axios.delete(`${apiUrl}/employee/delete/${item}`)
                    .then(() => {
                        this.success()
                        this.fetchEmployee()
                    })
                    .catch(error => {
                        console.error('There was a problem with the delete operation:', error);
                    });
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const day = ("0" + date.getDate()).slice(-2); // Ensure two-digit day with leading zero
            const month = ("0" + (date.getMonth() + 1)).slice(-2); // Ensure two-digit month with leading zero
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        },

        formatDay(dateTimeString) {
            const date = new Date(dateTimeString);
            const day = date.getDate();
            const month = date.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần +1
            const year = date.getFullYear();

            const formattedDay = `${day}-${month}-${year}`;
            return formattedDay;
        }
        ,
        formatHour(dateTimeString) {
            const date = new Date(dateTimeString);
            const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            return formattedTime;
        },

        openEditEmployee(employeeId) {
            this.selectedEmployeeId = employeeId; // Corrected typo
            console.log("This is the id: " + this.selectedEmployeeId);
        },

        nextPage() {
            if (this.currentPage < Math.ceil(this.totalItems / this.pageSize)) {
                this.currentPage++;
                this.fetchEmployee();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchEmployee();
            }
        },
        goToPage(page) {
            this.currentPage = page;
            this.fetchEmployee();
        },
    }
}
</script>

<style scoped>
.employee-icon {
    width: 24px;
    height: 24px;
}

.employee {
    gap: 30px;
    display: flex;
    flex-direction: column;
}

.employee-body {
    border: 2px solid #e6eae9;
    padding: 0px 15px;
    display: flex;
    height: 140px;
    background: #fff;
    border-radius: 10px;
    flex-direction: column;
    justify-content: space-around;
}

.employee-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.space-line {
    border: 1px solid #e6eae9;
}

select {
    border: 1px solid #e6eae9;
    margin: 10px 0px;
    border-radius: 5px;
    padding: 10px;
}

.employee-search {
    display: flex;
    justify-content: space-between;
}

.menu-search {
    display: flex;
    gap: 10px;
    align-items: center;
}

.search-filter {
    gap: 5px;
    display: flex;
    align-items: center;
}

.btn-search-primary {
    border: none;
    background: none;
}

/* employee-container */
.employee-container {
    padding: 15px;
    border-radius: 10px;
    background: #fff;
}

.list-employee table {
    margin-top: 20px;
    border-collapse: collapse;
    width: 100%;
}

.list-employee th,
.list-employee td {
    padding: 10px;
    border-bottom: 2px solid #ddd;
}

.list-employee th {
    background-color: #f2f2f2;
    text-align: left;
}

.action-buttons {
    display: flex;
    justify-content: flex-start;
}

.btn-delete-primary {
    border: none;
    background: none;
}
</style>