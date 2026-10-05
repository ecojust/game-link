export type HeroId='warrior'|'mage'|'hunter'|'priest'
export const heroes={
 warrior:{name:'铁卫战士',power:'坚壁',text:'获得 3 点护甲',target:false},
 mage:{name:'星焰法师',power:'火花',text:'对敌方英雄或随从造成 1 点伤害',target:true},
 hunter:{name:'荒野猎手',power:'精准射击',text:'对敌方英雄造成 2 点伤害',target:true},
 priest:{name:'晨光牧师',power:'愈合',text:'为任意英雄或随从恢复 3 点生命',target:true}
} as const
export const heroIds=Object.keys(heroes) as HeroId[]
export type Effect='draw'|'heal'|'damage'|'armor'|'summon'
export type Card={id:string;name:string;cost:number;kind:'unit'|'damage'|'heal'|'draw'|'area'|'buff'|'freeze'|'armor';attack:number;health:number;value:number;trait?:'taunt'|'charge';shield?:boolean;hero?:HeroId;cry?:Effect;cryValue?:number;death?:Effect;deathValue?:number;text:string}
const unit=(id:string,name:string,cost:number,attack:number,health:number,text:string,extra:Partial<Card>={}):Card=>({id,name,cost,kind:'unit',attack,health,value:0,text,...extra})
const spell=(id:string,name:string,cost:number,kind:Card['kind'],value:number,text:string,extra:Partial<Card>={}):Card=>({id,name,cost,kind,attack:0,health:0,value,text,...extra})
export const cards:Card[]=[
 // 22 neutral units
 unit('sprite','微光精灵',1,1,2,'轻盈的荒野伙伴'),
 unit('wolf','荒野猎狼',2,3,2,'锋利的獠牙，脆弱的身躯'),
 unit('guard','铁壁卫士',2,1,4,'嘲讽 · 保护你的英雄',{trait:'taunt'}),
 unit('scout','疾风斥候',3,2,2,'冲锋 · 入场即可攻击',{trait:'charge'}),
 unit('knight','暮色骑士',4,4,5,'攻守兼备的战士'),
 unit('warden','森林守望者',5,3,7,'嘲讽 · 坚守防线',{trait:'taunt'}),
 unit('giant','岩脊巨人',6,6,7,'沉默的荒原守护者'),
 unit('scribe','旅途抄写员',2,1,2,'战吼：抽一张牌',{cry:'draw',cryValue:1}),
 unit('healer','山谷医师',3,2,3,'战吼：为自己英雄恢复 3 点生命',{cry:'heal',cryValue:3}),
 unit('sentinel','琥珀哨兵',3,2,3,'圣盾 · 抵挡一次伤害',{shield:true}),
 unit('runner','沙地奔袭者',4,4,2,'冲锋 · 入场即可攻击',{trait:'charge'}),
 unit('beetle','甲壳虫',1,1,3,'坚韧的小小旅伴'),
 unit('archer','灰羽弓手',3,3,2,'战吼：对生命最低的敌方英雄造成 2 点伤害',{cry:'damage',cryValue:2}),
 unit('shieldbearer','古堡执盾者',4,2,6,'嘲讽',{trait:'taunt'}),
 unit('spark','余烬灵',2,2,1,'亡语：对生命最低的敌方英雄造成 2 点伤害',{death:'damage',deathValue:2}),
 unit('scholar','流浪学者',4,2,4,'战吼：抽两张牌',{cry:'draw',cryValue:2}),
 unit('oracle','星河先知',5,4,4,'亡语：抽两张牌',{death:'draw',deathValue:2}),
 unit('phoenix','铜翼幼鸟',3,3,2,'亡语：召唤一个 1/2 微光精灵',{death:'summon',deathValue:1}),
 unit('colossus','白银巨像',7,6,7,'圣盾',{shield:true}),
 unit('titan','荒原泰坦',8,8,9,'嘲讽',{trait:'taunt'}),
 unit('veteran','佣兵老兵',3,3,4,'沉稳可靠的前线伙伴'),
 unit('protector','遗迹守护者',5,3,5,'嘲讽，圣盾',{trait:'taunt',shield:true}),
 // 8 class units
 unit('ironforge','铸甲师',3,2,4,'战吼：获得 4 点护甲',{hero:'warrior',cry:'armor',cryValue:4}),
 unit('ironlord','钢铁统领',6,5,7,'嘲讽；亡语：获得 5 点护甲',{hero:'warrior',trait:'taunt',death:'armor',deathValue:5}),
 unit('apprentice','星焰学徒',2,2,2,'战吼：对生命最低的敌方英雄造成 1 点伤害',{hero:'mage',cry:'damage',cryValue:1}),
 unit('arcanist','秘法领航者',5,4,5,'战吼：抽两张牌',{hero:'mage',cry:'draw',cryValue:2}),
 unit('hawk','裂风战鹰',3,3,2,'冲锋',{hero:'hunter',trait:'charge'}),
 unit('stalker','荒林追猎者',5,5,4,'亡语：对生命最低的敌方英雄造成 3 点伤害',{hero:'hunter',death:'damage',deathValue:3}),
 unit('acolyte','晨光侍者',2,1,4,'战吼：为自己英雄恢复 3 点生命',{hero:'priest',cry:'heal',cryValue:3}),
 unit('seraph','黎明使者',6,4,7,'圣盾；亡语：为自己英雄恢复 6 点生命',{hero:'priest',shield:true,death:'heal',deathValue:6}),
 // 16 neutral spells
 spell('bolt','烈焰箭',2,'damage',3,'对敌方英雄或随从造成 3 点伤害'),
 spell('meteor','陨星',5,'damage',7,'对敌方英雄或随从造成 7 点伤害'),
 spell('spring','复苏之泉',2,'heal',5,'为任意英雄或随从恢复 5 点生命'),
 spell('wisdom','古卷启示',2,'draw',2,'抽两张牌'),
 spell('storm','雷霆风暴',4,'area',2,'对所有敌方随从造成 2 点伤害'),
 spell('sting','荆棘刺',1,'damage',2,'对敌方英雄或随从造成 2 点伤害'),
 spell('sunrise','晨曦祝福',1,'heal',3,'为任意英雄或随从恢复 3 点生命'),
 spell('meditate','静思',1,'draw',1,'抽一张牌'),
 spell('insight','深层洞察',4,'draw',3,'抽三张牌'),
 spell('blessing','勇气祝福',2,'buff',2,'为己方随从增加 2 攻击与 2 生命'),
 spell('growth','巨木生长',4,'buff',4,'为己方随从增加 4 攻击与 4 生命'),
 spell('frost','寒霜锁链',2,'freeze',0,'冻结敌方随从，跳过其下回合攻击'),
 spell('earthquake','大地震颤',6,'area',4,'对所有敌方随从造成 4 点伤害'),
 spell('plating','临时装甲',2,'armor',5,'自己英雄获得 5 点护甲'),
 spell('comet','彗星冲击',3,'damage',4,'对敌方英雄或随从造成 4 点伤害'),
 spell('renewal','生命回响',4,'heal',9,'为任意英雄或随从恢复 9 点生命'),
 // 8 class spells
 spell('bastion','钢铁堡垒',3,'armor',8,'获得 8 点护甲',{hero:'warrior'}),
 spell('battlecry','战意灌注',2,'buff',3,'为己方随从增加 3 攻击与 3 生命',{hero:'warrior'}),
 spell('inferno','星焰爆裂',4,'damage',6,'对敌方英雄或随从造成 6 点伤害',{hero:'mage'}),
 spell('blizzard','冰封领域',5,'area',3,'对所有敌方随从造成 3 点伤害并冻结',{hero:'mage'}),
 spell('snipe','致命狙击',3,'damage',5,'对敌方英雄或随从造成 5 点伤害',{hero:'hunter'}),
 spell('hunt','猎踪追寻',2,'draw',2,'抽两张牌',{hero:'hunter'}),
 spell('radiance','圣光涌动',2,'heal',7,'为任意英雄或随从恢复 7 点生命',{hero:'priest'}),
 spell('sanctify','圣化',3,'buff',3,'为己方随从增加 3 攻击与 3 生命并获得圣盾',{hero:'priest'}),

]
export const findCard=(id:string)=>cards.find(c=>c.id===id)!

export const cardArt=(id:string)=>`/wild-hearth/card-art/${id}.jpg`
