<template>
    <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <template v-if="totalPages > 0">
            <div v-for="page in totalPages" :key="page">
                <button @click="goToPage(page)" :class="{ 'active': currentPage === page }">{{ page }}</button>
            </div>
        </template>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
</template>

<script>
export default {
    props: ['currentPage', 'totalPages'],
    methods: {
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.$emit('nextPage');
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.$emit('prevPage');
            }
        },
        goToPage(page) {
            if (page !== this.currentPage) {
                this.$emit('goToPage', page);
            }
            console.log(page);
        }
    }
}
</script>

<style scoped>
.pagination {
    margin: 20px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pagination button {
    margin: 0 5px;
    padding: 5px 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    cursor: pointer;
}

.pagination button.active {
    background-color: #007bff;
    color: #fff;
}

.pagination button:disabled {
    /* opacity: 0.5; */
    cursor: not-allowed;
}
</style>
