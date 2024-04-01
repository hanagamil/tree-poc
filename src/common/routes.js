import Home from "../components/home/home.vue";

export default [
    { path: "/", name: "Home", component: Home },
    {
        path: "/tree/:treeId",
        name: "HomeTreeRoot",
        component: Home
    },
    {
      path: "/tree/:treeId/:target(te|tg)/:parentId/:id",
      name: "HomeTreeElementOrGroup",
      component: Home
    }
]