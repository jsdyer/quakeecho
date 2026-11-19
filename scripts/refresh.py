"""Pair a reviewed Canadian bulletin with a named USGS event and its DYFI product."""
import csv
from datetime import datetime, timezone
from io import StringIO
import json
from lxml import html
from source import fetch, store

CANADA='https://earthquakescanada.nrcan.gc.ca/recent/2025/20250221.2126/index-en.php'
US='https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/us7000pfbs.geojson'

def utc(milliseconds):
    return datetime.fromtimestamp(milliseconds/1000, timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z')

def bulletin(raw):
    tree = html.fromstring(raw)
    fields = {}
    for line in tree.xpath('//table//tr'):
        cells = [' '.join(' '.join(cell.itertext()).split()) for cell in line.xpath('./th|./td')]
        if len(cells)==2:
            fields[cells[0].rstrip(':')]=cells[1]
    magnitude,kind=fields['Magnitude'].split()
    event=datetime.strptime(fields['UT Date and Time:'.rstrip(':')],'%Y/%m/%d %H:%M:%S UT')
    if event.date().isoformat()!='2025-02-21':raise ValueError('Unexpected Canadian event')
    return dict(time=event.isoformat()+'Z',mag=float(magnitude),kind=kind,depth=float(fields['Depth'].split()[0]),latitude=fields['Latitude'],longitude=fields['Longitude'])

def collect():
    ca=bulletin(fetch(CANADA))
    event=json.loads(fetch(US));prop=event['properties']
    if event['id']!='us7000pfbs' or abs(prop['time']/1000-datetime.fromisoformat(ca['time']).timestamp())>20:
        raise ValueError('Review the event match')
    products=prop['products']
    # ComCat orders preferred products first; preserve their dates and agency codes.
    dyfi=products['dyfi'][0]
    urls=dyfi['contents']
    areas=[]
    area_url=urls['cdi_zip.txt']['url']
    for row in csv.reader(StringIO(fetch(area_url).decode('utf-8-sig'))):
        if not row or row[0].startswith('#'): continue
        areas.append(dict(area=row[0].replace('::',', '),city=row[8],district=row[9],intensity=float(row[1]),
                          reports=int(row[2]),distance=int(row[3]),suspect=row[6]=='1'))
    if len(areas)<5 or any(a['reports']<1 or not 0<=a['intensity']<=12 for a in areas):
        raise ValueError('Invalid community response table')
    origins=[]
    for product in products['origin']:
        p=product['properties']
        origins.append(dict(agency=product['source'],mag=p.get('magnitude'),kind=p.get('magnitude-type'),
                            depth=p['depth'],status=p.get('review-status'),updated=utc(product['updateTime'])))
    store(dict(coverage='Sunshine Coast · February 21, 2025',count=len(areas),canada=ca,
               us=dict(time=utc(prop['time']),mag=prop['mag'],kind=prop['magType'],depth=event['geometry']['coordinates'][2],
                       updated=utc(prop['updated'])),origins=origins,dyfiDate=utc(dyfi['updateTime']),
               reports=int(dyfi['properties']['num-responses']),areas=areas,canadaSource=CANADA,usSource=prop['url'],areaSource=area_url))

if __name__=='__main__':
    collect()
