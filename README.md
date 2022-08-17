# jScript
A Javascript library for easier handling of DOM manipulation.

> Note: This library is always updating so there is no final product. This apply for older versions also.

Its just a cheap copy of Jquery, containing only DOM manipulation and basic javascript function.

## Setup
### CDN
Just drop one of these script tag inside your head tag.
```html
<!-- Development -->
<script src="https://path/to/jscript-v4.0.0.js"></script>

<!-- or Production -->
<script src="https://path/to/jscript-v4.0.0.min.js"></script>
```
### Variable
You can define jScript to another variable to avoid conflict.
```javascript
(function( baseName ) {
    // jScript code here...
}( '$' ));
// Change '$' to your desired variable
```
> Note: You will find '$' at the last line of jScript code.
## Usage
### Selector
> Assuming jScript is declared to '$' variable.

```javascript
// Select element via tagname
$('body');
//Select by class
$('.class');
// Select by ID
$('#elementID');
```

### Methods
#### addClass
Use `.addClass()` to pass class string (space separated).
```javascript
$('.elem').addClass('class-1 class-2 class-3');
```
