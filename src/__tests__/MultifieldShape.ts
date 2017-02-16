export default {
    "delimiter": {
        "defaultValue": {
            "computed": false,
            "value": "'-'"
        },
        "description": "",
        "required": false,
        "type": {
            "name": "string"
        }
    },
    "error": {
        "defaultValue": {
            "computed": false,
            "value": "'Default error message'"
        },
        "description": "",
        "required": false,
        "type": {
            "name": "string"
        }
    },
    "fields": {
        "defaultValue": {
            "computed": false,
            "value": "[\n  {length: 1, type: 'text'},\n  {length: 1, type: 'text'},\n  {length: 1, type: 'text'},\n  {length: 1, type: 'text'}\n]"
        },
        "description": "",
        "required": false,
        "type": {
            "name": "arrayOf",
            "value": {
                "name": "shape",
                "value": {
                    "length": {
                        "name": "number",
                        "required": true
                    },
                    "placeholder": {
                        "name": "string",
                        "required": false
                    },
                    "type": {
                        "name": "enum",
                        "required": false,
                        "value": [
                            {
                                "computed": false,
                                "value": "'text'"
                            },
                            {
                                "computed": false,
                                "value": "'number'"
                            }
                        ]
                    }
                }
            }
        }
    },
    "inheritedStyle": {
        "description": "",
        "required": false,
        "type": {
            "name": "object"
        }
    },
    "label": {
        "description": "",
        "required": true,
        "type": {
            "name": "string"
        }
    },
    "name": {
        "description": "",
        "required": true,
        "type": {
            "name": "arrayOf",
            "value": {
                "name": "string",
            }
        }
    },
    "onBlur": {
        "description": "",
        "required": false,
        "type": {
            "name": "func"
        }
    },
    "onChange": {
        "description": "",
        "required": false,
        "type": {
            "name": "func"
        }
    },
    "value": {
        "description": "",
        "required": false,
        "type": {
            "name": "string"
        }
    }
}
