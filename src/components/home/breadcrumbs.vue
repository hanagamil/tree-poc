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

<script lang="ts">
    import { Vue } from "vue-class-component";
    // import { ref, onMounted, computed } from 'vue';
    import { getIconFromEventType } from "../../common/constants";
    import EventBus from "../../common/eventBus";

    export default class Breadcrumbs extends Vue {
      public items = [];
      public getIconFromEventType = getIconFromEventType;

      public mounted() {
        EventBus.$on("breadcrumb-items-update", (updatedItems) => {
              this.items = updatedItems
            });
      }

      // onMounted(() => {
      //     EventBus.$on("breadcrumb-items-update", (updatedItems) => {
      //         items.value = updatedItems
      //       });
      // });

      public get breadcrumbItems() {
          return this.items.map((item) => ({
              text: item.label ?? "",
              status: item.data.status
          }));
      };

      // const breadcrumbItems = computed(() => {
      //     return items.value.map((item) => ({
      //         text: item.label ?? "",
      //         status: item.data.status
      //     }));
      // });

      public breadcrumbClicked(index) {
          EventBus.$emit("breadcrumb-item-clicked", this.items[index]);
      }
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