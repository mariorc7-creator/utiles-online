#!/usr/bin/env node
// Schedule illustrated comic to the verified Instagram and X channels using public assets.
// Fail closed on missing assets, channel mismatch, API errors. No credentials printed.
import fs from 'node:fs/promises';
const api='https://api.buffer.com';
const token=process.env.BUFFER_API_KEY;
if(!token)throw Error('Missing BUFFER_API_KEY');
const directory=process.env.COMIC_PUBLIC_DIR;
const sha=process.env.COMIC_ASSET_SHA;
const comic=process.env.COMIC_ID;
if(!directory||!sha||!comic||!/^\d{4}-\d{2}-\d{2}$/.test(directory)||!/^[0-9a-f]{40}$/.test(sha))throw Error('Invalid post parameters');
const root='https://raw.githubusercontent.com/mariorc7-creator/utiles-online/'+sha+'/public/comics/'+directory;
const story=JSON.parse(await fs.readFile('comics-input/'+comic+'.json','utf8'));
// Same single 4-panel image in both social channels.
const assets=[{image:{url:root+'/'+comic+'-comic.jpg'}}];
const mediaCheck=await fetch(assets[0].image.url,{method:'HEAD'});
if(!mediaCheck.ok||!mediaCheck.headers.get('content-type')?.startsWith('image/'))throw Error('Comic image is not publicly accessible: '+mediaCheck.status);
async function gql(query,variables){
 const r=await fetch(api,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({query,variables})});
 if(!r.ok)throw Error('Buffer HTTP '+r.status);
 const j=await r.json();
 if(j.errors?.length)throw Error('Buffer graphql '+j.errors.map(e=>e.message).join('; '));
 return j.data;
}
const orgs=(await gql('query { account { organizations { id name } } }')).account?.organizations||[];
const matches=[];
for(const org of orgs){
 const channels=(await gql('query { channels(input:{organizationId:'+JSON.stringify(org.id)+'}) { id name displayName service } }')).channels||[];
 for(const channel of channels){
  if(/papelesdelbebe/i.test([channel.name,channel.displayName].join(' '))&&/instagram|twitter|^x$/i.test(channel.service||''))matches.push({...channel,organizationId:org.id});
 }
}
const ig=matches.filter(c=>/instagram/i.test(c.service));
const x=matches.filter(c=>/twitter|^x$/i.test(c.service));
if(ig.length!==1||x.length!==1)throw Error('Expected one IG and one X channel; IG='+ig.length+' X='+x.length);
// No self-tagging. Relevant topic hashtags, not an indiscriminate hashtag cloud.
const baseCaption=(story.caption||'').replace(/@papelesdelbebe/ig,'').replace(/#[\p{L}\p{N}_]+/gu,'').trim();
if(!baseCaption||baseCaption.length>185)throw Error('Invalid caption');
const hashtagsByTopic={
 guarderia:['#Crianza','#Guarderia','#HumorDePadres'],
 tramites:['#TramitesBebe','#Familias','#Crianza'],
 primerizos:['#PadresPrimerizos','#Crianza','#HumorDePadres']
};
const tags=hashtagsByTopic[comic]||['#Crianza','#Familias'];
const instagramCaption=baseCaption+'\n\n'+tags.join(' ');
const xCaption=baseCaption+'\n\n'+tags[0];
const createMutation='mutation ($input: CreatePostInput!) { createPost(input:$input) { ... on PostActionSuccess { post { id text dueAt } } ... on MutationError { message } } }';
for(const channel of [ig[0],x[0]]){
 const current=await gql('query { posts(first:100,input:{organizationId:'+JSON.stringify(channel.organizationId)+',filter:{channelIds:['+JSON.stringify(channel.id)+']}}) { edges { node { id text dueAt } } } }');
 const instagram=/instagram/i.test(channel.service);
 const caption=instagram?instagramCaption:xCaption;
 const duplicate=(current.posts?.edges||[]).some(edge=>edge.node?.text===caption);
 if(duplicate){console.log('Already present in Buffer '+channel.service+'; skipped');continue;}
 const input={text:caption,channelId:channel.id,schedulingType:'automatic',mode:'addToQueue',assets,aiAssisted:true};
 if(/instagram/i.test(channel.service))input.metadata={instagram:{type:'post',shouldShareToFeed:true,isAiGenerated:true}};
 const result=await gql(createMutation,{input});
 if(!result.createPost?.post?.id)throw Error('Buffer '+channel.service+' rejected: '+JSON.stringify(result.createPost));
 console.log('✅ Queued comic for '+channel.service+' id='+result.createPost.post.id+' dueAt='+result.createPost.post.dueAt);
}
