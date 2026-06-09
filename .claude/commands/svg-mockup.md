# Generate SVG UI Mockup

Create an SVG mockup of a UI panel/screen in VS Code dark theme style.

## Style guide:

### Colors:
- Background: `#1e1e1e` (main), `#252526` (header/surface), `#2d2d2d` (cards)
- Text: `#cccccc` (primary), `#888888` (muted/secondary)
- Border: `#333333`
- Accent blue: `#4285f4`
- Accent green: `#34a853`
- Accent yellow: `#fbbc05`
- Accent red: `#ea4335`
- Accent purple: `#7057ff`
- Accent orange: `#f78166`

### Elements:
- **Cards**: rounded rectangles (rx=6), #2d2d2d fill, #333 stroke
- **Badges**: small rounded pills with semi-transparent colored background
- **Avatars**: circles with initials, colored background, white text
- **Buttons**: rounded rectangle, #4285f4 fill for primary
- **Search boxes**: rounded rectangle, #3c3c3c fill, #555 border
- **Section headers**: uppercase, 10px, letter-spacing 0.5px, muted color
- **Aliases**: text in #4285f4 (clickable look)

### Typography:
- Font family: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Title: 14px bold
- Body: 12-13px
- Muted: 11px
- Badge: 10px bold

### Layout rules:
- 8px padding from edges
- 6-8px gap between cards
- 4px gap between inline elements
- Rounded corners: 6px for cards, 10px for badges, 50% for avatars

## Input needed:
- What panel/view to mock (chat, kanban, list, timeline, profile, etc.)
- Content to display (entries, messages, cards)
- Size (width x height)
- Interactive elements to show (buttons, inputs, clickable items)

## Output:
Write a single `.svg` file with inline styles, no external dependencies.
