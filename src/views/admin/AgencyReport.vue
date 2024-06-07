<template>
    <div class="report-container">
        <span class="report-title">
            Order Statistics
        </span>
        <div class="order-search">
            <div class="menu-search">
                <div class="search-filter">
                    <select id="airport" class="form-select" placeholder="Select Cities" v-model="filter.airportId"
                        v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Agency'])">
                        <option value="0" selected>ALL</option>
                        <option v-for="a in maintainAirports" :key="a.id" :value="a.id">{{ a.name }}</option>
                    </select>
                </div>
                <div class="search-filter">
                    <select id="status-filter" v-model="filter.bookingStatusId"
                        v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Operator_Ref', 'Agency'])">
                        <option value="0">ALL</option>
                        <option v-for="(status, index) in maintainBookingStatus" :key="index" :value="status.Key">
                            {{ status.Value }}
                        </option>
                    </select>
                </div>
                <div class="search-filter">
                    <VueDatePicker v-model="filter.fromDate" :config="datePickerConfig" placeholder="From">
                    </VueDatePicker>
                </div>
                <div class="search-filter">
                    <VueDatePicker v-model="filter.toDate" :config="datePickerConfig" placeholder="To">
                    </VueDatePicker>
                </div>
                <div class="search-filter">
                    <select id="status-filter" v-model="filter.orderBy">
                        <option value="service-time">Sort by Service-Time</option>
                        <option value="booking-time">Sort by Booking-Time</option>
                    </select>
                </div>
                <div>
                    <input type="text" name="search" id="search" v-model="filter.keyword" placeholder="Search"
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
        <div class="data-report-month">
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ totalYear.total }} Bookings
                </div>
                <span class="report-title-data">
                    Total orders
                </span>
            </span>
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ totalYear.pendingCount }} Bookings
                </div>
                <span class="report-title-data">
                    Total pending orders
                </span>
            </span>
            <!-- <span class="total-data">Canceled: {{ totalYear.cancelCount }}</span> -->
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ totalYear.confirmCount }} Bookings
                </div>
                <span class="report-title-data">
                    Total confirmed orders
                </span>
            </span>
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ totalYear.completedCount }} Bookings
                </div>
                <span class="report-title-data">
                    Total completed orders
                </span>
            </span>
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ totalYear.uncompletedCount }} Bookings
                </div>
                <span class="report-title-data">
                    Total uncompleted orders
                </span>
            </span>
        </div>
        <div class="report-chart">
            <canvas id="dimensions" style="width: fit-content;height: 700px"></canvas>
        </div><br />
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import Chart from 'chart.js/auto';
import axios from "axios";
import Swal from 'sweetalert2';

