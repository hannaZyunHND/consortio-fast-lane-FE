<template>
    <div class="popup-content">
        <form enctype="multipart/form-data" @submit.prevent="submitSchedule" id="edit-order-form">
            <div class="form-col">

                <div class="row">
                    <label for="employee">Assign</label>
                    <select v-model="scheduleData.employee_Id" id="employee">
                        <option v-for="(employee, index) in employees" :key="index" :value="employee.id">{{
                            employee.name }}
                        </option>
                    </select>
                </div>
                <button type="submit" class="btn-edit-primary">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'EditSchedule',
    components: {
    },
    props: {
        orderId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            scheduleData: {
                name: '',
                email: '',
                phone: '',
                airPort: '',
                service_ID: '',
                status_ID: '',
                nationality: '',
                employee_Id: null,
                status_Sales_Id: null,
                status_Operator_ID: '',
                note: '',
                passport_Number: '',
                flight_Number: '',
                service_Time: '',
                passport_File: null,
                visa_File: null,
                operator_Note: null,
            },
            passportFiles: [],
            visaFiles: [],
            passportFile: null,
            uploadedVisa: null,
            imagePreview: null,
            imageVisaPreview: null,
            selectedServices: [],
            selectedStatus: [],
            services: [],
            statuses: [],
            employees: [],
        };
    },
    setup() {
        const success = () => {
            toast("Update schedule successfully !", {
                autoClose: 3000,
                type: "success"
            });
        }
        return { success };
    },
    mounted() {
        this.fetchSchedule(this.orderId);
        this.fetchStatus();
        this.fetchEmployee();
    },

    watch: {

        selectedStatus: {
            handler: function () {
                this.getStatusSalesId();
            },
            deep: true
        }
    },

    methods: {
        submitSchedule() {
            const apiUrl = process.env.VUE_APP_API_URL;
            this.scheduleData.service_ID = this.scheduleData.service_ID.toString();

            console.log(this.scheduleData);
            axios.post(`${apiUrl}/order/update/${this.orderId}`, this.scheduleData)
                .then(() => {
                    this.success();
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });

                    // Phát ra sự kiện click trên document
                    document.dispatchEvent(clickEvent);
                    this.$emit("reloadPage")
                })
                .catch(error => {
                    console.error('Error updating Schedule:', error);
                });
        },
        fetchSchedule(item) {
            console.log('schedule', item)
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.get(`${apiUrl}/order/${item}`)
                .then(response => {
                    const responseData = response.data;
                    console.log(response.data);
                    if (responseData) {
                        this.scheduleData.name = responseData.name;
                        this.scheduleData.phone = responseData.phone;
                        this.scheduleData.email = responseData.email;
                        this.scheduleData.passport_Number = responseData.passport_Number;
                        this.scheduleData.nationality = responseData.nationality;
                        this.scheduleData.airPort = responseData.airPort;
                        this.scheduleData.flight_Number = responseData.flight_Number;
                        this.scheduleData.guest_Number = responseData.guest_Number;
                        this.scheduleData.service_ID = responseData.service;
                        this.scheduleData.status_ID = responseData.status;
                        this.scheduleData.operator_Note = responseData.operator_note;
                        this.scheduleData.service_Time = responseData.service_Time;
                        this.scheduleData.note = responseData.note;
                        this.scheduleData.groupReference = responseData.groupReference;
                        this.scheduleData.status_Sales_Id = responseData.status_Sales;
                    }
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        },

        async fetchStatus() {
            const apiUrl = process.env.VUE_APP_API_URL;
            try {
                const response = await axios.get(`${apiUrl}/status/role/2`);
                this.statuses = response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },
        async fetchEmployee() {
            const apiUrl = process.env.VUE_APP_API_URL;
            const user_id = parseInt(localStorage.getItem("user_id"));
            let isOperator = false;

            if (localStorage.getItem("roles") === "Operator") {
                isOperator = true;
            }
            const url = `${apiUrl}/employee?index=${this.currentPage}&pageSize=${this.pageSize}&user_id=${user_id}&isOperator=${isOperator}`;
            try {
                const response = await axios.get(url);
                this.employees = response.data.employees;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

    },
    saveAndNext() {
        this.part1Data = { ...this.scheduleData };
        this.currentPart = 2;
    },

    prevPart() {
        this.scheduleData = { ...this.part1Data };
        this.currentPart = 1;
    }
}
</script>
<style scoped>
.popup-content {
    width: fit-content;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.title-header {
    text-transform: uppercase;
    font-weight: 700;
    margin: 20px 0px;
}

#edit-order-form {
    display: flex;
    gap: 15px
}

.space-line {
    border: 1px solid #e6eae9;
}

.order-body {
    padding: 0px 15px;
    display: flex;
    height: 140px;
    background: #fff;
    border-radius: 10px;
    flex-direction: column;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    justify-content: space-around;
}

.row {
    display: flex;
    flex-direction: column;
}

.file-input {
    position: relative;
    display: inline-block;
    overflow: hidden;
    margin-bottom: 10px;
    padding: 10px;
}

.file-upload-label {
    border: 2px dashed #dfe4e9;
    display: block;
    padding: 50px 110px;
    color: black;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.file-upload-label:hover {
    background-color: #D3ECF0;
}

input[type="file"] {
    position: absolute;
    left: -9999px;
}

input[type="text"],
input[type="email"] {
    border: 1px solid #e6eae9;
    margin: 10px 0px;
    border-radius: 5px;
    padding: 10px;
}

select,
textarea {
    border: 1px solid #e6eae9;
    margin: 10px 0px;
    border-radius: 5px;
    padding: 10px;
}

.order-icon {
    width: 24px;
    height: 24px;
    color: #222;
    margin-left: 12px;
}

.btn-edit-primary {
    background: black;
    border: none;
    color: white;
    font-size: 14px;
    border-radius: 5px;
    width: 100%;
    padding: 15px;
}
</style>
