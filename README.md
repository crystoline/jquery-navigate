# jQuery Navigate Plugin

A powerful jQuery plugin for handling AJAX navigation, form submissions, and browser history management with progress indicators and smooth page transitions.

## Features

✨ **AJAX Navigation** - Load content dynamically without full page reloads  
🔄 **Browser History Support** - Proper back/forward button functionality  
📝 **AJAX Form Handling** - Submit forms via AJAX with various attachment modes  
📊 **Progress Indicators** - Optional NProgress integration for visual feedback  
🎯 **Flexible Targeting** - Load content into any destination element  
🔗 **Hash-based Routing** - Supports URL hash navigation  
⚡ **Auto-reload Button** - Built-in reload functionality  
✅ **Select All Helper** - Checkbox select-all functionality included  

## Dependencies

- **jQuery** (required) - Tested with jQuery 1.7+
- **NProgress** (optional) - For progress indicators
- **Bootstrap** (optional) - For default styling of alerts and buttons

## Installation

1. Include jQuery in your HTML:

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
```

1. Optionally include NProgress for progress indicators:

```html
<link rel="stylesheet" href="https://unpkg.com/nprogress@0.2.0/nprogress.css">
<script src="https://unpkg.com/nprogress@0.2.0/nprogress.js"></script>
```

1. Include the Navigate plugin:

```html
<script src="navigate.js"></script>
```

1. Add a meta tag with your base URL:

```html
<meta name="base-url" content="https://yourdomain.com/">
```

## Basic Usage

### AJAX Links

Add the `data-ajax="true"` attribute to any anchor tag:

```html
<a href="/about" data-ajax="true">About</a>
```

Or wrap multiple links in a container with `data-ajax-links`:

```html
<div data-ajax-links>
  <a href="/page1">Page 1</a>
  <a href="/page2">Page 2</a>
  <a href="/page3">Page 3</a>
</div>
```

### AJAX Forms

Add the `data-ajax="true"` attribute to any form:

```html
<form action="/save" method="post" data-ajax="true">
  <input type="text" name="username">
  <button type="submit">Submit</button>
</form>
```

### Content Destination

By default, content loads into `#content`. Specify a custom destination:

```html
<a href="/sidebar" data-ajax="true" data-dst="#sidebar">Load in Sidebar</a>
```

## Advanced Features

### Attachment Modes

Control how content is inserted into the destination element:

```html
<!-- Replace existing content (default) -->
<a href="/content" data-ajax="true">Replace</a>

<!-- Prepend to existing content -->
<a href="/content" data-ajax="true" data-attach="prepend">Prepend</a>

<!-- Append to existing content -->
<a href="/content" data-ajax="true" data-attach="append">Append</a>
```

### Temporary Navigation

Prevent links from being added to browser history:

```html
<a href="/modal-content" data-ajax="true" data-temp="true">Modal</a>
```

### Alternative URL Attribute

Use `data-href` instead of `href`:

```html
<button data-href="/action" data-ajax="true">Click Me</button>
```

### Select All Checkboxes

Add the `selectAll` class to a checkbox in a table:

```html
<table>
  <thead>
    <tr>
      <th><input type="checkbox" class="selectAll"></th>
      <th>Item</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><input type="checkbox"></td>
      <td>Item 1</td>
    </tr>
    <tr>
      <td><input type="checkbox"></td>
      <td>Item 2</td>
    </tr>
  </tbody>
</table>
```

## Configuration

### NProgress Settings

The plugin automatically configures NProgress if available. Default settings:

```javascript
{
  easing: 'ease',
  speed: 50,
  showSpinner: true,
  completeDelay: 1000
}
```

### AJAX Settings

Default AJAX configuration:

```javascript
{
  timeout: 300000, // 5 minutes
  defaultDestination: '#content'
}
```

To modify these settings, edit the `CONFIG` object in `navigate.js`.

## HTML Attributes Reference

### For Links (`<a>` tags)

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-ajax` | Enable AJAX navigation | `data-ajax="true"` |
| `href` or `data-href` | Target URL | `href="/page"` |
| `data-dst` | Destination element selector | `data-dst="#sidebar"` |
| `data-temp` | Prevent history entry | `data-temp="true"` |
| `title` | Page title for history | `title="About Us"` |

### For Forms

| Attribute | Description | Example |
|-----------|-------------|---------|
| `data-ajax` | Enable AJAX submission | `data-ajax="true"` |
| `action` | Form submission URL | `action="/save"` |
| `method` | HTTP method | `method="post"` |
| `data-dst` | Destination element selector | `data-dst="#result"` |
| `data-attach` | Content attachment mode | `data-attach="append"` |
| `data-temp` | Prevent history entry (GET only) | `data-temp="true"` |

## Reload Button

A reload button is automatically added to the page. It allows users to refresh the current AJAX-loaded content:

```javascript
// The button is positioned at:
// - Top: 100px
// - Right: 10px
// - Z-index: 1040
```

To customize the button styling, modify the `createReloadButton()` function.

## Error Handling

The plugin handles AJAX errors gracefully:

- **401 Unauthorized**: Redirects to base URL (login page)
- **Other errors**: Displays a dismissible alert with error details
- All errors are logged to the browser console

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ IE 11+ (with polyfills for ES6 features)

## Example Setup

Complete HTML example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="base-url" content="https://example.com/">
  <title>My App</title>
  
  <!-- Bootstrap (optional) -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
  
  <!-- NProgress (optional) -->
  <link rel="stylesheet" href="https://unpkg.com/nprogress@0.2.0/nprogress.css">
  
  <!-- Font Awesome (optional, for icons) -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
  <!-- Navigation -->
  <nav>
    <ul data-ajax-links>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
  
  <!-- Content Container -->
  <div id="content">
    <!-- Content will be loaded here -->
  </div>
  
  <!-- Scripts -->
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <script src="https://unpkg.com/nprogress@0.2.0/nprogress.js"></script>
  <script src="navigate.js"></script>
</body>
</html>
```

## Server-Side Requirements

Your server should:

1. **Return HTML fragments** for AJAX requests (not full pages)
2. **Detect AJAX requests** using the `X-Requested-With` header
3. **Handle authentication** by returning 401 status codes when needed

### Example Server Response (PHP)

```php
<?php
// Check if AJAX request
$isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) 
       && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

if ($isAjax) {
    // Return only content fragment
    echo '<h1>About Us</h1><p>Welcome to our site!</p>';
} else {
    // Return full page
    include 'template.php';
}
?>
```

## Troubleshooting

### Content not loading?

1. Check browser console for errors
2. Verify the `base-url` meta tag is correct
3. Ensure destination element exists (e.g., `#content`)
4. Verify server is returning correct response

### History not working?

1. Ensure links don't have `data-temp="true"`
2. Check that `base-url` meta tag is set
3. Verify browser supports HTML5 History API

### Forms not submitting?

1. Verify `data-ajax="true"` is on the `<form>` tag
2. Check that form has a valid `action` attribute
3. Ensure destination element exists

## License

This plugin is provided as-is. Feel free to modify and use in your projects.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Changelog

### Version 2.0 (Current)

- Refactored to ES6+ syntax
- Improved error handling
- Better code organization
- Fixed bugs and typos
- Added comprehensive documentation
- Performance improvements

### Version 1.0 (Legacy)

- Initial release
- Basic AJAX navigation
- Form handling
- NProgress integration
