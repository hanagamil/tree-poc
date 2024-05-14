<template>
    <div v-if="mode !== 'resourceSelect'" class="flex flex-column align-items-center">
        <div v-if="!editMode && !addMode" class="flex flex-wrap gap-2 mb-4">
            <b-button type="button" @click="edit">Edit!</b-button>
            <b-button type="button" @click="add">Add!</b-button>

        </div>
        <div v-else class="flex flex-wrap gap-2 mb-4">
            <b-button type="button" @click="cancel">Cancel!</b-button>
            <b-button type="button" @click="Save">Save!</b-button>

        </div>
    </div>
    
    <vue-tree v-model:expandedKeys="expandedKeys" v-model:selectionKeys="selectionKeys" :value="filteredNodes" class="tree" loadingMode="icon"
        @node-expand="onNodeExpand" :expanded-keys="expandedKeys">
        <template #togglericon="{ node, expanded }">
            <fai v-if="expanded && (!node.children || node.children.length > 0)" icon="angle-down" size="sm" />
            <fai v-else-if="!node.children || node.children.length > 0" icon="angle-right" size="sm" />
        </template>
        <template #root="{ node }">
            <span class="tree-selectable" @click="(e) => onNodeClicked(node, e)">
                <fai class="tree-icon" icon="list" />
                <span class="tree-label">{{ node.label }}</span>
            </span>
            <span v-if="editMode || addMode">
                <fai class="tree-icon" icon="trash" @click="deleteNode" />
                <fai class="tree-icon" icon="plus" @click="addNode" />
            </span>
        </template>
        <template #group="{ node }">
            <span class="tree-selectable" @click="(e) => onNodeClicked(node, e)">
                <fai class="tree-icon" :icon="['far', 'clone']" />
                <span class="tree-label">{{ node.label }}</span>
            </span>
            <fai v-if="!node.filtered" class="tree-icon filter-icon" icon="ellipsis-v" @click="filterModal = !filterModal; openFilterModal(node)" />
            <fai v-if="node.filtered" class="tree-icon filter-icon" icon="filter" @click="filterModal = !filterModal; openFilterModal(node)" />
            <span v-if="node.children && node.children.length > 0" class="tree-num">{{ "(#" + node.children.length +
            ")" }}</span>
            <fai v-if="mode === 'resourceSelect'" class="tree-icon" icon="plus" @click="emit('add', node.data)" />
            <i v-if="node.childrenLoading" class="pi pi-spin pi-spinner"></i>
            <span v-if="editMode || addMode">
                <fai class="tree-icon" icon="trash" @click="deleteNode" />
                <fai class="tree-icon" icon="plus" @click="addNode" />
            </span>
        </template>
        <template #element="{ node }">
            <span class="tree-selectable" @click="(e) => onNodeClicked(node, e)">
                <fai v-if="node.data.status" class="tree-icon status-icon" :class="`text-${node.data.status}`"
                icon="circle" />
                <fai v-else class="tree-icon" icon="list" />
                <span class="tree-label">{{ node.label }}</span>
            </span>
            <fai v-if="mode === 'resourceSelect'" class="tree-icon" icon="plus" @click="emit('add', node.data)" />
            <i v-if="node.childrenLoading" class="pi pi-spin pi-spinner"></i>
            <span v-if="editMode || addMode">
                <fai class="tree-icon" icon="trash" @click="deleteNode" />
                <fai class="tree-icon" icon="plus" @click="addNode" />
            </span>
        </template>
    </vue-tree>

    <b-modal 
        v-model="filterModal" 
        size="lg" 
        ok-title="Apply"
        cancel-title="Reset"
        :title="filterGroupNode ? filterGroupNode.label : ''"
        @ok="applyFilter"
        @cancel="resetFilter"
    >
        <p class="my-2">Filter Modal</p>
    </b-modal>
</template>

<script lang="ts">
import { Vue, Component } from "vue-facing-decorator";
// import { Vue, Options } from "vue-class-component";
// import { ref, onMounted, defineProps, defineEmits, computed } from 'vue';
// import { useRouter, useRoute } from 'vue-router';
import { NodeService } from '../../services/NodeService';
import { ROOT_TREE_ELEMENT_ID } from "../../common/constants";
import EventBus from "../../common/eventBus";

@Component ({
    name: "Tree",
    props: {
        mode: {
            type: String
        },
        customerId: {
            type: String
        }
    }
})
export default class Tree extends Vue {

    // const props = defineProps(["mode", "customerId"]);
    // const emit = defineEmits(["add"]);

    public mode!: string;
    public customerId!: string;

    public nodes = null;
    // public router = useRouter();
    // public route = useRoute();
    public expandedKeys = {};
    public selectionKeys = {};
    public editMode = false;
    public addMode = false;
    public breadcrumbItems = [];
    public filterModal = false;
    public filterGroupNode = null;

