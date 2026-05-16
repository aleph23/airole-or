You are designing a [theme] story that contains multiple events. Please plan [number] representative events for users to experience. This is for JanitorAI and other frontends that support advanced lorebook functionality.
JSON of following schema:

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
"unlockType": {    # We need to change4 the name of this to 'triggerType'
"type": "string",
"enum": ["always-on", "keyword", "mes_number", "javascript"],
"description": "Trigger type, required value: \"always-on\", \"keyword\", \"mes_number\", \"javascript\"; 'always-on' means that the event is always triggered, 'keyword' means that the event is triggered when the user sends a message containing the keyword, 'mes_number' means that the event is triggered when the user reaches that message number from the starting point, 'javascript' means that the event is triggered by a snippet of javascript code that runs after each prompt."
},
"unlockCondition": {
"description": "Unlock conditions: Either the message number, the keywords, or the js codeblock.",
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
"completeType": { # This var should be eliminated.
"type": "string",
"enum": ["none", "status", "prompt"],
"description": "Completion type, optional value: 'none'(done manually), 'status'(status value condition), 'prompt'(Prompt word recognition)"
},
"compeletCondition": { # This var should be eliminated.
"description": "Completion conditions, the content has different structures according to completeType",
"oneOf": []
}
}
}
}
}
}

{
"type": "array",
"items": {
"type": "object",
"required": ["key", "op"],
"properties": {
"key": {
"type": "string",
"description": "Status key name"
},
"op": {
"type": "string",
"enum": ["eq", "neq", "gt", "lt", "gte", "lte", "contains", "notcontains", "empty", "notempty"],
"description": "Operator"
},
"value": {
"description": "Required except for 'empty' and 'notempty' operators"
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
