<template>
    <div class="report-container">
        <span class="report-title">
            Statistics
        </span>
        <div class="order-search">
            <div class="menu-search">
                <div class="search-filter">
                    <select id="airport" class="form-select" placeholder="Select Cities" v-model="filter.airportId"
                        v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Agency'])">
                        <option value="0" selected>ALL AIRPORT</option>
                        <option v-for="a in maintainAirports" :key="a.id" :value="a.id">{{ a.name }}</option>
                    </select>
                </div>
                <div class="search-filter">
                    <select id="status-filter" v-model="filter.bookingStatusId"
                        v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Operator_Ref', 'Agency'])">
                        <option value="0">ALL STATUS</option>
                        <option v-for="(status, index) in maintainBookingStatus" :key="index" :value="status.Key">
                            {{ status.Value }}
                        </option>
                    </select>
                </div>
                <div class="search-filter">
                    <select id="status-filter" v-model="filter.serviceId"
                        v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Operator_Ref', 'Agency'])">
                        <option value="0">ALL SERVICES</option>
                        <option v-for="(s, index) in maintainServices" :key="index" :value="s.id">{{ s.name }}</option>
                    </select>
                </div>
                <div class="search-filter">
                    <select id="status-filter" v-model="filter.createdBy" v-if="roleChecker(['Admin'])">
                        <option :value="defaultUserId">ALL USERS</option>
                        <option v-for="(user, index) in users" :key="index" :value="user.id">
                            {{ user.name }}
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
                <div style="display: none">
                    <input type="text" name="search" id="search" v-model="filter.keyword" placeholder="Search"
                        @keyup.enter="search" />
                </div>

            </div>

        </div>
        <div class="data-report-month">
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ items.length }}
                </div>
                <span class="report-title-data">
                    Total Booking
                </span>
            </span>
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ itemPending.length }}
                </div>
                <span class="report-title-data">
                    Total Pending Booking
                </span>
            </span>
            <!-- <span class="total-data">Canceled: {{ totalYear.cancelCount }}</span> -->
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ itemConfirm.length }} 
                </div>
                <span class="report-title-data">
                    Total Confirmed Booking
                </span>
            </span>
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ itemComplete.length }} 
                </div>
                <span class="report-title-data">
                    Total Completed Booking
                </span>
            </span>
            <span class="total-data">
                <i class="pi pi-box" style="font-size: 1rem; color: #3C5289"></i>
                <div class="number-of-booking">
                    {{ itemUnComplete.length }}
                </div>
                <span class="report-title-data">
                    Total Uncompleted Booking
                </span>
            </span>
        </div>
        <div class="report-chart-combine">


            <div class="chart-title">Chart</div>
            <div class="report-item-wrapper" style="display: grid; grid-template-columns: auto auto; gap: 20px;">

                <div class="report-item" v-for="c in compareBarChart">
                    <div class="combine-search">
                        <div class="menu-search-combine">
                            <div class="search-filter">
                                <select id="airport" class="form-select" placeholder="Select Cities"
                                    v-model="c.filterItem.airportId"
                                    v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Agency'])">
                                    <option value="0" selected>ALL AIRPORT</option>
                                    <option v-for="a in maintainAirports" :key="a.id" :value="a.id">{{ a.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="search-filter">
                                <select id="status-filter" v-model="c.filterItem.serviceId"
                                    v-if="roleChecker(['Admin', 'Sale', 'Sale_Admin', 'Operator_Ref', 'Agency'])">
                                    <option value="0">ALL SERVICES</option>
                                    <option v-for="(s, index) in maintainServices" :key="index" :value="s.id">{{ s.name
                                        }}
                                    </option>
                                </select>
                            </div>
                            <div class="search-filter">
                                <select id="status-filter" v-model="c.filterItem.createdBy"
                                    v-if="roleChecker(['Admin'])">
                                    <option value="0">ALL USERS</option>
                                    <option v-for="(user, index) in users" :key="index" :value="user.id">
                                        {{ user.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="search-filter">
                                <VueDatePicker v-model="c.filterItem.fromDate" :config="datePickerConfig"
                                    placeholder="From">
                                </VueDatePicker>
                            </div>
                            <div class="search-filter">
                                <VueDatePicker v-model="c.filterItem.toDate" :config="datePickerConfig"
                                    placeholder="To">
                                </VueDatePicker>
                            </div>
                            <div class="search-filter">
                                <select id="status-filter" v-model="c.filterItem.orderBy">
                                    <option value="service-time">Sort by Service-Time</option>
                                    <option value="booking-time">Sort by Booking-Time</option>
                                </select>
                            </div>

                            <div class="search-filter">
                                <button @click="onSearchFilter()" class="btn-reset-primary">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="chart-item">
                        <Bar :data="c.chartInfo" v-if="c.chartInfo" />
                    </div>

                </div>
            </div>



        </div><br />
    </div>
</template>

<script>
// import { ref, onMounted } from 'vue';
// import Chart from 'chart.js/auto';
import { Pie, Bar, Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement, PointElement, LineElement)


import axios from "axios";
import Swal from 'sweetalert2';

export default {
    components: { Pie, Bar, Line },
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
            maintainServices: [],
            filter: {
                airportId: 0,
                bookingStatusId: 0,
                fromDate: null,
                serviceId: 0,
                toDate: null,
                keyword: "",
                orderBy: "booking-time",
                createdBy: 0,
                employeeId: 0,
                pageIndex: 1,
                pageSize: 1000000
            },
            filterUser: {
                airportId: 0,
                role: "",
                keyword: "",
                pageIndex: 1,
                pageSize: 1000000
            },
            items: [],
            itemPending: [],
            itemConfirm: [],
            itemComplete: [],
            itemCancel: [],
            itemUnComplete: [],
            users: [],
            serviceChart: null,
            lineChart: null,
            softColors: [
                '#B0E0E6', // Powder Blue
                '#AFEEEE', // Pale Turquoise
                '#98FB98', // Pale Green
                '#E6E6FA', // Lavender
                '#FFFACD', // Lemon Chiffon
                '#D8BFD8', // Thistle
                '#FFE4E1', // Misty Rose
                '#F5DEB3', // Wheat
                '#F0E68C', // Khaki
                '#E0FFFF', // Light Cyan
                '#F0FFF0', // Honeydew
                '#F5F5DC', // Beige
                '#E6E6FA', // Lavender
                '#FFF5EE', // Seashell
                '#FAFAD2', // Light Goldenrod Yellow
                '#D3D3D3', // Light Gray
                '#FFEFD5', // Papaya Whip
                '#F0F8FF', // Alice Blue
                '#FFFAF0', // Floral White
                '#FAEBD7', // Antique White
            ],
            minDate: '',
            maxDate: '',
            lineChartPicking: 'year',
            compareBarChart: [
                {
                    filterItem: {
                        airportId: 0,
                        bookingStatusId: 0,
                        fromDate: null,
                        serviceId: 0,
                        toDate: null,
                        keyword: "",
                        orderBy: "booking-time",
                        createdBy: 0,
                        employeeId: 0,
                        pageIndex: 1,
                        pageSize: 1000000
                    },
                    chartInfo: null
                },
                {
                    filterItem: {
                        airportId: 0,
                        bookingStatusId: 0,
                        fromDate: null,
                        serviceId: 0,
                        toDate: null,
                        keyword: "",
                        orderBy: "booking-time",
                        createdBy: 0,
                        employeeId: 0,
                        pageIndex: 1,
                        pageSize: 1000000
                    },
                    chartInfo: null
                }
            ],
            defaultUserId: 0,

        };
    },

    mounted() {
        // this.fetchTotalYear();
        // this.fetchData();
        let airportId = localStorage.getItem('airportId');
        if (airportId) {
            this.filter.airportId = airportId;
            this.compareBarChart.forEach(r => {
                r.filterItem.airportId = airportId
            })
        }
        //Chi role agency nhin thay data cua no
        let roles = localStorage.getItem('roles');
        let userId = localStorage.getItem('user_id');
        if (roles == "Agency") {
            this.filter.createdBy = userId
            this.compareBarChart.forEach(r => {
                r.filterItem.createdBy = userId
            })
        }
        if (roles == "Agency") {
            this.filter.createdBy = userId
            this.defaultUserId = userId
        }
        this.roles = localStorage.getItem('roles');


        //Chi role Operator chi nhin thay cac tour ma no duoc phan quyen
        //Set ngày tìm kiếm mặc định
        const today = new Date();

        // Thiết lập thời gian 00:00 cho fromDate
        const fromDate = new Date(today.setHours(0, 0, 0, 0));

        // Thiết lập thời gian 23:59 cho toDate
        const toDate = new Date(today.setHours(23, 59, 59, 999));

        // this.filter.fromDate = fromDate;
        // this.filter.toDate = toDate;
        this.compareBarChart.forEach((chart) => {
            // const _today = new Date();

            // // Lấy ngày đầu tháng hiện tại
            // const _fromDate = new Date(_today.getFullYear(), _today.getMonth(), 1);

            // // Lấy ngày cuối tháng hiện tại
            // const _toDate = new Date(_today.getFullYear(), _today.getMonth() + 1, 0);

            // // Thiết lập thời gian 00:00 cho fromDate
            // _fromDate.setHours(0, 0, 0, 0);

            // // Thiết lập thời gian 23:59 cho toDate
            // _toDate.setHours(23, 59, 59, 999);
            // chart.filterItem.fromDate = _fromDate;
            // chart.filterItem.toDate = _toDate;
        })


        this.maintainGetAllAirport();
        this.maintainGetAllStatus();
        this.maintainFetchUser();
        this.maintainGetServices();
        //Kiem tra cac dieu kien va set tim kiem mac dinh
        this.maintainFetchOrders();
        this.onLoadCompareCharts();

        // console.log(this.generateDateRange('2024-06-01', '2024-07-01', 'Tuần'))

    },
    methods: {
        onSearchFilter() {
            this.onLoadCompareCharts();
        },
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
                // console.log(response.data);

                this.items = response.data.orders;
                this.itemPending = this.items.filter(r => r.status == "B_Pending");
                this.itemConfirm = this.items.filter(r => r.status == "B_Confirm");
                this.itemComplete = this.items.filter(r => r.status == "B_Complete");
                this.itemCancel = this.items.filter(r => r.status == "B_Cancel");
                this.itemUnComplete = this.items.filter(r => r.status == "B_UnComplete");
                this.onLoadServiceChart()
                // this.findMinMaxDates()



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

        //region maintaine
        maintainFetchUser() {
            axios.post(`${process.env.VUE_APP_API_URL}/MaintainUsers/FilterUsers`, this.filterUser).then((response) => {
                console.log(response.data);

                this.users = response.data.users; let roles = localStorage.getItem('roles');
                let userId = localStorage.getItem('user_id');
                if (roles == "Agency") {
                    this.users = this.users.filter(r => r.parentId == userId)
                } else {
                    this.users = this.users.filter(r => r.role == "Admin" || r.role == "Sale_Admin" || r.role == "Agency")
                }
                this.totalPage = response.data.totalPage;

            })

        },

        updateChartData(monthlyData) {
            this.chartData.datasets[0].data = [];
            monthlyData.forEach(month => {
                this.chartData.datasets[0].data.push(month.total);
            });

            console.log('this is a label', this.chartData);
        },
        search() {
            this.maintainFetchOrders();
        },
        maintainGetServices() {
            const apiUrl = process.env.VUE_APP_API_URL;
            axios
                .get(`${apiUrl}/MaintainCommons/GetServices`)
                .then((response) => {
                    this.maintainServices = response.data;
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });

        },
        onLoadServiceChart() {
            /* serviceChart : {
                datasets: [{
                    label: 'Year Order Data',
                    backgroundColor: '#f87979',
                    data: []
                }],
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            } */


            //dung label
            let chartLabels = [];
            for (let i = 0; i < this.maintainServices.length; i++) {
                chartLabels.push(this.maintainServices[i].name);
            }

            let chartDataSetOption = {};
            chartDataSetOption.label = 'Services';
            chartDataSetOption.data = [];
            chartDataSetOption.backgroundColor = [];
            for (let i = 0; i < this.maintainServices.length; i++) {
                const _serviceName = this.maintainServices[i].name;
                const orders = this.items.filter(r => r.service === _serviceName)
                chartDataSetOption.data.push(orders.length);
                chartDataSetOption.backgroundColor.push(this.softColors[i])
            }

            this.serviceChart = {
                datasets: [chartDataSetOption],
                labels: chartLabels
            }


        },
        generateDateRange(fromDate, toDate, picking) {
            const result = [];
            const startDate = new Date(fromDate);
            const endDate = new Date(toDate);

            if (picking === 'Ngày') {
                // Load all days
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    result.push(currentDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            } else if (picking === 'Tuần') {
                // Load all weeks
                let currentDate = new Date(startDate);
                while (currentDate <= endDate) {
                    const startOfWeek = new Date(currentDate);
                    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                    result.push(startOfWeek.toISOString().split('T')[0]); // Format as YYYY-MM-DD
                    currentDate.setDate(currentDate.getDate() + 7);
                }
            } else if (picking === 'Tháng') {
                // Load all months in the current year
                const currentYear = new Date().getFullYear();
                for (let month = 0; month < 12; month++) {
                    const monthDate = new Date(currentYear, month, 1);
                    result.push(monthDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
                }
            }

            return result;
        },
        findMinMaxDates() {
            console.log(this.items)
            if (this.items.length === 0) {
                this.minDate = '';
                this.maxDate = '';
                return;
            }


            const dates = this.items.map(item => new Date(item.created_at));
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));

            this.minDate = minDate.toISOString().split('T')[0];
            this.maxDate = maxDate.toISOString().split('T')[0];



        },
        filterItemsInDate(from, to) {
            let itemFromDate = this.items.filter(item => {
                const service_Time = new Date(item.service_Time);
                const startDate = new Date(from);
                const endDate = new Date(to);
                return service_Time >= startDate && service_Time <= endDate;
            });
            return itemFromDate;
        },
        onLoadLineChart() {
            //Lay ra label
            this.lineChart = {}
            this.lineChart.labels = this.generateDateRange(this.filter.fromDate, this.filter.toDate, this.year);
            this.lineChart.datasets = []
            // Lay ra data
            let chartDataSetOption = {};
            chartDataSetOption.label = 'Service Time ';
            chartDataSetOption.data = [];
            chartDataSetOption.backgroundColor = [];

            for (let i = 0; i < this.maintainServices.length; i++) {
                const _serviceName = this.maintainServices[i].name;
                const orders = this.items.filter(r => r.service === _serviceName)
                chartDataSetOption.data.push(orders.length);
                chartDataSetOption.backgroundColor.push(this.softColors[i])
            }



        },
        onLoadCompareCharts() {
            this.compareBarChart.forEach((chart) => {
                const apiUrl = process.env.VUE_APP_API_URL;
                axios.post(`${apiUrl}/MaintainOrderDetails/BarChartByStatus`, chart.filterItem).then((response) => {
                    console.log(response.data)
                    /* serviceChart : {
                        datasets: [{
                            label: 'Year Order Data',
                            backgroundColor: '#f87979',
                            data: []
                        }],
                        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    } */

                    chart.chartInfo = {};
                    chart.chartInfo.labels = response.data.map(r => r.labelName)
                    let dataSetTotal = [];
                    let dataSetPending = [];
                    let dataSetConfirm = [];
                    let dataSetComplete = [];
                    let dataSetUncomplete = [];
                    let dataSetCancel = [];

                    response.data.forEach(r => {
                        dataSetTotal.push(r.counting[0])
                        dataSetPending.push(r.counting[1]);
                        dataSetConfirm.push(r.counting[2]);
                        dataSetComplete.push(r.counting[3]);
                        dataSetUncomplete.push(r.counting[4]);
                        dataSetCancel.push(r.counting[5]);
                    })
                    /*
                        if (status.includes('Pending')) {
                            return { backgroundColor: "#ADD8E6", color: "black" }; // blue
                            } else if (status.includes('Confirm')) {
                            return { backgroundColor: "#90EE90", color: "black" }; // green
                            } else if (status.includes('Complete') && !status.includes('Un')) {
                            return { backgroundColor: "#FFFFE0", color: "black" }; // yellow
                            } else if (status.includes('UnComplete')) {
                            return { backgroundColor: "#D3D3D3", color: "black" }; // gray
                            } else if (status.includes('Cancel')) {
                            return { backgroundColor: "#FFC0CB", color: "black" }; // red
                            }
                    */
                    chart.chartInfo.datasets = [
                        {
                            label: "Total",
                            backgroundColor: "#ED9121",
                            data: dataSetTotal
                        },
                        {
                            label: "Pending",
                            backgroundColor: "#ADD8E6",
                            data: dataSetPending
                        },
                        {
                            label: "Confirm",
                            backgroundColor: "#90EE90",
                            data: dataSetConfirm
                        },
                        {
                            label: "Complete",
                            backgroundColor: "#FFFFE0",
                            data: dataSetComplete
                        },
                        {
                            label: "UnComplete",
                            backgroundColor: "#D3D3D3",
                            data: dataSetUncomplete
                        },
                        {
                            label: "Cancel",
                            backgroundColor: "#FFC0CB",
                            data: dataSetCancel
                        },
                    ];
                    console.log(chart)
                }).catch(err => {
                    console.log(err)
                })
            })
        }


    },
    watch: {
        filter: {
            handler(newVal) {
                console.log('Filter object changed:', newVal);
                // Thực hiện hành động khi đối tượng filter thay đổi
                this.maintainFetchOrders();
            },
            deep: true
        }
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
.search-filter select{
    font-size: 12px;
}
.number-of-booking {
    font-weight: bold;
    font-size: 21px;
}

.report-title {
    font-size: 18px;
    font-weight: bold;
}

.report-chart {
    /* width: 100%;
    height: 610px; */
    height: 90vh;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 3px 5px #00000005, 0 0 2px #0000000d, 0 1px 4px #00000014;
    /* display: grid;
    grid-template-columns: auto auto;
    gap: 10px */
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
.chart-title{
    font-size: 18px;
    font-weight: 600;
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

.report-item canvas {
    width: 100% !important;
    height: 100% !important;
}

.menu-search-combine {
    display: grid;
    grid-template-columns: auto auto auto;
}
.report-chart-combine{
    margin-top: 60px;
}
</style>