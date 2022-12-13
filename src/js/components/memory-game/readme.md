# memory-game component

The memory-game component is a web component used to play memory.

## Installation

Use npm to install dependencies.

```bash
npm i
```

## Usage
This component is dependant on the memory-card component.
```javascript
import '<path>/memory-game/
```
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
Once in the dom, simply try and match the different characters with eachother.