<template>
    <b-container>
        <b-row>
            <b-col lg="6">
                <div title="Select Customer" class="customer-dropdown w-100">
                    <b-dropdown :text="dropdownText">
                        <b-dropdown-item
                            v-for="option in customerDropdownOptions"
                            :key="option.value"
                            :title="option.text"
                            @click="customerDropDownClicked(option.value)"
                            >
                            {{ option.text }}
                        </b-dropdown-item>
                    </b-dropdown>
                </div>
                <tree mode="resourceSelect" :customerId="customerId" @add="addResourceItem" />
            </b-col>
            <b-col lg="6">
                <b-list-group>
                    <b-list-group-item
                        v-for="(s, i) in selectedRecourceItems"
                        :key="i"
                        class="d-flex justify-content-between align-items-center"
                    >
                        <span>{{s.name}}</span>
                        <b-button variant="secondary" @click="deleteResourceItem(i)">
                            <fai class="tree-icon" icon="trash" />
                        </b-button>
                    </b-list-group-item>
                </b-list-group>
            </b-col>
        </b-row>
    </b-container>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue';
import { isEqual } from "lodash";

const emit = defineEmits(["update-selected-items"]);
const props = defineProps(["selected"]);
const selectedRecourceItems = ref(props.selected);
const customerDropdownOptions = ref([
    { value: "", text: "--please select--"},
    { value: "bmwadvantage", text: "bmwadvantage" },
    { value: "mewa", text: "mewa" },
    { value: "tkseagpssneu", text: "tkseagpssneu" },
    { value: "vaillant", text: "vaillant" },
    { value: "sapuc", text: "sapuc" },
    { value: "test_customer", text: "test_customer" },
    { value: "hp", text: "hp" },
]);
const customerId = ref("");

const dropdownText = computed(() => {
    const selectedCustomer = customerDropdownOptions.value.find(option => option.value === customerId.value);
    return selectedCustomer ? selectedCustomer.text : "";
});

const addResourceItem = (item) => {
    if (selectedRecourceItems.value.find(selectedRecourceItem => isEqual(selectedRecourceItem, item))) {
        alert("already exists");
    } else {
        selectedRecourceItems.value.push(item);
    } 
};

const deleteResourceItem = (index) => {
    selectedRecourceItems.value.splice(index, 1);
    emit("update-selected-items", selectedRecourceItems);
};

const customerDropDownClicked = (value) => {
    customerId.value = value;
};

</script>