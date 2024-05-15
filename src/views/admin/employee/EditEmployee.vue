<template>
    <div class="popup-content">
        <h2>Edit Employee</h2>
        <form enctype="multipart/form-data" @submit.prevent="submitForm" id="edit-service-form">
            <label for="name">Name</label>
            <input type="text" v-model="formData.name" placeholder="Emloyee's name">

            <label for="airport">Airport:</label>
            <select v-model="formData.airport_Id" required>
                <option value="" disabled selected hidden>Select Airport</option>
                <option v-for="(airport, index) in airports" :key="index" :value="airport.id">{{
                    airport.name
                }}
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
    name: 'EditEmployee',
    props: {
        employeeId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            formData: {
                name: '',
                airport: '',
            },
            airports: [],
        };
    },
    setup() {
        const success = () => {
            toast("Update employee successfully !", {
                autoClose: 3000,
                type: "success"
            });
        }
        return { success };
    },
    mounted() {
        this.fetchService(this.employeeId);
        this.fetchAirports();
    },
    methods: {
        submitForm() {
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.post(`${apiUrl}/employee/update/${this.employeeId}`, this.formData)
                .then(() => {
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
                    console.error('Error updating Order:', error);
                });
        },

        fetchService(item) {
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.get(`${apiUrl}/employee/${item}`)
                .then(response => {
                    const responseData = response.data;
                    if (responseData) {
                        console.log(responseData)
                        this.formData.name = responseData.name;
                        this.formData.airport_Id = responseData.airport_Id;
                    }
                })
                .catch(error => {
                    console.error('Error fetching service data:', error);
                });
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
    }
}
</script>
<style scoped>
.popup-content {
    width: 350px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    padding: 30px;
    border-radius: 15px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

#edit-service-form {
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
}
</style>
