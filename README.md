# Video Service

A JSON RPC service that returns information about videos.

## Methods

### findVideo

Returns the Youtube id for a video matching the `title` and `artists`.

```js
findVideo(title, artist1, artist2, ...) #=> 'kJQP7kiw5Fk'

```

Request

```json
{
	"jsonrpc": "2.0",
	"method": "findVideo",
	"params": ["Despacito", "Luis Fonsi", "Daddy Yankee"],
	"id": 123
}
```

Response

```json
{
    "jsonrpc": "2.0",
    "id": 123,
    "result": {
        "video": {
            "id": "kJQP7kiw5Fk"
        },
        "stats": {
            "cacheHitRatio": 0.7142857142857143,
            "numberOfRequests": 7
        }
    }
}
```
