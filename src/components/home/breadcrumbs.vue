<template>
  <div class="breadcrumb">
    <div v-for="(breadcrumbItem, index) in breadcrumbItems" :key="index" class="breadcrumb-item" @click="breadcrumbClicked(index)">
      <span class="clickable-item">
        <fai
          v-if="breadcrumbItem.status"
          :class="`breadcrumb-icon text-${breadcrumbItem.status}`"
          :icon="getIconFromEventType(breadcrumbItem.status)"
          :title="breadcrumbItem.status"
        />
        <span> {{ breadcrumbItem.text }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
    import { ref, onMounted, computed } from 'vue';
    import { getIconFromEventType } from "../../common/constants";
    import EventBus from "../../common/eventBus";

    let items = ref([]);

    onMounted(() => {
        EventBus.$on("breadcrumb-items-update", (updatedItems) => {
            items.value = updatedItems
          });
    });

    const breadcrumbItems = computed(() => {
        return items.value.map((item) => ({
            text: item.data.name ?? "",
            status: item.data.status
        }));
    });

    const breadcrumbClicked = (index) => {
        EventBus.$emit("breadcrumb-item-clicked", items.value[index]);
    }
</script>

<style>
.breadcrumb .breadcrumb-item .clickable-item {
  cursor: pointer;
}
.breadcrumb .breadcrumb-icon {
  margin-right: 5px;
}
</style>