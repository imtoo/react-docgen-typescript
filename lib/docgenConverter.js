"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
function getDefaultValue(value) {
    return value ? { defaultValue: { computed: false, value: value } } : {};
}
function fixTypeWithArray(item) {
    if (item.array)
        return { name: 'arrayOf', value: { name: convertType(item.type).replace('[]', '') } };
    return { name: convertType(item.type) };
}
function normalizeProps(props, defaultProps) {
    return props.reduce(function (acc, i) {
        var typeValues = i.values
            ? { name: i.type, value: i.values.map(function (value) { return ({ name: value, value: value }); }) }
            : fixTypeWithArray(i);
        var item = __assign({}, getDefaultValue(defaultProps[i.name]), { description: i.comment, type: typeValues, required: i.isRequired });
        acc[i.name] = item;
        return acc;
    }, {});
}
// Bluekit knows:
// any
//   node
//   Children
//   ReactNode
//   ReactElement
//   string
//   bool
//   boolean
//   number
//   array
//   object
//   func
//   enum
//   shape
function convertType(type) {
    switch (type) {
        case 'void': return 'func';
        case '() => void': return 'func';
        case 'Object': return 'object';
    }
    return type;
}
function convertToDocgen(doc) {
    var classComment = doc.classes[0].comment;
    var docInterface = doc.interfaces[0];
    var props = docInterface ? normalizeProps(docInterface.members, doc.defaultProps) : {};
    return {
        description: classComment,
        props: props,
    };
}
exports.convertToDocgen = convertToDocgen;
/*
{
  "props": {
    "foo": {
      "type": {
        "name": "number"
      },
      "required": false,
      "description": "Description of prop \"foo\".",
      "defaultValue": {
        "value": "42",
        "computed": false
      }
    },
    "bar": {
      "type": {
        "name": "custom"
      },
      "required": false,
      "description": "Description of prop \"bar\" (a custom validation function).",
      "defaultValue": {
        "value": "21",
        "computed": false
      }
    },
    "baz": {
      "type": {
        "name": "union",
        "value": [
          {
            "name": "number"
          },
          {
            "name": "string"
          }
        ]
      },
      "required": false,
      "description": ""
    }
  },
  "description": "General component description."
}
*/
//# sourceMappingURL=docgenConverter.js.map