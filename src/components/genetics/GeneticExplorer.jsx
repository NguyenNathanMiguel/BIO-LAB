import React, { useEffect, useRef, useState } from 'react';
import useGeneticScene from '@/hooks/useGeneticScene';
import { CHALLENGES } from '@/lib/geneticMaterialData';
import GeneticToolbar from '@/components/genetics/GeneticToolbar';
import GeneticViewControls from '@/components/genetics/GeneticViewControls';
import GeneticChallenge from '@/components/genetics/GeneticChallenge';
import GeneLayer from '@/components/genetics/GeneLayer';
import GeneticCanvasAnnotation from '@/components/genetics/GeneticCanvasAnnotation';
import GeneticStructureList from '@/components/genetics/GeneticStructureList';

export default function GeneticExplorer() {
  const host=useRef(null),apiRef=useRef(null),annotationRef=useRef(null),[mode,setMode]=useState('DNA'),[selected,setSelected]=useState(null),[rotating,setRotating]=useState(false),[level,setLevel]=useState(1),[geneOpen,setGeneOpen]=useState(false),[active,setActive]=useState(false),[challengeIndex,setChallengeIndex]=useState(0),[feedback,setFeedback]=useState(null),[completed,setCompleted]=useState(0);
  const challenges=CHALLENGES[mode];
  useGeneticScene(host,mode,selected,false,choice=>select(choice),apiRef,annotationRef);
  useEffect(()=>{setSelected(null);setActive(false);setFeedback(null);setChallengeIndex(0);setCompleted(0);setRotating(false);},[mode]);
  const select=choice=>{setSelected(choice);if(!active||feedback?.correct)return;const current=challenges[challengeIndex];setFeedback(choice.id===current.answer?{correct:true,message:'Chính xác! Bạn đã nhận diện đúng cấu trúc.'}:{correct:false,message:`Chưa đúng. Gợi ý: ${current.hint}`});};
  const focusChoice=choice=>{select(choice);requestAnimationFrame(()=>apiRef.current?.focus(choice));};
  const changeLevel=value=>{setLevel(value);apiRef.current?.zoom([0,1,1.18,1.38,1.55,1.72][value]);if(value===4)focusChoice({id:'nucleotide',nucleotide:0});if(value===5)focusChoice({id:'adenine',pairIndex:0});};
  const next=()=>{setCompleted(c=>Math.min(c+1,challenges.length));setChallengeIndex(i=>(i+1)%challenges.length);setFeedback(null);};
  return <div className="space-y-4" data-testid="genetic-explorer"><GeneticToolbar mode={mode} onMode={setMode} level={level} onLevel={changeLevel}/><div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]"><div className="min-w-0"><div className="relative h-[520px] overflow-hidden rounded-3xl border border-lab-edge bg-lab-surface shadow-2xl md:h-[640px]"><div ref={host} className="relative h-full w-full"><GeneticCanvasAnnotation ref={annotationRef} selected={selected}/></div><div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-lab-surface/80 px-3 py-2 text-[10px] text-lab-muted backdrop-blur">Kéo để xoay · Cuộn để zoom · Nhấp cấu trúc để tìm hiểu</div></div><div className="mt-4"><GeneticViewControls apiRef={apiRef} rotating={rotating} setRotating={setRotating} onReset={()=>setSelected(null)}/></div></div><div className="space-y-4"><GeneLayer open={geneOpen} onToggle={()=>setGeneOpen(v=>!v)} onSelect={focusChoice}/><GeneticChallenge challenge={challenges[challengeIndex]} index={challengeIndex} total={challenges.length} active={active} feedback={feedback} completed={completed} onStart={()=>{setActive(true);setFeedback(null);}} onNext={next}/></div></div><GeneticStructureList mode={mode} selected={selected} onSelect={focusChoice}/></div>;
}