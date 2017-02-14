import { FileDoc } from './parser';

function normalizeProps(props: any): {} {
  return props.reduce((acc, i) => {
    const item: PropItem = {
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
  }, {})
}

export function convertToDocgen(doc: FileDoc) {
  const classComment = doc.classes[0].comment;
  const docInterface = doc.interfaces[0]
  const props = docInterface ? normalizeProps(docInterface.members) : {};

  return {
    description: classComment,
    props: props
  }
}

export interface PropItemType {
  name: string;
  value?: any;
}

export interface PropItem {
  required: boolean;
  type: PropItemType;
  description: string;
  defaultValue: any;
}

export interface PropsObject {
  [key: string]: PropItem;
}

export interface Docgen {
  description: string;
  props: PropsObject;
}

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
