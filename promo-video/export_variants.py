"""Export male narration and music-only versions of the current video."""
import json
import subprocess
from render import ROOT, scenes

def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

def duration(path):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(path)]).decode().split('"duration": "')[1].split('"')[0])

def main():
    inputs=['-i',str(ROOT/'silent.mp4'),'-i',str(ROOT/'music.wav')]
    filters=['[1:a]volume=0.48[music]']
    timings=[]
    for i,(_,_,speech) in enumerate(scenes):
        path=ROOT/f'male-voice-{i}.aiff'
        run(['say','-v','Eddy (中文（中国大陆）)','-r','235','-o',str(path),speech])
        seconds=duration(path)
        tempo=max(1,seconds/5.65)
        timings.append({'scene':i+1,'source_duration':seconds,'tempo':tempo})
        inputs+=['-i',str(path)]
        filters.append(f'[{i+2}:a]atempo={tempo:.6f},apad,atrim=0:5.8,adelay={i*6000}|{i*6000}[v{i}]')
    filters.append('[music]'+''.join(f'[v{i}]' for i in range(6))+'amix=inputs=7:normalize=0,alimiter=limit=0.95[a]')
    run(['ffmpeg','-y',*inputs,'-filter_complex',';'.join(filters),'-map','0:v','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-t','36','-movflags','+faststart',str(ROOT/'GameLink-宣传介绍-男声版.mp4')])
    run(['ffmpeg','-y','-i',str(ROOT/'silent.mp4'),'-i',str(ROOT/'music.wav'),'-map','0:v','-map','1:a','-af','volume=0.48','-c:v','copy','-c:a','aac','-b:a','192k','-t','36','-movflags','+faststart',str(ROOT/'GameLink-宣传介绍-无配音版.mp4')])
    (ROOT/'variants-check.json').write_text(json.dumps({'voice':'Eddy (中文（中国大陆）)','scenes':timings},ensure_ascii=False,indent=2))

if __name__=='__main__': main()
