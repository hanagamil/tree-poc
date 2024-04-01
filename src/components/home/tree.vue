<template>

    <div class="flex flex-column align-items-cente">
        <div v-if="!editMode && !addMode" class="flex flex-wrap gap-2 mb-4">
            <button type="button" @click="edit">Edit!</button>
            <button type="button" @click="add">Add!</button>

        </div>
        <div v-else class="flex flex-wrap gap-2 mb-4">
            <button type="button" @click="cancel">Cancel!</button>
            <button type="button" @click="Save">Save!</button>

        </div>
    </div>
    
    <vue-tree v-model:expandedKeys="expandedKeys" v-model:selectionKeys="selectionKeys" :value="nodes" class="tree" loadingMode="icon"
        @node-expand="onNodeExpand" :expanded-keys="expandedKeys">
        <template #togglericon="{ node, expanded }">
            <fai v-if="expanded && (!node.children || node.children.length > 0)" icon="angle-down" size="sm" />
            <fai v-else-if="!node.children || node.children.length > 0" icon="angle-right" size="sm" />
        </template>
        <template #root="{ node }">
            <span class="tree-selectable" @click="(e) => onNodeClicked(node, e)">
                <fai class="tree-icon" icon="list" />
                <span class="tree-label">{{ node.data.name }}</span>
            </span>
            <div v-if="editMode || addMode">
                <fai class="tree-icon" icon="trash" @click="deleteNode" />
                <fai class="tree-icon" icon="plus" @click="addNode" />
            </div>
        </template>
        <template #group="{ node }">
            <span class="tree-selectable" @click="(e) => onNodeClicked(node, e)">
                <fai class="tree-icon" :icon="['far', 'clone']" />
                <span class="tree-label">{{ node.data.name }}</span>
            </span>
            <fai class="tree-icon filter-icon" icon="ellipsis-v" />
            <span v-if="node.children && node.children.length > 0" class="tree-num">{{ "(#" + node.children.length +
            ")" }}</span>
            <i v-if="node.childrenLoading" class="pi pi-spin pi-spinner"></i>
            <div v-if="editMode || addMode">
                <fai class="tree-icon" icon="trash" @click="deleteNode" />
                <fai class="tree-icon" icon="plus" @click="addNode" />
            </div>
        </template>
        <template #element="{ node }">
            <span class="tree-selectable" @click="(e) => onNodeClicked(node, e)">
                <fai v-if="node.data.status" class="tree-icon status-icon" :class="`text-${node.data.status}`"
                icon="circle" />
                <fai v-else class="tree-icon" icon="list" />
                <span class="tree-label">{{ node.data.name }}</span>
            </span>
            <i v-if="node.childrenLoading" class="pi pi-spin pi-spinner"></i>
            <div v-if="editMode || addMode">
                <fai class="tree-icon" icon="trash" @click="deleteNode" />
                <fai class="tree-icon" icon="plus" @click="addNode" />
            </div>
        </template>
    </vue-tree>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { NodeService } from '../../services/NodeService';
import { ROOT_TREE_ELEMENT_ID } from "../../common/constants";
import EventBus from "../../common/eventBus";

const nodes = ref(null);
const router = useRouter();
const route = useRoute();
const expandedKeys = ref({});
const selectionKeys = ref({});
const editMode = ref(false);
const addMode = ref(false);
const breadcrumbItems = ref([]);

onMounted(() => {
    EventBus.$on("breadcrumb-item-clicked", breadcrumbItemClicked);
    loadTrees();
});

const updateBreadcrumbItems = (node) => {
    if (node) {
        breadcrumbItems.value = [];
        node.ancestors.forEach(ancestor => {
            breadcrumbItems.value.push(ancestor);
        })
        breadcrumbItems.value.push(node);
        EventBus.$emit("breadcrumb-items-update", breadcrumbItems.value);
    }
};

const breadcrumbItemClicked = (node) => {
    onNodeClicked(node);
};

