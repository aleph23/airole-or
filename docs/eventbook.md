You are designing a [theme] story that contains multiple events. Please plan [number] representative events for users to experience.
JSON 的 schema 如下：

{
"$schema": "http://json-schema.org/draft-07/schema#",
"type": "object",
"required": ["id", "meta", "events"],
"properties": {
"id": {
"type": "string",
"description": "Event book unique identifier, using UUID format"
},
"meta": {
"type": "object",
"required": ["name", "desp"],
"properties": {
"name": {
"type": "string",
"description": "Event book name"
},
"author": {
"type": "string",
"description": "Author name (optional)"
},
"author_link": {
"type": "string",
"description": "Author link, which can be a URL or email address (in http://、https://或mailto:开头）"
},
"desp": {
"type": "string",
"description": "Detailed description of event book"
}
}
},
"events": {
"type": "array",
"items": {
"type": "object",
"required": ["id", "number", "title", "desp", "unlockType", "completeType"],
"properties": {
"id": {
"type": "string",
"description": "Event unique identifier, using UUID format"
},
"number": {
"type": "integer",
"description": "Event number, usually a multiple of 10"
},
"title": {
"type": "string",
"description": "event title"
},
"desp": {
"type": "string",
"description": "Detailed description of the event"
},
"unlockType": {
"type": "string",
"enum": ["none", "events"],
"description": "Unlock type, optional value: 'none'(No need to unlock), 'events'(After other events are completed)"
},
"unlockCondition": {
"description": "Unlock conditions, content has different structures according to unlockType",
"oneOf": [
{
"type": "string",
"description": "当unlockType为'none'can be an empty string when"
},
{
"type": "string",
"description": "When unlockType is'events'is an array of event IDs represented by JSON strings"
}
]
},
"completeType": {
"type": "string",
"enum": ["none", "status", "prompt"],
"description": "Completion type, optional value: 'none'(done manually), 'status'(status value condition), 'prompt'(Prompt word recognition)"
},
"compeletCondition": {
"description": "Completion conditions, the content has different structures according to completeType",
"oneOf": [
{
"type": "string",
"description": "When completeType is'none'can be an empty string when"
},
{
"type": "string",
"description": "当completeType为'status'时，是JSON字符串表示的状态条件对象数组"
},
{
"type": "string",
"description": "当completeType为'prompt'时，是提示词字符串"
}
]
}
}
}
}
}
}

当completeType为'status'When , the schema of the state condition object array contained in the compeletCondition field is as follows:

{
"type": "array",
"items": {
"type": "object",
"required": ["key", "op"],
"properties": {
"key": {
"type": "string",
"description": "状态键名"
},
"op": {
"type": "string",
"enum": ["eq", "neq", "gt", "lt", "gte", "lte", "contains", "notcontains", "empty", "notempty"],
"description": "操作符"
},
"value": {
"description": "比较值，除了'empty'和'notempty'Required except for operators"
}
}
}
}

Output example:

{"id": "a9d937aa-cde1-49b8-9fba-6bdc188cccc8",
"meta": {"name": "love cycle",
"author": "Gemini",
"author_link": "",
"desp": "a series of love events"
},
"events": [{
"id": "c76675f9-d332-4f37-9a27-f3c08c8c2b57",
"number": 10,
"title": "meet",
"desp": "On the slope in front of the school, I met someone who was running hard , an accident caused them to bump into each other. After a series of interactions, the two left each other's contact information.",
"unlockType": "none",
"unlockCondition": "",
"completeType": "none",
"compeletCondition": ""
}]
}
The number is incremented by 10. id is random. New events are added to events. In desp, use refers to the user and refers to the role.
