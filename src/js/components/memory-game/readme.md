# memory-game

The memory-game component is a web component used to play memory.

## Usage
This component is dependant on the memory-card component.
```javascript
import '<path>/memory-card'
import '<path>/memory-game/'
```
## Attributes
#### size
To decide which size you'd like to play the game in you can set the attribute size.
You can choose between sm, md and lg.
```javascript
const memory = document.createElement('memory-game')
memory.setAttribute('size', 'lg')
```
or
```HTML
<memory-game size="lg"></memory-game>
```