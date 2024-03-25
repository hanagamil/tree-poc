<template>
  <tree :value="nodes" class="tree" loadingMode="icon" @node-expand="onNodeExpand">
    <template #togglericon="{ node, expanded }">
        <fai v-if="expanded && (!node.children || node.children.length > 0)" icon="angle-down" size="sm" />
        <fai v-else-if="!node.children || node.children.length > 0" icon="angle-right" size="sm" />
    </template>
    <template #root="{ node }">
        <fai class="tree-icon" icon="list" />
        <span class="tree-label">{{ node.data.name }}</span>
    </template>
    <template #group="{ node }">
        <fai class="tree-icon" :icon="['far', 'clone']" />
        <span class="tree-label">{{ node.data.name }}</span>
        <fai class="tree-icon filter-icon" icon="ellipsis-v" />
        <span v-if="node.children && node.children.length > 0" class="tree-num">{{"(#" + node.children.length + ")"}}</span>
        <i v-if="node.childrenLoading" class="pi pi-spin pi-spinner"></i>
    </template>
    <template #element="{ node }">
        <fai v-if="node.data.status" class="tree-icon status-icon" :class="`text-${node.data.status}`" icon="circle" />
        <fai v-else class="tree-icon" icon="list" />
        <span class="tree-label">{{ node.data.name }}</span>
        <i v-if="node.childrenLoading" class="pi pi-spin pi-spinner"></i>
    </template>
  </tree>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { NodeService } from '../../services/NodeService';

const nodes = ref(null);
const router = useRouter();

onMounted(() => {
    NodeService.getTreeNodes().then((data) => (nodes.value = data));
});

const onNodeExpand = (node) => {
    router.replace({ path: node.path });
    if (!node.children) {
        node.childrenLoading = true;
        if(node.type === "group") {
            NodeService.getTreeElementsNodes(node).then((data) => {
                node.children = data;
                node.childrenLoading = false;
            });
        } else if (node.type === "element") {
            setTimeout(() => {
                node.children = [];
                node.childrenLoading = false;
            }, 2000);
        }
    }
};
</script>

<style>
    .tree {
        font-size: 13px;
        color: black;
        --p-focus-ring-color: none;
    }
    .tree .p-tree-toggler {
        width: 18px;
        color: black;
        background: none;
    }
    .tree li {
        padding-left: 18px;
    }
    .tree li .tree-icon {
        margin: 0 5px;
    }
    .tree li .tree-icon.filter-icon {
        cursor: pointer;
        width: 15px;
        margin: 0;
    }
    .tree li .tree-icon.status-icon {
        font-size: 10px;
        vertical-align: baseline;
        width: 13px;
    }
    .tree li .tree-icon.status-icon.text-ok {
            color: #5cb85c;
    }
    .tree li .tree-icon.status-icon.text-error {
            color: #d9534f;
    }
    .tree li .tree-icon.status-icon.text-disabled {
        color: gray;
    }
    .tree li[aria-expanded="true"] > div .tree-label {
        color: #5f249f;
    }
    .tree li .tree-label {
        cursor: pointer;
        margin: 0 5px;
    }
    .tree li .pi-spinner {
        margin: 0 10px;
        font-size: 14px;
        vertical-align: bottom;
    }
    .tree li .tree-num {
        color: #666;
        margin: 0 5px;
    }
</style>