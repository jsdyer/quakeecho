from datetime import datetime, timezone
import json
from pathlib import Path
from urllib.request import Request, urlopen
from time import sleep

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'web' / 'data'

def fetch(url):
    for attempt in range(3):
        try:
            with urlopen(Request(url, headers={'User-Agent':'CoolCode public science explorer (coolcode.ca)'}), timeout=90) as response:
                return response.read()
        except OSError:
            if attempt == 2:
                raise
            sleep(2 ** attempt)

def store(document):
    DATA.mkdir(exist_ok=True)
    document['retrieved'] = datetime.now(timezone.utc).date().isoformat()
    tmp = DATA / 'edition.tmp'
    tmp.write_text(json.dumps(document, ensure_ascii=False, allow_nan=False, separators=(',', ':'))+'\n')
    tmp.replace(DATA / 'edition.json')
