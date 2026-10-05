import {cards,cardArt,findCard,heroes,heroIds} from './cards'
import type {HeroId,Card,Effect} from './cards'
export {cards,cardArt,findCard,heroes,heroIds}
export type {HeroId}
export type Unit={uid:string;card:string;attack:number;health:number;maxHealth:number;ready:boolean;shield:boolean;frozen:boolean}
export type Player={id:string;name:string;hero:HeroId;hp:number;armor:number;mana:number;maxMana:number;hand:string[];units:Unit[];fatigue:number;power:boolean}
export type State={rev:number;phase:'waiting'|'battle'|'done';turn:number;round:number;players:Player[];log:string[];winner:string;deadline:number;pile:string[]}
export type View=Omit<State,'players'|'pile'>&{pileCount:number}&{players:(Omit<Player,'hand'>&{hand:string[];handCount:number})[]}
export type Action={type:'start'|'end'|'play'|'attack'|'power'|'class';rev:number;hero?:HeroId;card?:number;position?:number;unit?:string;target?:string;targetUnit?:string}
export const fresh=():State=>({rev:0,phase:'waiting',turn:0,round:0,players:[],log:[],winner:'',deadline:0,pile:[]})
function shuffled<T>(items:T[]){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j]!,a[i]!]}return a}
export function createPlayers(members:{id:string;name:string;hero?:HeroId}[]):Player[]{return members.map((m,i)=>{const hero=m.hero&&heroIds.includes(m.hero)?m.hero:heroIds[i%4]!;return {id:m.id,name:m.name,hero,hp:30,armor:0,mana:0,maxMana:0,hand:[],units:[],fatigue:0,power:false}})}
function hurtHero(p:Player,n:number){const absorbed=Math.min(p.armor,n);p.armor-=absorbed;p.hp-=n-absorbed}
function hurtUnit(u:Unit,n:number){if(n<=0)return;if(u.shield){u.shield=false;return}u.health-=n}
function draw(s:State,p:Player,n=1){for(let i=0;i<n;i++){const c=s.pile.pop();if(!c){p.fatigue++;hurtHero(p,p.fatigue)}else if(p.hand.length<10)p.hand.push(c)}}
function summon(p:Player,c:Card,position=p.units.length){if(p.units.length>=5)return;p.units.splice(position,0,{uid:crypto.randomUUID(),card:c.id,attack:c.attack,health:c.health,maxHealth:c.health,ready:c.trait==='charge',shield:!!c.shield,frozen:false})}
function effect(s:State,p:Player,kind:Effect,n:number){if(kind==='draw')draw(s,p,n);if(kind==='heal')p.hp=Math.min(30,p.hp+n);if(kind==='armor')p.armor+=n;if(kind==='summon')for(let i=0;i<n;i++)summon(p,findCard('sprite'));if(kind==='damage'){const t=s.players.filter(t=>t.id!==p.id&&t.hp>0).sort((a,b)=>a.hp-b.hp)[0];if(t)hurtHero(t,n)}}
function beginTurn(s:State){const p=s.players[s.turn]!;p.maxMana=Math.min(10,p.maxMana+1);p.mana=p.maxMana;p.power=false;p.units.forEach(u=>{u.ready=!u.frozen;u.frozen=false});draw(s,p);s.deadline=Date.now()+60000}
function cleanup(s:State){for(let cycle=0;cycle<25;cycle++){const dead=s.players.flatMap(p=>p.units.filter(u=>u.health<=0||p.hp<=0).map(u=>({p,u})));if(!dead.length)break;s.players.forEach(p=>p.units=p.hp>0?p.units.filter(u=>u.health>0):[]);for(const {p,u}of dead){const c=findCard(u.card);if(p.hp>0&&c.death){effect(s,p,c.death,c.deathValue||1);s.log.unshift(`${p.name} 的${c.name}触发亡语`)}}}s.players.forEach(p=>{if(p.hp<=0){p.units=[]}});const alive=s.players.filter(p=>p.hp>0);if(alive.length<=1){s.phase='done';s.winner=alive[0]?.id||'';s.deadline=0;s.log.unshift(alive[0]?`${alive[0].name} 成为荒野之王`:'本局平局')}}
function next(s:State){for(let i=0;i<s.players.length;i++){s.turn=(s.turn+1)%s.players.length;if(s.turn===0)s.round++;if(s.players[s.turn]!.hp>0){beginTurn(s);cleanup(s);if(s.phase==='done'||s.players[s.turn]!.hp>0)return}}cleanup(s)}
export function view(s:State,id:string):View{const {pile,players,...publicState}=s;return {...publicState,pileCount:pile.length,players:players.map(p=>{const {hand,...rest}=p;return {...rest,units:p.units.map(u=>({...u})),hand:p.id===id?[...hand]:[],handCount:hand.length}})}}
export function apply(s:State,from:string,a:Action):string{
 if(a.rev!==s.rev)return '状态已更新，请重新操作'
 if(a.type==='class'){const p=s.players.find(p=>p.id===from);if(s.phase!=='waiting'||!p||!a.hero||!heroIds.includes(a.hero))return '仅可在开局前选择职业';p.hero=a.hero;s.rev++;return ''}
 if(a.type==='start'){if(s.phase!=='waiting'||(s.players.length<2||s.players.length>4)||!s.players.some(p=>p.id===from))return '需要 2–4 位玩家';s.players=createPlayers(s.players);s.pile=shuffled(cards.flatMap(c=>[c.id,c.id]));s.players.forEach(p=>draw(s,p,4));s.phase='battle';s.round=1;s.turn=0;beginTurn(s);s.log=[`${s.players.length} 位英雄踏入荒野`];s.rev++;return ''}
 const p=s.players[s.turn];if(s.phase!=='battle'||!p||p.id!==from||p.hp<=0)return '还没有轮到你'
 const target=s.players.find(t=>t.id===a.target&&t.hp>0),unit=target?.units.find(u=>u.uid===a.targetUnit)
 const validTarget=!!target&&(!a.targetUnit||!!unit),enemy=validTarget&&target!.id!==p.id
 if(a.type==='end'){next(s);s.rev++;return ''}
 if(a.type==='power'){if(p.power||p.mana<2)return '英雄技能需要 2 点法力，每回合一次';if(p.hero==='mage'&&!enemy||p.hero==='hunter'&&(!enemy||unit)||p.hero==='priest'&&!validTarget)return '请选择有效目标';p.mana-=2;p.power=true
 if(p.hero==='warrior')p.armor+=3
 if(p.hero==='mage'){if(unit)hurtUnit(unit,1);else hurtHero(target!,1)}
 if(p.hero==='hunter')hurtHero(target!,2)
 if(p.hero==='priest'){if(unit)unit.health=Math.min(unit.maxHealth,unit.health+3);else target!.hp=Math.min(30,target!.hp+3)}
 s.log.unshift(`${p.name} 使用${heroes[p.hero].power}`)}
 else if(a.type==='play'){if(!Number.isInteger(a.card)||a.card!<0||a.card!>=p.hand.length)return '请选择手牌';const c=findCard(p.hand[a.card!]!);if(p.mana<c.cost)return '法力不足';if(c.kind==='unit'&&p.units.length>=5)return '场上最多五个随从';if(c.kind==='unit'&&a.position!==undefined&&(!Number.isInteger(a.position)||a.position<0||a.position>p.units.length))return '请选择有效的召唤位置';if(c.kind==='damage'&&!enemy||c.kind==='freeze'&&(!enemy||!unit)||c.kind==='heal'&&!validTarget||c.kind==='buff'&&(!unit||target?.id!==p.id))return '请选择有效目标';p.mana-=c.cost;p.hand.splice(a.card!,1)
 if(c.kind==='unit'){summon(p,c,a.position);if(c.cry)effect(s,p,c.cry,c.cryValue||1)}
 if(c.kind==='damage'){if(unit)hurtUnit(unit,c.value);else hurtHero(target!,c.value)}
 if(c.kind==='heal'){if(unit)unit.health=Math.min(unit.maxHealth,unit.health+c.value);else target!.hp=Math.min(30,target!.hp+c.value)}
 if(c.kind==='draw')draw(s,p,c.value)
 if(c.kind==='armor')p.armor+=c.value
 if(c.kind==='buff'){unit!.attack+=c.value;unit!.health+=c.value;unit!.maxHealth+=c.value;if(c.id==='sanctify')unit!.shield=true}
 if(c.kind==='freeze')unit!.frozen=true
 if(c.kind==='area')s.players.filter(t=>t.id!==p.id&&t.hp>0).forEach(t=>t.units.forEach(u=>{hurtUnit(u,c.value);if(c.id==='blizzard')u.frozen=true}))
 s.log.unshift(`${p.name} 使用${c.name}`)}
 else if(a.type==='attack'){const attacker=p.units.find(u=>u.uid===a.unit);if(!enemy||!attacker?.ready||attacker.frozen)return '请选择可攻击的随从和敌方目标';if(target!.units.some(u=>findCard(u.card).trait==='taunt')&&(!unit||findCard(unit.card).trait!=='taunt'))return '先击败该玩家的嘲讽随从';attacker.ready=false
 if(unit){hurtUnit(unit,attacker.attack);hurtUnit(attacker,unit.attack)}else hurtHero(target!,attacker.attack)
 s.log.unshift(`${p.name} 指挥随从攻击 ${target!.name}`)}
 else return '未知操作'
 cleanup(s);if(s.phase==='battle'&&s.players[s.turn]!.hp<=0)next(s);s.log=s.log.slice(0,12);s.rev++;return ''
}
export function botAction(s:State):Action{const p=s.players[s.turn]!,t=s.players.filter(x=>x.id!==p.id&&x.hp>0).sort((a,b)=>a.hp-b.hp)[0],base={rev:s.rev};if(!t)return {...base,type:'end'};const guard=t.units.find(u=>findCard(u.card).trait==='taunt'),u=p.units.find(x=>x.ready&&!x.frozen);if(u)return {...base,type:'attack',unit:u.uid,target:t.id,targetUnit:guard?.uid}
 const i=p.hand.findIndex(id=>{const c=findCard(id);return c.cost<=p.mana&&(c.kind!=='unit'||p.units.length<5)&&(c.kind!=='heal'||p.hp<26)&&(c.kind!=='buff'||p.units.length>0)&&(c.kind!=='freeze'||t.units.some(u=>!u.frozen))&&(c.kind!=='area'||s.players.some(t=>t.id!==p.id&&t.units.length))});if(i>=0){const c=findCard(p.hand[i]!),own=c.kind==='heal'||c.kind==='buff';return {...base,type:'play',card:i,target:own?p.id:t.id,targetUnit:c.kind==='buff'?p.units[0]?.uid:c.kind==='freeze'?t.units.find(u=>!u.frozen)?.uid:c.kind==='damage'?guard?.uid:undefined}}
 if(p.mana>=2&&!p.power&&(p.hero!=='priest'||p.hp<30))return {...base,type:'power',target:p.hero==='priest'?p.id:t.id};return {...base,type:'end'}
}
