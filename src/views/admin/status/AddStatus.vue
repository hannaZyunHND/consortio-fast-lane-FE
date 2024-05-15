<template>
    <div class="popup-content">
        <h2>Add Status</h2>
        <form enctype="multipart/form-data" @submit.prevent="submitForm" id="add-user-form">
            <div class="row">
                <label for="username">Name</label>
                <input type="text" v-model="formData.name" placeholder="Your status">
            </div>

            <label>Role</label>
            <select v-model="formData.roleId" id="service">
                <option value="" disabled selected hidden>Select Role</option>
                <option v-for="(role, index) in roles" :key="index" :value="role.id">{{ role.name }}</option>
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
    name: 'AddStatus',
    components: {
    },
    data() {
        return {
            formData: {
                name: '',
                roleId: '',
            },
            roles: [],
        }
    },
    mounted() {
        this.fetchRoles();
    },

    methods: {
        async fetchRoles() {
            const apiUrl = process.env.VUE_APP_API_URL;
            try {
                const response = await axios.get(`${apiUrl}/roles`);
                this.roles = response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },

        async submitForm() {
            const apiUrl = process.env.VUE_APP_API_URL;
            try {
                await axios.post(`${apiUrl}/status/create`, this.formData);
                this.resetForm();
                this.success();
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });

                // Phát ra sự kiện click trên document
                document.dispatchEvent(clickEvent);
                this.$emit("reloadPage")
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        },

        resetForm() {
            this.formData.name = '';
            this.formData.roleId = '';
        },

        success() {
            toast("Add status successfully !", {
                autoClose: 300,
                type: "success"
            });
        },
    },
};
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

#add-user-form {
    display: flex;
    flex-direction: column;
}

.row {
    display: flex;
    flex-direction: column;
}

input[type="text"] {
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
