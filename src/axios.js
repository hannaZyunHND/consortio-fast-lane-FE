import axios from 'axios';
// import { getCurrentInstance } from 'vue'; // Import getCurrentInstance từ Vue

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
    function (config) {
        // Trả về config nếu muốn thay đổi request trước khi nó được gửi đi
        return config;
    },
    function (error) {
        // Xử lý lỗi request ở đây
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        // Xử lý dữ liệu response ở đây
        // Ví dụ:
        // popupWrapper.showPopUp.value = false;
        // Xử lý dữ liệu response ở đây
        // const currentInstance = getCurrentInstance(); // Lấy instance của component hiện tại
        // console.log(currentInstance)
        // if (currentInstance && currentInstance.proxy.$options.name === 'PopupWrapper') {
        //     // Kiểm tra xem component PopupWrapper có được mounted không
        //     currentInstance.proxy.$options.parent.appContext.app.unmount(currentInstance.proxy.$el); // Unmount component PopupWrapper
        // }


        return response;
    },
    function (error) {
        // Xử lý lỗi response ở đây
        return Promise.reject(error);
    }
);

export default axiosInstance;
