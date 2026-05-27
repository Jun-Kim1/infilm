import re

with open(r'c:\Users\user\Desktop\infilm\app.js', encoding='utf-8') as f:
    js = f.read()

# Check remaining hub keys
idx = js.find('hub.label')
if idx == -1:
    print('No hub.label found - EN already replaced')
else:
    print('hub.label found at:', idx)
    print('Context:', repr(js[idx:idx+400]))

# Also check for any remaining hub. keys
import re
matches = [(m.start(), m.group()) for m in re.finditer(r'"hub\.[^"]+?"', js)]
print('Remaining hub.* keys:', matches[:10])
