/* simple front-end state using localStorage */

const store = {
  get(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback; }catch{ return fallback; } },
  set(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
};

// --- seed demo data (once) ---
(function seed(){
  if(!store.get('users')) store.set('users', [
    {id:1, name:'Alex Chen', email:'alex@fuss.edu', password:'1234', credits:120},
    {id:2, name:'Sarah Johnson', email:'sarah@fuss.edu', password:'1234', credits:75}
  ]);
  if(!store.get('skills')) store.set('skills', [
    {id:101, title:'Python Programming', tags:['coding','python'], price:25, tutor:2},
    {id:102, title:'Spanish Conversation', tags:['language'], price:20, tutor:2},
    {id:103, title:'Graphic Design Basics', tags:['design'], price:30, tutor:2}
  ]);
  if(!store.get('messages')) store.set('messages', [
    {id:1, from:2, to:1, text:'Hey Alex! OOP help?', ts:Date.now()-3600000},
    {id:2, from:1, to:2, text:'Sure, when are you free?', ts:Date.now()-3300000}
  ]);
  if(!store.get('orders')) store.set('orders', []);
  if(!store.get('reviews')) store.set('reviews', []);
})();

// --- auth helpers ---
export function currentUser(){ return store.get('currentUser', null); }
export function login(email, password){
  const u = store.get('users', []).find(x=>x.email===email && x.password===password);
  if(!u) return null; store.set('currentUser', u); return u;
}
export function register(name,email,password){
  const users=store.get('users',[]);
  if(users.some(u=>u.email===email)) throw new Error('Email already exists');
  const u={id:Date.now(), name, email, password, credits:100};
  users.push(u); store.set('users',users); store.set('currentUser',u); return u;
}
export function logout(){ localStorage.removeItem('currentUser'); }

// --- pages: small utilities each page can call ---
export const api = {
  skills: ()=>store.get('skills',[]),
  addOrder: (order)=>{ const list=store.get('orders',[]); list.push(order); store.set('orders',list); },
  myOrders: (uid)=>store.get('orders',[]).filter(o=>o.student===uid),
  sendMessage: (from,to,text)=>{ const list=store.get('messages',[]); list.push({id:Date.now(), from,to,text,ts:Date.now()}); store.set('messages',list); },
  thread:(a,b)=>store.get('messages',[]).filter(m=> (m.from===a&&m.to===b)||(m.from===b&&m.to===a)).sort((x,y)=>x.ts-y.ts),
  addReview:(r)=>{ const list=store.get('reviews',[]); list.push(r); store.set('reviews',list); },
  reviewsFor:(tutor)=>store.get('reviews',[]).filter(r=>r.tutor===tutor)
};

// --- small DOM helpers ---
export const $ = sel => document.querySelector(sel);
export const $$ = sel => [...document.querySelectorAll(sel)];
export function guardAuth(){
  if(!currentUser()){ location.href = '../pages/student_login.html'; }
}
export function setNav(){
  const u=currentUser();
  const navUser = document.getElementById('nav-user');
  if(navUser) navUser.textContent = u? u.name : 'Guest';
}
document.addEventListener('DOMContentLoaded', setNav);
