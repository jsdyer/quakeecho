export function communities(areas,term,min,sort){
  const query=term.trim().toLocaleLowerCase('en-CA');
  const key=sort==='intensity'?'intensity':sort==='distance'?'distance':'reports';
  const order=sort==='distance'?1:-1;
  return areas.filter(r=>r.reports>=min && [r.area,r.city,r.district].join(' ').toLocaleLowerCase('en-CA').includes(query))
    .sort((a,b)=>(a[key]-b[key])*order || a.area.localeCompare(b.area));
}