export default {
    data() {
        return {
            dataMonthly: [],
            totalYear: {},
            datas: [],
            labelsample: [],
            chartData: {
                datasets: [{
                    label: 'Year Order Data',
                    backgroundColor: '#f87979',
                    data: []
                }],
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            },
            roles: "",
            maintainAirports: [],
            maintainBookingStatus: [],
            filter: {
                airportId: 0,
                bookingStatusId: 0,
                fromDate: null,
                toDate: null,
                keyword: "",
                orderBy: "booking-time",
                createdBy: 0,
                employeeId: 0,
                pageIndex: 1,
                pageSize: 10
            }
        };
    },
    setup() {
        const chartInstance = ref(null);
        const chartInitialized = ref(false);

        onMounted(async () => {
            const agency_Id = localStorage.getItem('user_id');
            const currentYear = new Date().getFullYear();
            const baseUri = process.env.VUE_APP_API_URL;
            const response = await axios.get(`${baseUri}/order/report/agency/month?agency_Id=${agency_Id}&year=${currentYear}`);
            const dataMonthly = response.data.monthlyData;
            console.log(dataMonthly);

            const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const dataPoints = new Array(12).fill(0);
            const dataPoints1 = new Array(12).fill(0);
            const dataPoints2 = new Array(12).fill(0);
            const dataPoints3 = new Array(12).fill(0);
            const dataPoints4 = new Array(12).fill(0);

            dataMonthly.forEach(monthData => {
                const monthIndex = monthData.month - 1;
                dataPoints[monthIndex] = monthData.total;
                dataPoints1[monthIndex] = monthData.pendingCount;
                dataPoints2[monthIndex] = monthData.confirmCount;
                dataPoints3[monthIndex] = monthData.completedCount;
                dataPoints4[monthIndex] = monthData.uncompletedCount;
            });

            const ctx = document.getElementById('dimensions').getContext('2d');

            // Destroy the previous chart instance if it has been initialized
            if (chartInitialized.value) {
                chartInstance.value.destroy();
            }

            chartInstance.value = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Total',
                            data: dataPoints,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgb(255, 99, 132)',
                            borderWidth: 1
                        },
                        {
                            label: 'Pending',
                            backgroundColor: 'rgba(255, 206, 86, 0.2)', // Thay đổi màu nền
                            borderColor: 'rgb(255, 206, 86)', // Thay đổi màu viền
                            borderWidth: 1,
                            data: dataPoints1
                        },
                        {
                            label: 'Confimed',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgb(54, 162, 235)',
                            borderWidth: 1,
                            data: dataPoints2,
                        },
                        {
                            label: 'Completed',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgb(75, 192, 192)', // Màu viền xanh lá đậm
                            borderWidth: 1,
                            data: dataPoints3,
                        },
                        {
                            label: 'Uncompleted',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)', // Màu nền của dòng mới khác
                            borderColor: 'rgb(153, 102, 255)', // Màu viền của dòng mới khác
                            borderWidth: 1,
                            data: dataPoints4 // Thêm dữ liệu cho dòng mới khác
                        }
                    ],

                },
                options: {
                    responsive: true,
                    // scales: {
                    //     y: {
                    //         stacked: true,
                    //         grid: {
                    //             display: true,
                    //             color: "rgba(255,99,132,0.2)"
                    //         }
                    //     },
                    //     x: {
                    //         grid: {
                    //             display: false
                    //         }
                    //     }
                    // }
                }
            });
            // Set chartInitialized to true after the chart has been initialized
            chartInitialized.value = true;
        });

        return { chartInstance };
    },
    mounted() {
        // this.fetchTotalYear();
        // this.fetchData();
        let airportId = localStorage.getItem('airportId');
        if (airportId) {
            this.filter.airportId = airportId;
        }
        //Chi role agency nhin thay data cua no
        let roles = localStorage.getItem('roles');
        let userId = localStorage.getItem('user_id');
        if (roles == "Agency") {
            this.filter.createdBy = userId
        }
        this.roles = localStorage.getItem('roles');

        //Chi role Operator chi nhin thay cac tour ma no duoc phan quyen

        this.maintainGetAllAirport();
        this.maintainGetAllStatus();

        //Kiem tra cac dieu kien va set tim kiem mac dinh
        this.maintainFetchOrders();
    },
    methods: {
        //#StartMaintainRegion
        roleChecker(accepedRoles) {
            let checker = false;

            let role = localStorage.getItem('roles');
            if (role == "Admin") {
                checker = true;
            }
            accepedRoles.forEach((element) => {
                if (element == role) {
                    checker = true;
                }
            })
            return checker;
        },
        async maintainChangeBookingStatus(orderId) {
            const confirmResult = await Swal.fire({
                title: 'Complete Booking',
                text: 'Do you want to complete this booking?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            });
            if (confirmResult.isConfirmed) {
                axios.get(`${process.env.VUE_APP_API_URL}/MaintainOrderDetails/GetById/${orderId}`).then((response) => {
                    let _detail = response.data;
                    if (_detail) {
                        _detail.status_Operator_ID = 3;
                        this.isLoading = true;
                        const user_Id = localStorage.getItem("user_id");
                        const apiUrl = process.env.VUE_APP_API_URL;
                        _detail.updatedBy = user_Id;

                        axios.post(`${apiUrl}/MaintainOrderDetails/Update`, _detail)
                            .then(() => {
                                this.maintainFetchOrders();
                            })
                            .catch(error => {
                                console.error('Error updating Order:', error);
                            })
                            .finally(() => {
                                this.isLoading = false;
                            });
                    }

                })
            }
            else {
                this.scheduleData.status_Operator_ID = 8;
            }
        },
        openEditTask(id) {
            this.selectedOrderTask = id;
        },
        maintainFetchOrders() {
            axios.post(`${process.env.VUE_APP_API_URL}/MaintainOrderDetails/FilterOrder`, this.filter).then((response) => {
                console.log(response.data);

                this.items = response.data.orders;
                this.totalItems = response.data.totalCount;
                this.totalPages = Math.ceil(this.totalItems / this.filter.pageSize);
            })
        },

        maintainGetAllStatus() {
            axios.get(`${process.env.VUE_APP_API_URL}/MaintainCommons/StatusBookingType`).then((response) => {
                this.maintainBookingStatus = response.data;
            })
        },

        maintainGetAllAirport() {
            axios.get(`${process.env.VUE_APP_API_URL}/MaintainCommons/GetAirports`).then((response) => {
                this.maintainAirports = response.data;
            })
        },
        //#EndMaintainRegion
        // async fetchData() {
        //     try {
        //         const agency_Id = localStorage.getItem('user_id');
        //         const currentYear = new Date().getFullYear();
        //         const baseUri = process.env.VUE_APP_API_URL;
        //         const response = await axios.get(`${baseUri}/order/report/agency/month?agency_Id=${agency_Id}&year=${currentYear}`);
        //         const dataMonthly = response.data.monthlyData;
        //         this.updateChartData(dataMonthly);
        //     } catch (error) {
        //         console.error("Error fetching data:", error);
        //     }
        // },

        updateChartData(monthlyData) {
            this.chartData.datasets[0].data = [];
            monthlyData.forEach(month => {
                this.chartData.datasets[0].data.push(month.total);
            });

            console.log('this is a label', this.chartData);
        },



        // fetchTotalYear() {
        //     const apiUrl = process.env.VUE_APP_API_URL;
        //     const user_id = localStorage.getItem("user_id");
        //     const year = new Date().getFullYear();
        //     axios
        //         .get(`${apiUrl}/order/report/agency?agency_Id=${user_id}&year=${year}`)
        //         .then((response) => {
        //             this.totalYear = response.data;
        //         })
        //         .catch((error) => {
        //             console.error("Error fetching data:", error);
        //         });
        // },
    },
};
</script>
<style scoped>
.data-report-month {
    min-height: 120px;
    display: flex;
    gap: 20px;
    margin: 20px 0px;
    justify-content: space-between;
}

.number-of-booking {
    font-weight: bold;
}

.report-title {
    font-size: 18px;
    font-weight: bold;
}

.report-chart {
    width: 100%;
    height: 610px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
}

.total-data {
    padding-left: 20px;
    display: flex;
    gap: 10px;
    width: 25%;
    background: #fff;
    border-radius: 7px;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
    flex-direction: column;
    justify-content: center;
}

.menu-search select {
    border: 2px solid #cbd5e1;
    padding: 5px;
    border-radius: 7px;
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

#airport,
#status-filter {
    border-radius: 5px;
    padding: 10px;
    border: none;
    background: none;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
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
</style>