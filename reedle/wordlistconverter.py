import json
with open('7-letter-words.json','r') as f:
    data = json.load(f)
    words = ["\""+x['word']+"\"" for x in data]
    print('letters=['+','.join(words)+'];')