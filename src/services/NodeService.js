export const NodeService = {

    getTreeNodes() {
        return this.getTrees().then((trees) => {
            return trees.map(tree => ({
                key: tree.treeId,
                label: tree.name,
                data: tree,
                type: "root",
                leaf: false,
                path: "/tree/" + tree.treeId,
                ancestors: [],
                children: tree.groups?.map(group => ({
                    key: group.treeGroupId,
                    label: group.name,
                    data: group,
                    type: "group",
                    leaf: false,
                    path: "/tree/" + tree.treeId + "/tg/65e0daee-c7bf-4201-a7c9-5ea53b9745bb/" + group.treeGroupId,
                    ancestors: [tree.treeId],
                }))
            }));
        });
    },

    getTreeElementsNodes(node) {
        return this.getTreeElements().then(({ resultList }) => {
            return resultList.map(element => ({
                key: element.treeElementId,
                label: element.name,
                data: element,
                type: "element",
                leaf: false,
                path: "/tree/" + node.ancestors[0] + "/te/" + node.data.treeGroupId + "/" + element.treeElementId,
                ancestors: [...node.ancestors, node.data.treeGroupId],
            }));
        });
    },

    getTrees() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve([
                    {
                        "treeId": "580c77d9-e1d1-4448-b978-18446ba5be7a",
                        "name": "BMW Advantage default",
                        "customerId": "bmwadvantage",
                        "groups": [
                            {
                                "treeGroupId": "7b870267-9fbb-4315-8c2c-80f6ae7df766",
                                "name": "Environment",
                                "slas": [],
                                "filter": {},
                                "groups": [],
                                "groupBy": "environment",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            }
                        ],
                        "sharedWith": [
                            1226
                        ]
                    },
                    {
                        "treeId": "96c85ba4-e797-487b-a326-d7bf47a84434",
                        "name": "MEWA Textil-Service AG und Co. Management OHG",
                        "customerId": "mewa",
                        "groups": [
                            {
                                "treeGroupId": "391416c7-545e-485f-9768-926174d1eac1",
                                "name": "Environment",
                                "slas": [],
                                "filter": {},
                                "groups": [],
                                "groupBy": "environment",
                                "linkedPages": [
                                    {
                                        "pageType": "REPORT_TEMPLATE",
                                        "id": "FSCTunsBzAVNx7eVkne7"
                                    }
                                ],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            }
                        ],
                        "sharedWith": [
                            1071,
                            1074,
                            1289,
                            1291
                        ]
                    },
                    {
                        "treeId": "40a1cba8-e56b-4062-bf2b-8124b3c21906",
                        "name": "TK SEAG PSSNEU",
                        "customerId": "tkseagpssneu",
                        "groups": [
                            {
                                "treeGroupId": "2c55f3b0-a6ca-4fa0-8f65-369f7003cf1a",
                                "name": "Environment",
                                "slas": [],
                                "filter": {},
                                "groups": [],
                                "groupBy": "environment",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            }
                        ],
                        "sharedWith": [
                            1164,
                            1167
                        ]
                    },
                    {
                        "treeId": "53e7121c-f37f-4057-a16d-7964cfbcbb94",
                        "name": "Vaillant availability by CI-Groups",
                        "customerId": "vaillant",
                        "groups": [
                            {
                                "treeGroupId": "84fb56e1-cb0d-4256-bdf2-09d7e53cabc2",
                                "name": "Vaillant_Messaging",
                                "slas": [],
                                "filter": {
                                    "instanceType": [
                                        "hbmon"
                                    ],
                                    "esl_group_72092_name": [
                                        "Vaillant_Messaging"
                                    ]
                                },
                                "groups": [],
                                "groupBy": "esl_hostname",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            },
                            {
                                "treeGroupId": "f2cda1ea-f57b-44de-9620-fe740d34fb42",
                                "name": "Vaillant_Exchange",
                                "slas": [],
                                "filter": {
                                    "esl_group_72091_name": [
                                        "Vaillant_Exchange"
                                    ],
                                    "instanceType": [
                                        "hbmon"
                                    ]
                                },
                                "groups": [],
                                "groupBy": "esl_hostname",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            },
                            {
                                "treeGroupId": "c625ba1e-92f2-4e55-a23a-5241457dbab0",
                                "name": "Vaillant_European_Server",
                                "slas": [],
                                "filter": {
                                    "instanceType": [
                                        "hbmon"
                                    ],
                                    "esl_group_72090_name": [
                                        "Vaillant_European_Server"
                                    ]
                                },
                                "groups": [],
                                "groupBy": "esl_hostname",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            },
                            {
                                "treeGroupId": "6b0bdec9-330b-460a-9587-c1411e5ed5a6",
                                "name": "Vaillant_Small_Sites",
                                "slas": [],
                                "filter": {
                                    "instanceType": [
                                        "hbmon"
                                    ],
                                    "esl_group_72093_name": [
                                        "Vaillant_Small_Sites"
                                    ]
                                },
                                "groups": [],
                                "groupBy": "esl_hostname",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            },
                            {
                                "treeGroupId": "db8cc278-5cab-43e7-b796-364d80b7b7ed",
                                "name": "Vaillant_ERP",
                                "slas": [],
                                "filter": {
                                    "instanceType": [
                                        "hbmon"
                                    ],
                                    "esl_group_72089_name": [
                                        "Vaillant_ERP"
                                    ]
                                },
                                "groups": [],
                                "groupBy": "esl_hostname",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            },
                            {
                                "treeGroupId": "c934a605-6b71-4430-bf35-0b01b84d00bd",
                                "name": "Vaillant_DMS",
                                "slas": [],
                                "filter": {
                                    "instanceType": [
                                        "hbmon"
                                    ],
                                    "esl_group_72088_name": [
                                        "Vaillant_DMS"
                                    ]
                                },
                                "groups": [],
                                "groupBy": "esl_hostname",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            },
                            {
                                "treeGroupId": "c318aab1-fff4-41a3-acb6-fa50568a6b09",
                                "name": "Vaillant_CntrSys",
                                "slas": [],
                                "filter": {
                                    "esl_group_72087_name": [
                                        "Vaillant_CntrSys"
                                    ],
                                    "instanceType": [
                                        "hbmon"
                                    ]
                                },
                                "groups": [],
                                "groupBy": "esl_hostname",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            },
                            {
                                "treeGroupId": "07c4d0c8-3923-4cf2-9769-6fade239df4d",
                                "name": "Vaillant",
                                "slas": [],
                                "filter": {
                                    "esl_group_72087_name": [
                                        "Vaillant"
                                    ],
                                    "instanceType": [
                                        "hbmon"
                                    ]
                                },
                                "groups": [],
                                "groupBy": "esl_hostname",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            }
                        ],
                        "sharedWith": [
                            897
                        ]
                    },
                    {
                        "treeId": "cd457af7-347f-433f-bc9b-51e6e5cc4aae",
                        "name": "SAP UC",
                        "customerId": "sapuc",
                        "groups": [
                            {
                                "treeGroupId": "ab2a0ebd-817d-417c-aa48-2fa157f61f04",
                                "name": "Environment",
                                "slas": [],
                                "filter": {},
                                "groups": [],
                                "groupBy": "environment",
                                "linkedPages": [
                                    {
                                        "pageType": "REPORT_TEMPLATE",
                                        "id": "kLxIU3sB19ESeICFL9sa"
                                    },
                                    {
                                        "pageType": "REPORT_TEMPLATE",
                                        "id": "RLyEunsB19ESeICFbOK5"
                                    }
                                ],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            }
                        ],
                        "sharedWith": [
                            1267,
                            1269
                        ]
                    },
                    {
                        "treeId": "d582fe3d-4af0-4472-b7ed-f5fd712a9eab",
                        "name": "TESTTREE",
                        "customerId": "test_customer",
                        "groups": [
                            {
                                "treeGroupId": "ce82ad63-8f13-4d31-bd89-8a15627e987d",
                                "name": "TestGroup1",
                                "slas": [],
                                "filter": {},
                                "groups": [],
                                "groupBy": "testgroup1",
                                "linkedPages": [],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            }
                        ],
                        "sharedWith": []
                    },
                    {
                        "treeId": "3e543067-496e-40e0-90fa-095f0b40d62b",
                        "name": "DXC Tree Default",
                        "customerId": "hp",
                        "groups": [
                            {
                                "treeGroupId": "3badf8a5-0391-441a-92ca-620aa320c48b",
                                "name": "Environment",
                                "slas": [],
                                "filter": {},
                                "groups": [],
                                "groupBy": "environment",
                                "linkedPages": [
                                    {
                                        "pageType": "REPORT_TEMPLATE",
                                        "id": "5LQNiG4B6eLnfDexS71O"
                                    }
                                ],
                                "statusCalculation": {
                                    "calculationType": "redundant",
                                    "percentage": 1.0
                                }
                            }
                        ],
                        "sharedWith": [
                            242
                        ]
                    }
                ]);
            }, 1000)
        });
    },

    getTreeElements(treeId, parentTreeElementId, groupId) { 
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    "exactMatch": true,
                    "totalResults": 3,
                    "limit": 3,
                    "resultList": [
                        {
                            "status": "error",
                            "name": "Prod Servers Unix",
                            "treeElementId": "0c8d3749-579e-3f79-895c-58351e079cf7",
                            "treeId": "580c77d9-e1d1-4448-b978-18446ba5be7a",
                            "groupStatusSummary": [
                                {
                                    "treeGroupId": "b0f1c9d3-3265-4cb9-9641-27d7e092c92a",
                                    "name": "Service",
                                    "summary": {
                                        "ok": 533,
                                        "warning": 9,
                                        "error": 28,
                                        "maintenance": 0,
                                        "disabled": 2
                                    }
                                }
                            ]
                        },
                        {
                            "name": "Prod Servers Windows",
                            "treeElementId": "530568cd-d69f-3910-b92d-790fa8977166",
                            "treeId": "580c77d9-e1d1-4448-b978-18446ba5be7a",
                            "groupStatusSummary": [
                                {
                                    "treeGroupId": "b0f1c9d3-3265-4cb9-9641-27d7e092c92a",
                                    "name": "Service",
                                    "summary": {
                                        "ok": 25,
                                        "warning": 0,
                                        "error": 0,
                                        "maintenance": 0,
                                        "disabled": 0
                                    }
                                }
                            ]
                        },
                        {
                            "status": "ok",
                            "name": "SSD Infrastructure",
                            "treeElementId": "dfdbb003-81fa-3441-bff0-b6be969ecff0",
                            "treeId": "580c77d9-e1d1-4448-b978-18446ba5be7a",
                            "groupStatusSummary": [
                                {
                                    "treeGroupId": "b0f1c9d3-3265-4cb9-9641-27d7e092c92a",
                                    "name": "Service",
                                    "summary": {
                                        "ok": 3,
                                        "warning": 0,
                                        "error": 0,
                                        "maintenance": 0,
                                        "disabled": 0
                                    }
                                }
                            ]
                        }
                    ]
                });
            }, 2000)
        });
    }
};