const loadTrees = () => {
    NodeService.getTreeNodes().then((data) => {
        nodes.value = data

        const { treeId, id, parentId, target } = route.params;

        if (treeId && id && parentId && parentId !== ROOT_TREE_ELEMENT_ID) { // tree element or group & parent is not tree root
            NodeService.getTreeWithParentsNodes(
                treeId,
                target === "te" ? id : parentId,
                target === "tg"
            ).then(treewithParents => {
                nodes.value.splice(
                    nodes.value.findIndex((node) => node.key === treeId),
                    1,
                    treewithParents
                );
                openTreeItem(treeId, id, parentId);
            });
        } else if (treeId) { // tree root or group & parent is tree root
            selectionKeys.value = {};
            selectionKeys.value[treeId] = true;
            expandedKeys.value[treeId] = true;
            const selectedTree = nodes.value.find(node => node.key === treeId);
            updateBreadcrumbItems(selectedTree);
            if (id && parentId && parentId === ROOT_TREE_ELEMENT_ID) {
                selectionKeys.value = {};
                selectionKeys.value[id] = true;
                expandedKeys.value[id] = true;
                updateBreadcrumbItems(nodes.value.find(node => node.key === treeId));
                const selectedGroup = selectedTree.children.find(child => child.key === id);
                updateBreadcrumbItems(selectedGroup);
            }
        }
    });
};

const openTreeItem = (treeId, id, parentId) => {
    const expandNode = (node) => {
        if (node.key === id && node.ancestors.length > 0 && node.ancestors[node.ancestors.length - 1].key === parentId) {
            node.ancestors.forEach(ancestor => {
                selectionKeys.value = {};
                selectionKeys.value[node.key] = true;
                expandedKeys.value[ancestor.key] = true;
            });
            expandedKeys.value[node.key] = true;
            updateBreadcrumbItems(node);
        } else if (node.children) {
            for (let child of node.children) {
                expandNode(child);
            }
        }
    };
    const selectedTree = nodes.value.find(node => node.key === treeId);
    expandNode(selectedTree);
}

const openNode = (node) => {
    if (!node.children) {
        node.childrenLoading = true;
        if (node.type === "group") {
            if (!node.children || node.children.length === 0) {
                NodeService.getTreeElementsNodes(node).then((data) => {
                    node.children = data;
                    node.childrenLoading = false;
                });
            }
        } else if (node.type === "element") {
            setTimeout(() => {
                node.children = [];
                node.childrenLoading = false;
            }, 2000);
        }
    }
};

const onNodeExpand = (node) => {
    selectionKeys.value = {};
    selectionKeys.value[node.key] = true;
    if(selectionKeys.value[node.key]) {
        openNode(node);
    }
};

const onNodeClicked = (node, e) => {
    if (e) {
        e.preventDefault();
        expandedKeys.value[node.key] = expandedKeys.value[node.key] ? !expandedKeys.value[node.key]: true;
        if(expandedKeys.value[node.key]) {
            openNode(node);
        }
    }
    router.replace({ path: node.path });
    selectionKeys.value = {};
    selectionKeys.value[node.key] = true;
    updateBreadcrumbItems(node);
};

const edit = () => {
    editMode.value = true;
    // console.log(node);
    nodes.value[0].data.name = "Updated Node 1.1";
    const treeId = "580c77d9-e1d1-4448-b978-18446ba5be7a";
    NodeService.getTreeNodesbyId(treeId).then((data) => {
        nodes.value = data;
        console.log(nodes.value);

    });

};

const add = () => {
    alert("add");
    addMode.value = true;
    let data = NodeService.getNewTreeNodes()
    nodes.value = data;
    console.log(nodes.value);
};

const cancel = () => {
    addMode.value = false;
    editMode.value = false;
    alert("cancle");
    NodeService.getTreeNodes().then((data) => {
        (nodes.value = data);
    })
};

const save = () => {
    addMode.value = false;
    editMode.value = false;
    alert("save");
}

const deleteNode = (e) => {
    e.stopPropagation();
    alert("delete");
}
const addNode = (e) => {
    e.stopPropagation();
    alert("add Node");
}

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
    cursor: pointer;
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

.tree li[aria-expanded="true"]>div .tree-selectable {
    color: #5f249f;
    cursor: pointer;
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