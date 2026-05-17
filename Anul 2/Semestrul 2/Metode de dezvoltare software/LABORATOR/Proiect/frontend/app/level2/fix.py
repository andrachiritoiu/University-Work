import sys

with open(sys.argv[1], 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('\\`', '`')
content = content.replace('\\$', '$')

with open(sys.argv[1], 'w', encoding='utf-8') as f:
    f.write(content)
