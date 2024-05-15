<template>
    <div class="popup-content">
        <h2>Edit Role</h2>
        <form enctype="multipart/form-data" @submit.prevent="submitForm" id="edit-role-form">
            <label for="name">Name</label>
            <input type="text" v-model="formData.name" placeholder="Role name">

            <button type="submit" class="btn-add-primary">Save</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    name: 'EditRole',
    props: {
        roleId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            formData: {
                name: '',
            }
        };
    },
    setup() {
        const success = () => {
            toast("Update role successfully !", {
                autoClose: 3000,
                type: "success"
            });
        }
        return { success };
    },
    mounted() {
        this.fetchRole(this.roleId);
    },
    methods: {
        submitForm() {
            console.log(this.ser)
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.post(`${apiUrl}/roles/update/${this.roleId}`, this.formData)
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
                    console.error('Error updating service:', error);
                });
        },
        fetchRole(item) {
            console.log("heheh: " + item)
            const apiUrl = process.env.VUE_APP_API_URL;
            axios.get(`${apiUrl}/roles/${item}`)
                .then(response => {
                    const responseData = response.data;
                    if (responseData) {
                        this.formData.name = responseData.name;
                    }
                })
                .catch(error => {
                    console.error('Error fetching service data:', error);
                });
        }
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

#edit-role-form {
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
}
</style>