    public mounted() {
        EventBus.$on("breadcrumb-item-clicked", this.breadcrumbItemClicked);
        this.loadTrees();
    }

    public get filteredNodes () {
        return ["view", "resourceSelect"].includes(this.mode) && this.customerId && this.customerId !== ""
        ? this.nodes.filter((node) => node.data.customerId === this.customerId)
        : this.nodes;
    }

    public updateBreadcrumbItems (node) {
        if (node) {
            this.breadcrumbItems = [];
            node.ancestors?.forEach(ancestor => {
                this.breadcrumbItems.push(ancestor);
            })
            this.breadcrumbItems.push(node);
            EventBus.$emit("breadcrumb-items-update", this.breadcrumbItems);
        }
    }

    public breadcrumbItemClicked (node) {
        this.onNodeClicked(node);
    }

    public loadTrees () {
        NodeService.getTreeNodes().then((data) => {
            this.nodes = data

            const { treeId, id, parentId, target } = this.$route.params;

            if (treeId && id && parentId && parentId !== ROOT_TREE_ELEMENT_ID) { // tree element or group & parent is not tree root
                NodeService.getTreeWithParentsNodes(
                    treeId,
                    target === "te" ? id : parentId,
                    target === "tg"
                ).then(treewithParents => {
                    this.nodes.splice(
                        this.nodes.findIndex((node) => node.key === treeId),
                        1,
                        treewithParents
                    );
                    this.openTreeItem(treeId, id, parentId);
                });
            } else if (treeId) { // tree root or group & parent is tree root
                this.selectionKeys = {};
                this.selectionKeys[treeId] = true;
                this.expandedKeys[treeId] = true;
                const selectedTree = this.nodes.find(node => node.key === treeId);
                this.updateBreadcrumbItems(selectedTree);
                if (id && parentId && parentId === ROOT_TREE_ELEMENT_ID) {
                    this.selectionKeys = {};
                    this.selectionKeys[id] = true;
                    this.expandedKeys[id] = true;
                    this.updateBreadcrumbItems(this.nodes.find(node => node.key === treeId));
                    const selectedGroup = selectedTree.children.find(child => child.key === id);
                    this.updateBreadcrumbItems(selectedGroup);
                }
            }
        });
    }

    public openTreeItem (treeId, id, parentId) {
        const expandNode = (node) => {
            if (node.key === id && node.ancestors.length > 0 && node.ancestors[node.ancestors.length - 1].key === parentId) {
                node.ancestors.forEach(ancestor => {
                    this.selectionKeys = {};
                    this.selectionKeys[node.key] = true;
                    this.expandedKeys[ancestor.key] = true;
                });
                this.expandedKeys[node.key] = true;
                this.updateBreadcrumbItems(node);
            } else if (node.children) {
                for (let child of node.children) {
                    expandNode(child);
                }
            }
        };
        const selectedTree = this.nodes.find(node => node.key === treeId);
        expandNode(selectedTree);
    }

    public openNode (node) {
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
    }

    public onNodeExpand (node) {
        this.selectionKeys = {};
        this.selectionKeys[node.key] = true;
        if(this.selectionKeys[node.key]) {
            this.openNode(node);
        }
    }

    public onNodeClicked (node, e) {
        if (e) {
            e.preventDefault();
            this.expandedKeys[node.key] = this.expandedKeys[node.key] ? !this.expandedKeys[node.key]: true;
            if(this.expandedKeys[node.key]) {
                this.openNode(node);
            }
        }
        this.selectionKeys = {};
        this.selectionKeys[node.key] = true;
        if (this.mode !== "resourceSelect") {
            this.$router.replace({ path: node.path });
            this.updateBreadcrumbItems(node);
        }
    }

    public edit () {
        // this.nodes[0].data.name = "Updated Node 1.1";
        const treeId = "580c77d9-e1d1-4448-b978-18446ba5be7a";
        NodeService.getTreeNodebyId(treeId).then((data) => {
            this.nodes = [data];
            this.editMode = true;
        });

    }

    public add () {
        this.addMode = true;
        this.nodes = [NodeService.getNewTreeNode()];
    }

    public cancel () {
        this.addMode = false;
        this.editMode = false;
        NodeService.getTreeNodes().then((data) => {
            this.nodes = data;
        })
    }

    public save () {
        this.addMode = false;
        this.editMode = false;
    }

    public deleteNode (e) {
        e.stopPropagation();
    }

    public addNode (e) {
        e.stopPropagation();
    }

    public openFilterModal (node) {
        this.filterGroupNode = node;
    }

    public applyFilter () {
        this.filterGroupNode.filtered = true;
    }

    public resetFilter () {
        this.filterGroupNode.filtered = false;
    }
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
    vertical-align: baseline;
}

.tree li .tree-num {
    color: #666;
    margin: 0 5px;
}
</style>