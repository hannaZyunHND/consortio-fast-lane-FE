<template>
    <div class="report-container">
        <span class="report-title">
            Order Static
        </span>
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
        this.fetchTotalYear();
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const agency_Id = localStorage.getItem('user_id');
                const currentYear = new Date().getFullYear();
                const baseUri = process.env.VUE_APP_API_URL;
                const response = await axios.get(`${baseUri}/order/report/agency/month?agency_Id=${agency_Id}&year=${currentYear}`);
                const dataMonthly = response.data.monthlyData;
                this.updateChartData(dataMonthly);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },

        updateChartData(monthlyData) {
            this.chartData.datasets[0].data = [];
            monthlyData.forEach(month => {
                this.chartData.datasets[0].data.push(month.total);
            });

            console.log('this is a label', this.chartData);
        },



        fetchTotalYear() {
            const apiUrl = process.env.VUE_APP_API_URL;
            const user_id = localStorage.getItem("user_id");
            const year = new Date().getFullYear();
            axios
                .get(`${apiUrl}/order/report/agency?agency_Id=${user_id}&year=${year}`)
                .then((response) => {
                    this.totalYear = response.data;
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        },
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
</style>