# comp-container
A draggable container for sub apps that allows the user to close the subapp and the container. It's also able to take options from subcomponents if a getter for options exist.

## Example

```html
<comp-container>
  <sub-component><sub-component>
</comp-container>
```
## Attributes
### channel
The channel on which to listen for messages, if 'broadcast' the channel will not be set at all.
Possible channels are broadcast, study and gaming.