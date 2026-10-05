import bank from './question-bank.json'
export const QUESTIONS=bank
export const GAME_LENGTH=15
export function drawQuestions():number[]{
 const pool=Array.from({length:QUESTIONS.length},(_,i)=>i)
 for(let i=pool.length-1;i>0;i--){
  const range=i+1,limit=Math.floor(0x100000000/range)*range
  let value:number;do{value=crypto.getRandomValues(new Uint32Array(1))[0]!}while(value>=limit)
  const j=value%range;[pool[i],pool[j]]=[pool[j]!,pool[i]!]
 }
 return pool.slice(0,GAME_LENGTH)
}
