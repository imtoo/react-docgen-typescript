"use strict";
function normalizeProps(props) {
    return props.reduce(function (acc, i) {
        var item = {
            description: i.comment,
            type: { name: i.type },
            defaultValue: null,
            required: i.isRequired
        };
        if (i.values) {
            item.description = item.description + ' (one of the following:' + i.values.join(',') + ')';
        }
        acc[i.name] = item;
        return acc;
    }, {});
}
function convertToDocgen(doc) {
    var classComment = doc.classes[0].comment;
    var docInterface = doc.interfaces[0];
    var props = docInterface ? normalizeProps(docInterface.members) : {};
    return {
        description: classComment,
        props: props
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