<template>
    <div class="popup-content">
        <h2>Add Employee</h2>
        <form enctype="multipart/form-data" @submit.prevent="submitForm" id="add-employee-form">
            <label for="name">Name</label>
            <input type="text" v-model="formData.name" placeholder="Emloyee's name">

            <label for="email">Email</label>
            <input type="text" v-model="formData.email" placeholder="User@gmail.com">

            <label for="password">Password</label>
            <input type="text" v-model="formData.password" placeholder="Your password">

            <label for="airport">Airport:</label>
            <select id="airport" v-model="formData.airport_Id" required>
                <option v-for="(airport, index) in airports" :key="index" :value="airport.id">
                    {{ airport.name }}
                </option>
            </select>
            <button type="submit" class="btn-add-primary">Save</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'AddEmployee',
    data() {
        return {
            formData: {
                name: '',
                airport_Id: '',
                email: '',
                password: '',
            },
            airports: [],
        };
    },
    setup() {
        const success = () => {
            toast("Add employee successfully !", {
                autoClose: 300,
                type: "success"
            });
        }
        return { success };
    },
    mounted() {
        this.fetchAirports();
    },
    methods: {
        fetchEmployee() {
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.get(`${apiUrl}/employee`)
                .then(response => {
                    this.items = response.data;
                    // this.totalItems = response.data.pagination.totalCount;
                    // this.totalPages = Math.ceil(this.totalItems / this.pageSize);
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },

        submitForm() {
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.post(`${apiUrl}/employee/create`, this.formData)
                .then(() => {
                    this.resetForm();
                    this.success();
                    //-----------
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
                    console.error('Error fetching data:', error);
                });
        },

        resetForm() {
            for (let key in this.formData) {
                this.formData[key] = '';
            }
        },

        async fetchAirports() {
            const apiUrl = process.env.VUE_APP_API_URL;
            await axios
                .get(`${apiUrl}/api/airport`)
                .then((response) => {
                    this.airports = response.data;
                    console.log(response.data)
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });

        },
    },
};
</script>

<style scoped>
.popup-content {
    width: 350px;
    position: absolute;
    /* top: 50%; */
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#add-employee-form {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
    border: 1px solid #e6eae9;
    margin: 10px 0px;
    border-radius: 5px;
    padding: 10px;
}

select {
    border: 1px solid #e6eae9;
    margin: 10px 0px;
    border-radius: 5px;
    padding: 10px;
}

.btn-add-primary {
    background: black;
    border: none;
    color: white;
    font-size: 14px;
    border-radius: 5px;
    padding: 15px;
    margin-top: 10px;
}
</style>
