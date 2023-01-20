<template>
    <div class="table">
        <h1>Table Heading</h1>


        <div class="data-type">
            <div class="type-all">
                <ul>
                    <li :class="selectedCategory == 'all' ? 'activecat' : 'inactivecat'" @click="categoryChange('all')">
                        All
                    </li>
                    <li :class="selectedCategory == 'paid' ? 'activecat' : 'inactivecat'"
                        @click="categoryChange('paid')">
                        Paid
                    </li>
                    <li :class="selectedCategory == 'unpaid' ? 'activecat' : 'inactivecat'"
                        @click="categoryChange('unpaid')">
                        Unpaid
                    </li>
                    <li :class="selectedCategory == 'overdue' ? 'activecat' : 'inactivecat'"
                        @click="categoryChange('overdue')">
                        Overdue
                    </li>
                </ul>
            </div>

            <div class="total">Total payable amount: <span>$900.00</span> USD</div>
        </div>
        <div class="table-line"></div>

        <div>
            <div class="content-section">
                <div class="card-table">
                    <DataTable v-model:selection="selectedUsers" v-model:expandedRows="expandedRows" :value="users"
                        dataKey="id" v-model:filters="filters1" filterDisplay="menu" responsiveLayout="scroll"
                        :globalFilterFields="['name', 'category.name', 'amount.name', 'status']" :selectAll="selectAll">
                        <template #header>
                            <div
                                class="table-header-container flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                                <div>
                                    <Button type="button" class="p-button-outlined" @click="clearFilter1()"> <i
                                            class="pi pi-filter-fill"></i> Filter </Button>
                                    <span class="p-input-icon-left">
                                        <InputText class="search-filter pi pi-search" v-model="filters1['global'].value"
                                            placeholder="Search Users by Name, Email or Date" />
                                    </span>
                                </div>
                                <div>
                                    <button class="pay-button">PAY DUES</button>
                                </div>
                            </div>
                        </template>

                        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
                        <Column :expander="true" headerStyle="width: 3rem" />
                        <Column field="name" header="Name">
                            <template #body="slotProps">
                                <span>{{ slotProps.data.name }}</span> <br>
                                <span>{{ slotProps.data.email }}</span>
                            </template>
                        </Column>

                        <Column field="userStatus" header="User Status">
                            <template #body="slotProps">
                                <span>{{ slotProps.data.userAction }}</span> <br>
                                <span>{{ slotProps.data.userStatus }}</span>
                            </template>
                        </Column>
                        <Column field="paymentStatus" header="Payment Status">
                            <template #body="slotProps">
                                <div class="status-badge"
                                    :class="{ 'paid': slotProps.data.paymentStatus == 'Paid', 'overdue': slotProps.data.paymentStatus == 'Overdue', 'unpaid': slotProps.data.paymentStatus == 'Unpaid' }">
                                    <i class="pi pi-circle-fill"></i>
                                    {{ slotProps.data.paymentStatus }}
                                </div>
                                <span>{{ slotProps.data.paymentAction }}</span>
                            </template>
                        </Column>
                        <Column field="amount" header="Amount">
                            <template #body="slotProps">
                                <span>{{ slotProps.data.amount }}</span> <br>
                                <span>{{ slotProps.data.amountCurrency }}</span>
                            </template>
                        </Column>
                        <template #expansion="slotProps">
                            <div class="orders-subtable">
                                <DataTable :value="slotProps.data.orders" responsiveLayout="scroll">
                                    <Column field="date" header="Date"></Column>
                                    <Column field="userActivity" header="User Activity"></Column>
                                    <Column field="detail" header="Detail">
                                        <template #body="slotProps">
                                            <span>{{ slotProps.data.date }}</span>
                                            <span>{{ slotProps.data.userActivity }}</span>
                                            <span>{{ slotProps.data.Detail }}</span>
                                        </template>
                                    </Column>
                                </DataTable>
                            </div>
                        </template>
                    </DataTable>
                </div>
            </div>

        </div>

    </div>
</template>

<script>

import Users from './Users';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
export default {


    data() {
        return {
            selectedUsers: null,
            selectedData: [],
            selectedCategory: "",
            users: [],
            expandedRows: [],
            filters1: {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
                'name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                'category.name': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
                'amount.name': { value: null, matchMode: FilterMatchMode.IN },
                'status': { value: null, matchMode: FilterMatchMode.EQUALS },
                'verified': { value: null, matchMode: FilterMatchMode.EQUALS }
            },

        }
    },
    userService: null,
    created() {
        this.userService = new Users();
    },
    mounted() {
        this.selectedData = this.allData
        this.selectedCategory = "all"
        this.userService.getUsers().then(data => {
            this.users = data
        });
    },
    methods: {
        categoryChange(category) {
            this.selectedCategory = category
            if (category == "all") {
                this.selectedData = this.allData
            }
            else {
                this.selectedData = this.allData.filter(x => x.category == category)
            }

        },

        onRowExpand(event) {
            this.$toast.add({ severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000 });
        },
        onRowCollapse(event) {
            this.$toast.add({ severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000 });
        },
        expandAll() {
            this.expandedRows = this.products.filter(p => p.id);
            this.$toast.add({ severity: 'success', summary: 'All Rows Expanded', life: 3000 });
        },
        collapseAll() {
            this.expandedRows = null;
            this.$toast.add({ severity: 'success', summary: 'All Rows Collapsed', life: 3000 });
        },
        formatCurrency(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        },
        initFilters1() {
            this.filters1 = {
                'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
                'name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'category.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
                'amount.name': { value: null, matchMode: FilterMatchMode.IN },
                'date': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
                'balance': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                'status': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                'activity': { value: null, matchMode: FilterMatchMode.BETWEEN },
                'verified': { value: null, matchMode: FilterMatchMode.EQUALS }
            }

        }

    }
}
</script>


<style>
@import '../components/Table.css';
</style>