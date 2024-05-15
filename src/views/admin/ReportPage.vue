<template>
  <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "ReportPage",
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ], // Sử dụng tên tháng tiếng Anh cho nhãn của biểu đồ
        datasets: [], // Khởi tạo mảng rỗng cho dữ liệu của biểu đồ
      },
      chartOptions: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };
  },
  methods: {
    // Hàm để cập nhật dữ liệu của biểu đồ từ JSON
    updateChartData(jsonData) {
      const labels = this.chartData.labels; // Lấy mảng nhãn đã được khai báo
      const datasets = [];

      // Duyệt qua từng sân bay
      for (const airport in jsonData) {
        const airportData = jsonData[airport];

        // Khởi tạo mảng rỗng để lưu trữ dữ liệu của sân bay hiện tại
        const airportDataset = {
          label: airport,
          data: Array.from({ length: 12 }).fill(null), // Khởi tạo mảng rỗng có độ dài 12, mỗi giá trị ban đầu là null
          backgroundColor: "#1da750", // Màu đã được chỉ định
        };

        // Duyệt qua dữ liệu của từng tháng của sân bay hiện tại
        for (const month in airportData) {
          const monthData = airportData[month];
          const index = labels.indexOf(month); // Lấy chỉ số của tháng trong mảng nhãn

          if (index !== -1) {
            // Chỉ cập nhật dữ liệu nếu chỉ số mảng hợp lệ
            const totalCount =
              monthData.length > 0 ? monthData[0].totalCount : 0;
            airportDataset.data[index] = totalCount;
          }
        }

        datasets.push(airportDataset); // Thêm dữ liệu của sân bay vào mảng datasets
      }

      // Cập nhật dữ liệu và nhãn của biểu đồ
      this.chartData.datasets = datasets;
    },
  },
  created() {
    // Khởi tạo dữ liệu từ JSON khi component được tạo
    const jsonData = {
      "Noi Bai": {
        April: [{ totalCount: 18, month: 4, airport: "" }],
        March: [{ totalCount: 11, month: 4, airport: "" }],
      },
    }; // Thay thế bằng dữ liệu JSON thực tế của bạn
    this.updateChartData(jsonData);
  },
};
</script>
