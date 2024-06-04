<script>
import axios from 'axios';

export default {
    name: 'allOfAgency',
    data() {
        return {
            items: [],
        }
    },

    mounted() {
        this.fetchReport_All_Of_Agency();
    },

    methods: {
        async fetchReport_All_Of_Agency() {
            try {
                const apiUrl = process.env.VUE_APP_API_URL;
                const response = await axios.get(`${apiUrl}/order/GetAgencyStatistics`);
                this.items = response.data.agencies;
            } catch (error) {
                this.error = error.message;
                alert(error.message);
            }
        },

        refreshDatapage() {
            this.fetchReport_All_Of_Agency();
        },

        // nextPage() {
        //     if (this.currentPage < Math.ceil(this.totalItems / this.pageSize)) {
        //         this.currentPage++;
        //         this.fetchReport_All_Of_Agency(1);
        //     }
        // },
        // prevPage() {
        //     if (this.currentPage > 1) {
        //         this.currentPage--;
        //         this.fetchReport_All_Of_Agency(1);
        //     }
        // },
        // goToPage(page) {
        //     this.currentPage = page;
        //     this.fetchReport_All_Of_Agency(1);
        // },
    },
}
</script>

<template>
    <div class="agency-report">
        <div class="agency-report-search">
            <div class="order-search">
                <div class="menu-search">
                    <div class="search-filter">
                        <select id="airport" class="form-select" placeholder="Select Cities">
                            <option value="" disabled selected>Airport</option>
                            <option value="Da Nang">Da Nang</option>
                            <option value="Tan Son Nhat">Tan Son Nhat</option>
                            <option value="Noi Bai">Noi Bai</option>
                            <option value="Phu Quoc">Phu Quoc</option>
                            <option value="Cam Ranh">Cam Ranh</option>
                        </select>
                    </div>
                    <div>
                        <input type="text" name="search" id="search" v-model="searchTerm" placeholder="Search"
                            @keyup.enter="search" />
                    </div>
                    <button class="btn-search-primary">
                        <i class="pi pi-search" style="font-size: 1rem" @click="search"></i>
                    </button>
                </div>
                <button @click="refreshOrders" class="btn-reset-primary">
                    <i class="pi pi-refresh" style="font-size: 1rem"></i>
                </button>
            </div>
        </div>
        <div class="agency-list">
            <table>
                <thead>
                    <tr class="data-table-tilte">
                        <th>STT</th>
                        <th>Agency</th>
                        <th>Total</th>
                        <th>Pending</th>
                        <th>Confirmed</th>
                        <th>Canceled</th>
                        <th>Completed</th>
                        <th>Uncompleted</th>
                        <th class="order-actions">Actions</th>
                    </tr>
                </thead>
                <tbody class="order-info">
                    <tr v-for="(item, index) in items" :key="item.id" class="order-information">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <span class="item" :data-id="item.id">
                                {{ item.name }}
                            </span>
                        </td>
                        <td>
                            <span class="item" :data-id="item.id">
                                {{ item.statistics.totalOrders }}
                            </span>
                        </td>
                        <td>
                            <span class="item" :data-id="item.id">
                                {{ item.statistics.pendingOrders }}
                            </span>
                        </td>
                        <td>
                            <span class="item" :data-id="item.id">
                                {{ item.statistics.confirmedOrders }}
                            </span>
                        </td>
                        <td>
                            <div class="item" :data-id="item.id">
                                {{ item.statistics.cancelledOrders }}
                            </div>
                        </td>
                        <td>
                            <span class="item" :data-id="item.id">
                                {{ item.statistics.completedOrders }}
                            </span>
                        </td>
                        <td>
                            <span class="item" :data-id="item.id">
                                {{ item.statistics.uncompletedOrders }}
                            </span>
                        </td>
                        <td>
                            <!-- <span class="item" :data-id="item.id" id="action-btn-primary">
                                button
                            </span> -->
                        </td>
                    </tr>
                </tbody>
            </table>
            <Pagination :currentPage="currentPage" :totalPages="totalPages" @nextPage="nextPage" @prevPage="prevPage"
                @goToPage="goToPage" />
        </div>
    </div>
</template>
<style scoped>
.agency-report {
    gap: 30px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.agency-report-search {
    padding: 0px 15px;
    display: flex;
    background: #fff;
    border-radius: 7px;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
    flex-direction: column;
    justify-content: space-around;
}

.search-filter {
    gap: 5px;
    display: flex;
    align-items: center;
}

#search {
    border: none;
    width: 185px;
    padding: 10px;
    background: none;
    border-radius: 8px;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

#search:focus {
    outline: none;
    border: none;
    background: none;
}

.order-search {
    gap: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

select {
    border: 1px solid #e6eae9;
    margin: 10px 0px;
    border-radius: 5px;
    padding: 10px;
}

.btn-export-primary,
.btn-search-primary {
    border-radius: 7px;
    padding: 10px;
    border: none;
    background: none;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

.btn-reset-primary {
    height: 38px;
    border-radius: 7px;
    padding: 10px;
    border: none;
    background: none;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}


/* report at here */
.agency-list {
    padding: 0px 15px 0 15px;
    overflow-y: auto;
    border-radius: 10px;
    height: 100%;
    background: #fff;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

.agency-list table {
    border-collapse: collapse;
    width: 100%;
}

.agency-list th,
.agency-list td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.agency-list th {
    text-align: left;
}

.data-table-tilte {
    text-transform: uppercase;
}
</style>