# chat-app

An application that enables chatting through a specific web socket.

## Example

```html
<app-dock></app-dock>
```
## Attributes
### channel
The channel on which to listen for messages, if 'broadcast' the channel will not be set at all.
Possible channels are broadcast, study and gaming.

## Events
#### keydown
When pressing enter in the textarea, the message will be submitted by automatically clicking the send button.
#### submit
If event target is the username area, the username will be saved to local storage. If the event target is the message area the message will be sent.