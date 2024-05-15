<template>
    <div class="status">
        <div class="status-body">
            <div class="status-header">
                <h3>Menu status</h3>
                <PopupWrapper>
                    <template #header>
                        <span class="popover">Add new +</span>
                    </template>
                    <template #content>
                        <div class="popover-content">
                            <AddStatus @reloadPage="fetchStatus()" />
                        </div>
                    </template>
                </PopupWrapper>
            </div>
            <div class="space-line"></div>
            <div class="status-search">
                <div class="menu-search">
                    <div class="search-filter">
                        <i class="pi pi-filter" style="font-size: 1rem"></i>
                        <span>Filter</span>
                    </div>
                    <div class="search-filter">
                        <i class="pi pi-sort-alt" style="font-size: 1rem"></i>
                        <span>Sort</span>
                    </div>
                </div>
                <button class="btn-search-primary">
                    <i class="pi pi-search" style="font-size: 1rem"></i>
                </button>
            </div>
        </div>
        <div class="status-container">
            <div class="list-status">
                <table>
                    <thead>
                        <tr class="data-table-tilte">
                            <th><bars-2-icon class="status-icon" /></th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Created_at</th>
                            <th>Updated_at</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody class="status-info">
                        <tr v-for="item in items" :key="item.id" class="status-information">
                            <td><input type="checkbox"></td>
                            <td>
                                <div class="item" data-id="{{item.id}}">{{ item.name }}</div>
                            </td>
                            <td>
                                <div class="item" data-id="{{item.id}}">{{ item.role }}</div>
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
                                <data class="action-buttons">
                                    <PopupWrapper>
                                        <template #header>
                                            <div class="popover">
                                                <pencil-square-icon class="status-icon"
                                                    @click="openEditStatus(item.id)" />
                                            </div>
                                        </template>
                                        <template #content>
                                            <div class="popover-content">
                                                <EditStatus :statusId="selectedStatusId" @reloadPage="fetchStatus()" />
                                            </div>
                                        </template>
                                    </PopupWrapper>
                                    <button @click="deleteItem(item.id)" class="btn-delete-primary">
                                        <trash-icon class="status-icon" />
                                    </button>
                                </data>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import 'primeicons/primeicons.css'
import { TrashIcon, PencilSquareIcon, Bars2Icon, } from '@heroicons/vue/24/solid';
import PopupWrapper from '@/components/PopupWrapper.vue';
import AddStatus from '@/views/admin/status/AddStatus.vue';
import EditStatus from '@/views/admin/status/EditStatus.vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'StatusPage',
    components: {
        PencilSquareIcon, PopupWrapper,
        Bars2Icon,
        TrashIcon,
        AddStatus, EditStatus,
    },
    data() {
        return {
            items: [],
            showModalStatus: false,
            selectedStatusId: ''
        };
    },
    setup() {
        const success = () => {
            toast("Add status successfully !", {
                autoClose: 1000,
                type: "success"
            });
        };

        const remove = () => {
            toast("Delete status successfully !", {
                autoClose: 1000,
                type: "success"
            });
        };

        const updateStatusData = () => {
            this.fetchStatus();
        };

        return {
            success, remove,
            updateStatusData
        };
    },

    mounted() {
        this.fetchStatus(1);
    },
    methods: {
        fetchStatus() {
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.get(`${apiUrl}/status`)
                .then(response => {
                    this.items = response.data;
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        deleteItem(item) {
            console.log("item", item)
            if (confirm('Are you sure to delete?')) {
                const apiUrl = process.env.VUE_APP_API_URL;
                axios.delete(`${apiUrl}/status/delete/${item}`)
                    .then(() => {
                        this.remove()
                        this.$emit('deleted');
                        this.fetchStatus();
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

            return `${month}/${day}/${year}`;
        },
        openEditStatus(statusId) {
            this.selectedStatusId = statusId;
            console.log("dây là id: " + this.selectedStatusId)
        },

        nextPage() {
            if (this.currentPage < Math.ceil(this.totalItems / this.pageSize)) {
                this.currentPage++;
                this.fetchStatus();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchStatus();
            }
        },
        goToPage(page) {
            this.currentPage = page;
            this.fetchStatus();
        },
    }
}
</script>

<style scoped>
.status-icon {
    width: 24px;
    height: 24px;
}

.status {
    gap: 30px;
    display: flex;
    flex-direction: column;
}

.status-body {
    padding: 0px 15px;
    display: flex;
    height: 140px;
    background: #fff;
    border-radius: 10px;
    border: 2px solid #e6eae9;
    flex-direction: column;
    justify-content: space-around;
}

.status-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.space-line {
    border: 1px solid #e6eae9;
}

.status-search {
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

/* status-container */
.status-container {
    padding: 15px;
    overflow-y: auto;
    border-radius: 10px;
    background: #fff;
}

.list-status table {
    margin-top: 20px;
    border-collapse: collapse;
    width: 100%;
}

.list-status th,
.list-status td {
    padding: 10px;
    border-bottom: 2px solid #ddd;
}

.list-status th {
    background-color: #f2f2f2;
    text-align: left;
}

.action-buttons {
    display: flex;
    justify-content: center;
}

.btn-delete-primary {
    border: none;
    background: none;
}
</style>