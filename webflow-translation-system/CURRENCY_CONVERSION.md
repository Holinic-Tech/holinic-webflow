# Currency Conversion for Translations

## Overview

When translating pages to European languages, all USD currency symbols should be converted to EUR.

## Automatic Conversion

The translation system now automatically converts currency during translation:

### What Gets Converted

- `$47` → `€47`
- `300 $` → `300€`
- `US$ 50` → `€50`
- `USD 100` → `100 EUR`
- "dollars" → "Euro"

### Supported Languages

Currency conversion applies to all European language translations:
- German (de)
- French (fr) 
- Spanish (es)
- Italian (it)
- Portuguese (pt)
- Dutch (nl)
- And other EU languages

## Manual Currency Update

If you need to update currency on an already translated page:

```bash
# Update currency on German page
node update-currency-symbols.js the-haircare-challenge

# Update currency on specific locale
node update-currency-symbols.js page-slug locale-id
```

## Implementation Details

### In Translation Instructions

The currency conversion is specified in:
1. `TRANSLATION_INSTRUCTIONS.md` - General guidelines
2. Individual translation scripts - Language-specific instructions

### Currency Patterns

The system recognizes these patterns:
- Leading dollar: `$100`
- Trailing dollar: `100 $`
- With spacing: `$ 100`
- USD variants: `US$`, `USD`
- Word forms: `dollars`, `Dollars`

### HTML Handling

The currency updater properly handles HTML content:
```html
<!-- Before -->
<div class="price">300 $</div>

<!-- After -->
<div class="price">300€</div>
```

## Testing

After translation, verify currency conversion:
1. Check pricing sections
2. Look for any remaining `$` symbols
3. Verify Euro symbol `€` displays correctly

## Troubleshooting

If currency doesn't update:
1. Run `node check-currency-nodes.js` to find currency nodes
2. Use `node update-currency-symbols.js` to fix manually
3. Check if content is in components (requires Webflow Designer edit)

## Future Enhancements

- Support for other currency conversions (GBP, CHF, etc.)
- Dynamic exchange rate adjustments
- Currency-specific formatting (€1.234,56 vs $1,234.56)