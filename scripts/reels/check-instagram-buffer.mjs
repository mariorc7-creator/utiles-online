#!/usr/bin/env node
// Comprobación de conexión Instagram en Buffer. Solo lectura; nunca publica.
const token=process.env.BUFFER_API_KEY;
if(!token)throw Error('Falta BUFFER_API_KEY');
async function gql(query){
 const r=await fetch('https://api.buffer.com',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({query})});
 if(!r.ok)throw Error('Buffer HTTP '+r.status);
 const j=await r.json();
 if(j.errors?.length)throw Error(j.errors.map(x=>x.message).join('; '));
 return j.data;
}
const orgs=(await gql('query { account { organizations { id name } } }')).account?.organizations||[];
let candidates=[];
for(const o of orgs){
 const channels=(await gql('query { channels(input:{organizationId:'+JSON.stringify(o.id)+'}) { id name displayName service } }')).channels||[];
 candidates.push(...channels.filter(c=>/instagram/i.test(c.service||'')&&/papelesdelbebe/i.test([c.name,c.displayName].join(' '))));
}
if(candidates.length!==1)throw Error('Se esperaba Instagram @papelesdelbebe (1 canal); encontrados: '+candidates.length);
console.log('✅ Instagram conectado a Buffer: '+candidates[0].displayName+' ('+candidates[0].service+')');
console.log('✅ Verificación de solo lectura terminada. Ningún Reel publicado ni programado.');
